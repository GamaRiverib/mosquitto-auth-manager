import { UserRule } from "./user_rule";
import { ID } from "./entity";
import { MosquittoAuthRepository } from "./repository";
import { Rule, RuleEntity } from "./rule";
import { User, UserEntity } from "./user";
import { getPBKDF2Password } from "./passwords_file";

export function getRepositoryManager(repository: MosquittoAuthRepository): MosquittoAuthRepositoryManager {
  return new MosquittoAuthRepositoryManagerImpl(repository);
}

export interface Paging {
  query?: string;
  page?: number;
  limit?: number;
}

export interface MosquittoAuthRepositoryManager {

  getUserList(paging?: Paging): Promise<UserEntity[]>;
  getUser(id: ID): Promise<UserEntity | undefined>;
  findUserByUsername(username: string): Promise<UserEntity | undefined>;
  create(user: User): Promise<UserEntity>;
  updateUserPassword(id: ID, password: string): Promise<void>;
  addUserRule(id: ID, rule: UserRule): Promise<void>;
  removeUserRule(id: ID, rule: UserRule): Promise<void>;
  deleteUser(id: ID): Promise<void>;
  getRules(): Promise<RuleEntity[]>;
  createRule(rule: Rule): Promise<RuleEntity>;
  deleteRule(id: ID): Promise<void>;
  
}

class MosquittoAuthRepositoryManagerImpl implements MosquittoAuthRepositoryManager {

  constructor(private repository: MosquittoAuthRepository) {

  }

  async getUserList(paging?: Paging): Promise<UserEntity[]> {
    let query: string, page: number, limit: number;
    if (paging) {
      query = paging.query;
      page = paging.page;
      limit = paging.limit;
    }
    const entities = await this.repository.findUsers(query, page, limit);
    const users = entities.map(e => {
      e.password = undefined;
      return e;
    });
    return users;
  }

  async getUser(id: ID): Promise<UserEntity> {
    const entity = await this.repository.getUserById(id);
    if (entity) {
      entity.password = undefined;
    }
    return entity;
  }

  async findUserByUsername(username: string): Promise<UserEntity> {
    const entity = await this.repository.getUser(username);
    if (entity) {
      entity.password = undefined;
    }
    return entity;
  }

  async create(user: User): Promise<UserEntity> {
    const current = await this.repository.getUser(user.username);
    if (current) {
      throw new Error(`Username "${user.username}" already exists`);
    }
    user.password = getPBKDF2Password(user.password);
    const entity = await this.repository.createUser(user);
    entity.password = undefined;
    return entity;
  }

  async updateUserPassword(id: ID, password: string): Promise<void> {
    const entity = await this.repository.getUserById(id);
    if (!entity) {
      throw new Error(`User with ID "${id}" not found`);
    }
    entity.password = getPBKDF2Password(password);
    return this.repository.updateUser(entity);
  }

  async addUserRule(id: ID, rule: UserRule): Promise<void> {
    const entity = await this.repository.getUserById(id);
    if (!entity) {
      throw new Error(`User with ID "${id}" not found`);
    }
    if (!entity.acls) {
      entity.acls = [];
    }
    entity.acls.push(rule);
    return this.repository.updateUser(entity);
  }

  async removeUserRule(id: ID, rule: UserRule): Promise<void> {
    const entity = await this.repository.getUserById(id);
    if (!entity) {
      throw new Error(`User with ID "${id}" not found`);
    }
    if (!entity.acls) {
      entity.acls = [];
    }
    const index = entity.acls.findIndex(a => a.topic === rule.topic &&  a.acc === rule.acc);
    if (index < 0) {
      throw new Error("Acl not found");
    }
    entity.acls.splice(index, 1);
    return this.repository.updateUser(entity);
  }

  async deleteUser(id: ID): Promise<void> {
    const entity = await this.repository.getUserById(id);
    if (!entity) {
      throw new Error(`User with ID "${id}" not found`);
    }
    return this.repository.deleteUserById(id);
  }

  getRules(): Promise<RuleEntity[]> {
    return this.repository.getRules();
  }

  async createRule(rule: Rule): Promise<RuleEntity> {
    const rules = await this.repository.getRules();
    const index = rules.findIndex((r: RuleEntity) => {
      return r.type === rule.type &&
             r.value === rule.value &&
             r.acc === rule.acc;
    });
    if (index >= 0) {
      throw new Error("Rule already exists");
    }
    return this.repository.createRule(rule);
  }

  async deleteRule(id: ID): Promise<void> {
    const rule = await this.repository.getRuleById(id);
    if (!rule) {
      throw new Error(`Rule with ID "${id}" not found`);
    }
    return this.repository.deleteRuleById(id);
  }

}