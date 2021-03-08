import { readFileSync, writeFileSync } from "fs";

import stringify = require("json-stringify-safe");
import { ID } from "./entity";
import { MosquittoAuthRepository } from "./repository";
import { createRuleEntity, Rule, RuleEntity } from "./rule";
import { UserEntity, User, createUserEntity } from "./user";

const INDENTED = process.env.FILE_REPOSITORY_SAVE_INDENTED === "true";

export class MosquittoAuthFileRepository implements MosquittoAuthRepository {

  private users: UserEntity[];
  private rules: RuleEntity[];

  private static LOCK = false;
  private static QUEUE: (() => Promise<void>)[] = [];

  constructor(private usersFile: string, private rulesFile: string) {
    try {
      const usersContents: Buffer = readFileSync(usersFile);
      this.users = JSON.parse(usersContents.toString()) as UserEntity[];
      const rulesContents: Buffer = readFileSync(rulesFile);
      this.rules = JSON.parse(rulesContents.toString()) as RuleEntity[];
    } catch (error) {
      console.log(error);
    }
  }
  
  get busy(): boolean {
    return MosquittoAuthFileRepository.QUEUE.length > 0;
  }

  protected enqueueFunction<R>(fn: Function, context: any, params?: any): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      const name = fn.name;
      const item = async (): Promise<void> => {
        // console.debug("Running queue item", {  function: name, params });
        try {
          const response = await fn.apply(context, params);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      };
      MosquittoAuthFileRepository.QUEUE.push(item);
      this.dequeueFunction();
    });
  }

  private async dequeueFunction() {
    if (MosquittoAuthFileRepository.LOCK) {
      return;
    }
    const item = MosquittoAuthFileRepository.QUEUE.shift();
    if(!item) {
      try {
        await this.writeItems();
      } catch (reason) {
        // console.error("Error writing to file", { error: reason });
      }
      return;
    }
    try {
      MosquittoAuthFileRepository.LOCK = true;
      await item();
    } catch (error) {
      // console.error("Error running function", { item });
    } finally {
      // console.debug("Running queue item done");
      MosquittoAuthFileRepository.LOCK = false;
      this.dequeueFunction();
    }
  }

  private async writeItems(): Promise<void> {
    const i = INDENTED ? 2 : 0;
    writeFileSync(this.usersFile, stringify(this.users, null, i));
    writeFileSync(this.rulesFile, stringify(this.rules, null, i));
  }

  private getUsersReadOnly(): UserEntity[] {
    return JSON.parse(JSON.stringify(this.users));
  }

  private getRulesReadOnly(): RuleEntity[] {
    return JSON.parse(JSON.stringify(this.rules));
  }

  async findUsers(query?: string, page?: number, limit?: number): Promise<UserEntity[]> {
    let users = this.getUsersReadOnly() || [];
    if (query) {
      users = users.filter(u => u.username.indexOf(query) >= 0);
    }
    if (limit) {
      page = page || 1;
      users = users.slice((page - 1) * limit, limit);
    }
    return users;
  }

  async getUserById(id: ID): Promise<UserEntity> {
    return (this.getUsersReadOnly() || []).find(u => u.id === id);
  }

  async getUser(username: string): Promise<UserEntity> {
    return (this.getUsersReadOnly() || []).find(u => u.username === username);
  }

  private async _createUser(user: User): Promise<UserEntity> {
    const entity = createUserEntity(user);
    this.users.push(entity);
    return entity;
  }

  private async _updateUser(user: UserEntity): Promise<void> {
    const entity = await this.getUserById(user.id);
    if (!entity) {
      throw new Error("User not found");
    }
    entity.username = user.username;
    entity.password = user.password;
    entity.superuser = user.superuser;
    entity.acls = user.acls;
  }

  private async _deleteUserById(id: ID): Promise<void> {
    const index = this.users.findIndex(u => u.id === id);
    if (index < 0) {
      throw new Error("User not found");
    }
    this.users.splice(index, 1);
  }

  private async _deleteUser(username: string): Promise<void> {
    const index = this.users.findIndex(u => u.username === username);
    if (index < 0) {
      throw new Error("User not found");
    }
    this.users.splice(index, 1);
  }

  async getRules(): Promise<RuleEntity[]> {
    return this.getRulesReadOnly() || [];
  }

  async getRuleById(id: ID): Promise<RuleEntity> {
    return (this.getRulesReadOnly() || []).find(r => r.id === id);
  }

  private async _createRule(rule: Rule): Promise<RuleEntity> {
    const entity = createRuleEntity(rule);
    this.rules.push(entity);
    return entity;
  }

  private async _updateRule(rule: RuleEntity): Promise<void> {
    const entity = await this.getRuleById(rule.id);
    if (!entity) {
      throw new Error("Rule not found");
    }
    entity.type = rule.type;
    entity.value = rule.value;
    entity.acc = rule.acc;
  }
  
  private async _deleteRuleById(id: ID): Promise<void> {
    const index = this.rules.findIndex(r => r.id === id);
    if (index < 0) {
      throw new Error("Rule not found");
    }
    this.rules.splice(index, 1);
  }

  createUser(user: User): Promise<UserEntity> {
    return this.enqueueFunction<UserEntity>(this._createUser, this, [user]);
  }

  updateUser(user: UserEntity): Promise<void> {
    return this.enqueueFunction<void>(this._updateUser, this, [user]);
  }

  deleteUserById(id: ID): Promise<void> {
    return this.enqueueFunction<void>(this._deleteUserById, this, [id]);
  }

  deleteUser(username: string): Promise<void> {
    return this.enqueueFunction<void>(this._deleteUser, this, [username]);
  }

  createRule(rule: Rule): Promise<RuleEntity> {
    return this.enqueueFunction<RuleEntity>(this._createRule, this, [rule]);
  }

  updateRule(rule: RuleEntity): Promise<void> {
    return this.enqueueFunction<void>(this._updateRule, this, [rule]);
  }

  deleteRuleById(id: ID): Promise<void> {
    return this.enqueueFunction<void>(this._deleteRuleById, this, [id]);
  }

}