import { v4 as generateUuid } from "uuid";
import { generate as generateShortUuid } from "short-uuid";

import { Acc } from "./acc";
import { Entity, ID } from "./entity";

const SHORT_UUID = process.env.USE_SHORT_UUID || undefined;

export type RuleType = "topic" | "pattern";

export class Rule {
  type: RuleType;
  value: string;
  acc?: Acc;
}

export class RuleEntity extends Rule implements Entity {
  id: ID;
}

export function createRuleEntity(rule: Rule): RuleEntity {
  const entity = rule as RuleEntity;
  entity.id = (SHORT_UUID ? generateShortUuid() : generateUuid()) as ID;
  return entity;
}
