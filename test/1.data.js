"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = exports.users = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const short_uuid_1 = require("short-uuid");
const build_1 = require("../build");
const directory = path_1.join(__dirname, "data");
exports.users = [
    {
        id: short_uuid_1.generate(),
        username: "user1",
        password: build_1.getPasswordHash("test1"),
        acls: [{
                acc: build_1.Acc.READ,
                topic: "users/r/user1"
            }]
    }, {
        id: short_uuid_1.generate(),
        username: "user2",
        password: build_1.getPasswordHash("test2")
    }, {
        id: short_uuid_1.generate(),
        username: "user3",
        password: build_1.getPasswordHash("test3")
    }, {
        id: short_uuid_1.generate(),
        username: "user4",
        password: build_1.getPasswordHash("test4")
    }, {
        id: short_uuid_1.generate(),
        username: "user5",
        password: build_1.getPasswordHash("test5")
    }
];
fs_1.writeFileSync(path_1.join(directory, "1.users.repository.json"), JSON.stringify(exports.users));
exports.rules = [
    {
        id: short_uuid_1.generate(),
        type: "topic",
        value: "test/1/write",
        acc: build_1.Acc.WRITE
    }, {
        id: short_uuid_1.generate(),
        type: "topic",
        value: "test/1/read",
        acc: build_1.Acc.READ
    }, {
        id: short_uuid_1.generate(),
        type: "topic",
        value: "test/2/rw",
        acc: build_1.Acc.READ_WRITE
    }, {
        id: short_uuid_1.generate(),
        type: "pattern",
        value: "test/2/#",
        acc: build_1.Acc.READ
    }, {
        id: short_uuid_1.generate(),
        type: "topic",
        value: "test/+/3",
        acc: build_1.Acc.WRITE
    }
];
fs_1.writeFileSync(path_1.join(directory, "1.rules.repository.json"), JSON.stringify(exports.rules));
