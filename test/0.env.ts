import { join } from "path";

process.env.NODE_ENV = "test";
process.env.MOSQUITTO_PASSWORDS_FILE_PATH = join(__dirname, "data", "passwords");
process.env.MOSQUITTO_ACL_FILE_PATH = join(__dirname, "data", "acls");
process.env.FILE_REPOSITORY_SAVE_INDENTED = "true";
process.env.USE_SHORT_UUID = "true";
process.env.HASHER_ITERATIONS = "100000";
process.env.HASHER_KEYLEN = "64";
process.env.HASHER_ALGORITHM = "sha512";
process.env.SALT_ENCODING = "base64";
process.env.SALT_SIZE = "16";
