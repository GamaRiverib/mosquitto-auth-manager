import { writeFileSync } from "fs";
import { eachLine } from "line-reader";
import { getAccAsString, getAccFromString } from "./acc";
import { UserRule } from "./user_rule";
import { Rule, RuleType } from "./rule";
import { User } from "./user";

export interface AclFile {
  getUserList(): Promise<User[]>;
  addUser(username: string, acls?: UserRule[]): Promise<void>;
  removeUser(username: string): Promise<void>;
  addUserRule(username: string, acl: UserRule): Promise<void>;
  removeUserRule(username: string, acl: UserRule): Promise<void>;
  getRuleList(): Promise<Rule[]>;
  addRule(rule: Rule): Promise<void>;
  removeRule(rule: Rule): Promise<void>;
}

export function getAclFile(filePath: string): AclFile {
  return new AclFileImpl(filePath);
}

const USER_LINE_PATTERN = /^(user){1}(\s)*(?<username>(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._-]+(?<![_.])){1}$/gs;
const RULE_LINE_PATTERN = /^(?<type>pattern|topic){1}(\s)*(?<acc>write|read|readwrite)?(\s)*(?<value>[a-zA-Z0-9#+_\/]*)$/gs;

class AclFileImpl implements AclFile {

  private userRules: User[];
  private rules: Rule[];

  constructor(private filePath: string) {
    this.userRules = [];
    this.rules = [];
    this.readFile();
  }

  private readFile(): void {
    try {
      eachLine(this.filePath, line => {
        if (line.match(USER_LINE_PATTERN)) {
          console.log("user", line);

          const exec = USER_LINE_PATTERN.exec(line);
          if (!exec || !exec.groups) {
            return;
          }
          const username = exec.groups.username;
          const password = "";
          this.userRules.push({ username, password });
        } else if (line.match(RULE_LINE_PATTERN)) {
          console.log("rule", line);

          const exec = RULE_LINE_PATTERN.exec(line);
          if (!exec || exec.groups) {
            return;
          }
          const type = exec.groups.type as RuleType;
          const acc = getAccFromString(exec.groups.acc);
          const value = exec.groups.value;
          this.rules.push({ type, value, acc });
        }
      });
      console.log(this.userRules);
      console.log(this.rules);
    } catch (error) {
      console.log(error);
    }
  }

  private saveFile(): void {
    try {
      let content = "";
      this.userRules.forEach(u => {
        content += `user ${u.username}\r\n`;
        if (u.acls) {
          u.acls.forEach(a => {
            content += `topic ${getAccAsString(a.acc).toLowerCase()} ${a.topic}`;
          });
        }
        content += "\r\n";
      });
      this.rules.forEach(r => {
        content += `${r.type} ${ r.acc ? getAccAsString(r.acc).toLowerCase() : "" } ${r.value}`;
      });
      writeFileSync(this.filePath, content);
    } catch (error) {
      console.log(error);
    }
  }

  async getUserList(): Promise<User[]> {
    return this.userRules;
  }

  async addUser(username: string, acls?: UserRule[]): Promise<void> {
    const password = undefined;
    this.userRules.push({ username, password, acls });
    this.saveFile();
  }

  async removeUser(username: string): Promise<void> {
    const index = this.userRules.findIndex(u => u.username === username);
    if (index < 0) {
      throw new Error("User not found");
    }
    this.userRules.splice(index, 1);
    this.saveFile();
  }

  async addUserRule(username: string, rule: UserRule): Promise<void> {
    const user = this.userRules.find(u => u.username === username);
    if (!user) {
      throw new Error("User not found");
    }
    if (!user.acls) {
      user.acls = [];
    }
    user.acls.push(rule);
    this.saveFile();
  }

  async removeUserRule(username: string, rule: UserRule): Promise<void> {
    const user = this.userRules.find(u => u.username === username);
    if (!user) {
      throw new Error("User not found");
    }
    if (!user.acls) {
      throw new Error("Acl not found");
    }
    const index = user.acls.findIndex(a => a.topic === rule.topic && a.acc === rule.acc);
    if (index < 0) {
      throw new Error("Acl not found");
    }
    user.acls.splice(index, 1);
    this.saveFile();
  }

  async getRuleList(): Promise<Rule[]> {
    return this.rules;
  }

  async addRule(rule: Rule): Promise<void> {
    const current = this.rules.find(r => {
      return r.type === rule.type &&
             r.value === rule.value &&
             r.acc === rule.acc;
    });
    if (current) {
      throw new Error("Rule already exists");
    }
    this.rules.push(rule);
  }

  async removeRule(rule: Rule): Promise<void> {
    const index = this.rules.findIndex(r => {
      return r.type === rule.type &&
             r.value === rule.value &&
             r.acc === rule.acc;
    });
    if (index < 0) {
      throw new Error("Rule not found");
    }
    this.rules.splice(index, 1);
  }

}
