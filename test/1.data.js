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
        password: build_1.getPBKDF2Password("test1"),
        acls: [{
                acc: build_1.Acc.READ,
                topic: "users/r/user1"
            }]
    }, {
        id: short_uuid_1.generate(),
        username: "user2",
        password: build_1.getPBKDF2Password("test2")
    }, {
        id: short_uuid_1.generate(),
        username: "user3",
        password: build_1.getPBKDF2Password("test3")
    }, {
        id: short_uuid_1.generate(),
        username: "user4",
        password: build_1.getPBKDF2Password("test4")
    }, {
        id: short_uuid_1.generate(),
        username: "user5",
        password: build_1.getPBKDF2Password("test5")
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
let acls = "topic read test/general\r\n";
acls += "topic deny test/general_denied\r\n";
acls += "user test1\r\n";
acls += "topic write test/topic/1\r\n";
acls += "topic read test/topic/2\r\n";
acls += "topic readwrite readwrite/topic\r\n\r\n";
acls += "user test2\r\n";
acls += "topic read test/topic/+\r\n\r\n";
acls += "user test3\r\n";
acls += "topic read test/#\r\n";
acls += "topic deny test/denied\r\n\r\n";
acls += "user  test with space\r\n";
acls += "topic  test/space\r\n";
acls += "topic read test/multiple spaces in/topic\r\n";
acls += "  topic   read   test/lots   of   spaces   in/topic and borders  \r\n\r\n";
acls += "user not_present\r\n";
acls += "topic read test/not_present\r\n\r\n";
acls += "user test5\r\n";
acls += "topic write test5/msg\r\n\r\n";
acls += "user test7\r\n";
acls += "topic write test/topic/7\r\n\r\n";
acls += "pattern read test/%u\r\n";
acls += "pattern read test/%c\r\n";
acls += "pattern write test/%u/erase\r\n";
fs_1.writeFileSync(path_1.join(directory, "acls"), acls);
let passwords = "test1:PBKDF2$sha512$100000$2WQHK5rjNN+oOT+TZAsWAw==$TDf4Y6J+9BdnjucFQ0ZUWlTwzncTjOOeE00W4Qm8lfPQyPCZACCjgfdK353jdGFwJjAf6vPAYaba9+z4GWK7Gg==\r\n";
passwords += "test2:PBKDF2$sha512$100000$o513B9FfaKTL6xalU+UUwA==$mAUtjVg1aHkDpudOnLKUQs8ddGtKKyu+xi07tftd5umPKQKnJeXf1X7RpoL/Gj/ZRdpuBu5GWZ+NZ2rYyAsi1g==\r\n";
passwords += "test3:PBKDF2$sha512$100000$gDJp1GiuxauYi6jM+aI+vw==$9Rn4GrsfUkpyXdqfN3COU4oKpy7NRiLkcyutQ7I3ki1I2oY8/fuBnu+3oPKOm8WkAlpOnuwvTMGvii5QIIKmWA==\r\n";
passwords += "test with space:PBKDF2$sha512$100000$uB2YB/cgHc+FOOzzfyy8TQ==$+m2jZlNjJ9w7GEDvcThfJ2fJGvClupdh/ygamPDrxks+CKv5SlcFMwIjElDrosmpMYMAhtGcE0CEhAFMQ2EqQQ==\r\n";
passwords += "test5:PBKDF2$sha512$100000$o513B9FfaKTL6xalU+UUwA==$mAUtjVg1aHkDpudOnLKUQs8ddGtKKyu+xi07tftd5umPKQKnJeXf1X7RpoL/Gj/ZRdpuBu5GWZ+NZ2rYyAsi1g==\r\n";
passwords += "test6:PBKDF2$sha512$100000$o513B9FfaKTL6xalU+UUwA==$mAUtjVg1aHkDpudOnLKUQs8ddGtKKyu+xi07tftd5umPKQKnJeXf1X7RpoL/Gj/ZRdpuBu5GWZ+NZ2rYyAsi1g==\r\n";
passwords += "test7:PBKDF2$sha512$100000$o513B9FfaKTL6xalU+UUwA==$mAUtjVg1aHkDpudOnLKUQs8ddGtKKyu+xi07tftd5umPKQKnJeXf1X7RpoL/Gj/ZRdpuBu5GWZ+NZ2rYyAsi1g==\r\n";
fs_1.writeFileSync(path_1.join(directory, "passwords"), passwords);
