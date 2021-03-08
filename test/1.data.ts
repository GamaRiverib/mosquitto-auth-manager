import { writeFileSync } from "fs";
import { join } from "path";

import { generate as generateShortUuid } from "short-uuid";

import { UserEntity, ID, RuleEntity, Acc, getPasswordHash } from "../build";

const directory = join(__dirname, "data");

export const users: UserEntity[] = [
  {
    id: generateShortUuid() as ID,
    username: "user1",
    password: getPasswordHash("test1"),
    acls: [{
      acc: Acc.READ,
      topic: "users/r/user1"
    }]
  }, {
    id: generateShortUuid() as ID,
    username: "user2",
    password: getPasswordHash("test2")
  }, {
    id: generateShortUuid() as ID,
    username: "user3",
    password: getPasswordHash("test3")
  }, {
    id: generateShortUuid() as ID,
    username: "user4",
    password: getPasswordHash("test4")
  }, {
    id: generateShortUuid() as ID,
    username: "user5",
    password: getPasswordHash("test5")
  }
];
writeFileSync(join(directory, "1.users.repository.json"), JSON.stringify(users));

export const rules: RuleEntity[] = [
  {
    id: generateShortUuid() as ID,
    type: "topic",
    value: "test/1/write",
    acc: Acc.WRITE
  }, {
    id: generateShortUuid() as ID,
    type: "topic",
    value: "test/1/read",
    acc: Acc.READ
  }, {
    id: generateShortUuid() as ID,
    type: "topic",
    value: "test/2/rw",
    acc: Acc.READ_WRITE
  }, {
    id: generateShortUuid() as ID,
    type: "pattern",
    value: "test/2/#",
    acc: Acc.READ
  }, {
    id: generateShortUuid() as ID,
    type: "topic",
    value: "test/+/3",
    acc: Acc.WRITE
  }
];
writeFileSync(join(directory, "1.rules.repository.json"), JSON.stringify(rules));