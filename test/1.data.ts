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
writeFileSync(join(directory, "acls"), acls);

let passwords = "test1:PBKDF2$sha512$100000$2WQHK5rjNN+oOT+TZAsWAw==$TDf4Y6J+9BdnjucFQ0ZUWlTwzncTjOOeE00W4Qm8lfPQyPCZACCjgfdK353jdGFwJjAf6vPAYaba9+z4GWK7Gg==\r\n";
passwords += "test2:PBKDF2$sha512$100000$o513B9FfaKTL6xalU+UUwA==$mAUtjVg1aHkDpudOnLKUQs8ddGtKKyu+xi07tftd5umPKQKnJeXf1X7RpoL/Gj/ZRdpuBu5GWZ+NZ2rYyAsi1g==\r\n";
passwords += "test3:PBKDF2$sha512$100000$gDJp1GiuxauYi6jM+aI+vw==$9Rn4GrsfUkpyXdqfN3COU4oKpy7NRiLkcyutQ7I3ki1I2oY8/fuBnu+3oPKOm8WkAlpOnuwvTMGvii5QIIKmWA==\r\n";
passwords += "test with space:PBKDF2$sha512$100000$uB2YB/cgHc+FOOzzfyy8TQ==$+m2jZlNjJ9w7GEDvcThfJ2fJGvClupdh/ygamPDrxks+CKv5SlcFMwIjElDrosmpMYMAhtGcE0CEhAFMQ2EqQQ==\r\n";
passwords += "test5:PBKDF2$sha512$100000$o513B9FfaKTL6xalU+UUwA==$mAUtjVg1aHkDpudOnLKUQs8ddGtKKyu+xi07tftd5umPKQKnJeXf1X7RpoL/Gj/ZRdpuBu5GWZ+NZ2rYyAsi1g==\r\n";
passwords += "test6:PBKDF2$sha512$100000$o513B9FfaKTL6xalU+UUwA==$mAUtjVg1aHkDpudOnLKUQs8ddGtKKyu+xi07tftd5umPKQKnJeXf1X7RpoL/Gj/ZRdpuBu5GWZ+NZ2rYyAsi1g==\r\n";
passwords += "test7:PBKDF2$sha512$100000$o513B9FfaKTL6xalU+UUwA==$mAUtjVg1aHkDpudOnLKUQs8ddGtKKyu+xi07tftd5umPKQKnJeXf1X7RpoL/Gj/ZRdpuBu5GWZ+NZ2rYyAsi1g==\r\n";
writeFileSync(join(directory, "passwords"), passwords);
