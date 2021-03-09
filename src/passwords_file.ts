import { writeFileSync } from "fs";
import { randomBytes } from "crypto";
import { eachLine } from "line-reader";
import { pbkdf2Sync } from "pbkdf2";

import { UserPassword } from "./user";

const ITERATIONS = parseInt(process.env.HASHER_ITERATIONS || "100000");
const KEYLEN = parseInt(process.env.HASHER_KEYLEN || "64");
const ALGORITHM = process.env.HASHER_ALGORITHM || "sha512";
const SALT_ENCODING = (process.env.HASHER_SALT_ENCODING || "base64") as BufferEncoding;
const SALT_SIZE = parseInt(process.env.HASHER_SALT_SIZE || "16");

export interface PasswordsFile {
  load(filePath?: string): Promise<void>;
  getUserPasswords(): Promise<UserPassword[]>;
  addUserPassword(userPassword: UserPassword): Promise<void>;
  updateUserPassword(username: string, password: string): Promise<void>;
  deleteUserPassword(username: string): Promise<void>;
}

export function getPasswordsFile(filePath: string): PasswordsFile {
  return new PasswordsFileImpl(filePath);
}

export function getPasswordHash(password: string): string {
  const salt = randomBytes(SALT_SIZE).toString(SALT_ENCODING);
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, ALGORITHM).toString(SALT_ENCODING);
  return `PBKDF2$${ALGORITHM}$${ITERATIONS}$${salt}$${hash}`;
}

class PasswordsFileImpl implements PasswordsFile {

  private userPasswords: UserPassword[];

  constructor(private filePath: string) {
    this.userPasswords = [];
  }

  private readFile(cb: (err: any) => void, filePath?: string): void {
    eachLine(filePath || this.filePath, line => {
      const parts = line.split(":");
      if (parts.length === 2) {
        this.userPasswords.push({
          username: parts[0].trim(),
          password: parts[1].trim()
        });
      }
    }, cb);
  }

  private saveFile(): void {
    try {
      let content = "";
      this.userPasswords.forEach(u => {
        content += `${u.username}:${u.password}\r\n`;
      });
      writeFileSync(this.filePath, content);
    } catch (error) {
      console.log(error);
    }
  }

  load(filePath?: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.readFile((error) => {
        if (error) {
          return reject(error);
        }
        return resolve();
      }, filePath);
    });
  }

  async getUserPasswords(): Promise<UserPassword[]> {
    return this.userPasswords;
  }

  async addUserPassword(userPassword: UserPassword): Promise<void> {
    const index = this.userPasswords.findIndex(u => u.username === userPassword.username);
    if (index >= 0) {
      throw new Error(`Username ${userPassword.username} already exists`);
    }
    this.userPasswords.push(userPassword);
    this.saveFile();
  }

  async updateUserPassword(username: string, password: string): Promise<void> {
    const index = this.userPasswords.findIndex(u => u.username === username);
    if (index >= 0) {
      throw new Error(`Username ${username} does not exists`);
    }
    this.userPasswords[index].password = password;
  }

  async deleteUserPassword(username: string): Promise<void> {
    const index = this.userPasswords.findIndex(u => u.username === username);
    if (index < 0) {
      throw new Error(`Username ${username} does not exists`);
    }
    this.userPasswords.splice(index, 1);
    this.saveFile();
  }

}
