import { v4 as generateUuid } from "uuid";
import { generate as generateShortUuid } from "short-uuid";

import { UserRule } from "./user_rule";
import { Entity, ID } from "./entity";

const SHORT_UUID = process.env.USE_SHORT_UUID || undefined;

export class UserPassword {
  username: string;
  password: string;
}

export class User extends UserPassword {
  superuser?: boolean;
  acls?: UserRule[];
}

export class UserEntity extends User implements Entity {
  id: ID;
}

export function createUserEntity(user: User): UserEntity {
  const entity = user as UserEntity;
  entity.id = (SHORT_UUID ? generateShortUuid() : generateUuid()) as ID;
  return entity;
}
