import { ID } from "./entity";
import { Rule, RuleEntity } from "./rule";
import { User, UserEntity } from "./user";

export interface MosquittoAuthUsersRepository {
  findUsers(query?: string, page?: number, limit?: number): Promise<UserEntity[]>;
  getUserById(id: ID): Promise<UserEntity>;
  getUser(username: string): Promise<UserEntity>;
  createUser(user: User): Promise<UserEntity>;
  updateUser(user: UserEntity): Promise<void>;
  deleteUserById(id: ID): Promise<void>;
  deleteUser(username: string): Promise<void>;
}

export interface MosquittoAuthRulesRepository {
  getRules(): Promise<RuleEntity[]>;
  getRuleById(id: ID): Promise<RuleEntity>;
  createRule(rule: Rule): Promise<RuleEntity>;
  updateRule(rule: RuleEntity): Promise<void>;
  deleteRuleById(id: ID): Promise<void>;
}

export interface MosquittoAuthRepository extends MosquittoAuthUsersRepository, MosquittoAuthRulesRepository {
  
}