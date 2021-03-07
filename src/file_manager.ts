import { UserRule } from "./user_rule";
import { AclFile, getAclFile } from "./acl_file";
import { getPasswordHash, getPasswordsFile, PasswordsFile } from "./passwords_file";
import { Rule } from "./rule";
import { User } from "./user";

const MOSQUITTO_PASSWORDS_FILE_PATH = process.env.MOSQUITTO_PASSWORDS_FILE_PATH || "/etc/mosquitto/pwfile";
const MOSQUITTO_ACL_FILE_PATH = process.env.MOSQUITTO_ACL_FILE_PATH || "/etc/mosquitto/aclfile";

let manager: MosquittoAuthFileManager | null = null;

export function getFileManager(): MosquittoAuthFileManager {

  if (manager === null) {
    const passwordsFile = getPasswordsFile(MOSQUITTO_PASSWORDS_FILE_PATH);
    const aclFile = getAclFile(MOSQUITTO_ACL_FILE_PATH);
    manager = new MosquittoAuthFileManagerImpl(passwordsFile, aclFile);
  }
  return manager;

}

export interface MosquittoAuthFileManager {
  getUsers(): Promise<User[]>;
  getUser(username: string): Promise<User | undefined>;
  createUser(user: User): Promise<User>;
  updateUserPassword(username: string, password: string): Promise<void>;
  addUserRule(username: string, rule: UserRule): Promise<void>;
  removeUserRule(username: string, rule: UserRule): Promise<void>
  deleteUser(username: string): Promise<void>;
  getRules(): Promise<Rule[]>;
  createRule(rule: Rule): Promise<void>;
  deleteRule(rule: Rule): Promise<void>;
}

class MosquittoAuthFileManagerImpl implements MosquittoAuthFileManager {

  constructor(private passwordsFile: PasswordsFile, private aclsFile: AclFile) {

  }

  getUsers(): Promise<User[]> {
    return this.aclsFile.getUserList();
  }
  
  async getUser(username: string): Promise<User> {
    return (await this.aclsFile.getUserList()).find(a => a.username === username);
  }

  async createUser(user: User): Promise<User> {
    user.password = getPasswordHash(user.password);
    await this.passwordsFile.addUserPassword(user);
    await this.aclsFile.addUser(user.username, user.acls);
    user.password = undefined;
    return user;
  }

  updateUserPassword(username: string, password: string): Promise<void> {
    return this.passwordsFile.updateUserPassword(username, getPasswordHash(password));
  }

  addUserRule(username: string, rule: UserRule): Promise<void> {
    return this.aclsFile.addUserRule(username, rule);
  }

  removeUserRule(username: string, rule: UserRule): Promise<void> {
    return this.aclsFile.removeUserRule(username, rule);
  }

  async deleteUser(username: string): Promise<void> {
    await this.passwordsFile.deleteUserPassword(username);
    return this.aclsFile.removeUser(username);
  }

  getRules(): Promise<Rule[]> {
    return this.aclsFile.getRuleList();
  }

  createRule(rule: Rule): Promise<void> {
    return this.aclsFile.addRule(rule);
  }

  deleteRule(rule: Rule): Promise<void> {
    return this.aclsFile.removeRule(rule);
  }

}
