"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
require("mocha");
const chai = require("chai");
const build_1 = require("../build");
const _1_data_1 = require("./1.data");
chai.should();
describe("Repository Manager Test", () => {
    const usersFile = path_1.join(__dirname, "data", "1.users.repository.json");
    const rulesFile = path_1.join(__dirname, "data", "1.rules.repository.json");
    const repository = new build_1.MosquittoAuthFileRepository(usersFile, rulesFile);
    const manager = build_1.getRepositoryManager(repository);
    describe("getUserList", () => {
        it("Debería obtener la lista de todos los usuarios", () => __awaiter(void 0, void 0, void 0, function* () {
            const userList = yield manager.getUserList();
            chai.assert(userList.length === _1_data_1.users.length, "El número de usuarios debería ser igual");
        }));
        it("Debería obtener solamente un usuario con el username igual a 'user1'", () => __awaiter(void 0, void 0, void 0, function* () {
            const query = "user1";
            const userList = yield manager.getUserList({ query });
            chai.assert(userList.length === 1, "El resultado debería tener solamente un elemento");
            const user = userList[0];
            user.should.have.property("id");
            user.should.have.property("username");
            chai.assert(user.username === query, "El nombre de usuario no coincide");
            user.should.have.property("password");
            chai.assert(user.password === undefined, "El password debería ser 'undefined'");
        }));
        it("Debería obtener una lista con solamente 3 elementos", () => __awaiter(void 0, void 0, void 0, function* () {
            const limit = 3;
            const userList = yield manager.getUserList({ limit });
            chai.assert(userList.length === limit, `El resultado debería tener solamente ${limit} elementos`);
        }));
    });
    describe("getUser", () => {
        it("Debería obtener 'undefined' cuando el id del usuario no existe", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield manager.getUser("fake");
            chai.assert(user === undefined, "Se esperaba que retornará 'undefined'");
        }));
        it("Debería obtener el elemento con el id indicado'", () => __awaiter(void 0, void 0, void 0, function* () {
            const u = _1_data_1.users[0];
            const user = yield manager.getUser(u.id);
            chai.assert(user !== undefined, "No debería ser 'undefined'");
            user.should.have.property("id");
            user.should.have.property("username");
            user.should.have.property("password");
            chai.assert(user.id === u.id, "El id del usuario no coincide");
            chai.assert(user.username === u.username, "El nombre del usuario no coincide");
            chai.assert(user.password === undefined, "El password debería ser 'undefined'");
        }));
    });
    describe("findUserByUsername", () => {
        it("Debería obtener 'undefined' cuando el nombre de usuario no existe", () => __awaiter(void 0, void 0, void 0, function* () {
            const username = "fake";
            const user = yield manager.findUserByUsername(username);
            chai.assert(user === undefined, "Se esperaba que retornará 'undefined'");
        }));
        it("Debería obtener el elemento con el id indicado'", () => __awaiter(void 0, void 0, void 0, function* () {
            const username = "user5";
            const user = yield manager.findUserByUsername(username);
            chai.assert(user !== undefined, "No debería ser 'undefined'");
            user.should.have.property("id");
            user.should.have.property("username");
            user.should.have.property("password");
            chai.assert(user.username === username, "El nombre del usuario no coincide");
            chai.assert(user.password === undefined, "El password debería ser 'undefined'");
        }));
    });
    describe("create", () => {
        it("Debería lanzar una excepción cuando el nombre de usuario ya existe", () => __awaiter(void 0, void 0, void 0, function* () {
            const username = "user1";
            const user = { username, password: "test1" };
            try {
                yield manager.create(user);
            }
            catch (error) {
                error.should.have.property("message");
                chai.assert(error.message, `Username "${username}" already exists`);
            }
        }));
        it("Debería crear un nuevo usuario exitosamente", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = { username: "user6", password: "test6" };
            const entity = yield manager.create(user);
            entity.should.have.property("id");
            entity.should.have.property("username");
            entity.should.have.property("password");
            chai.assert(entity.id !== undefined, "El id del usuario no debería ser 'undefined'");
            chai.assert(entity.username === user.username, "El nombre del usuario no coincide");
            chai.assert(entity.password === undefined, "El password debería ser 'undefined'");
        }));
    });
    describe("updateUserPassword", () => {
        it("Debería lanzar una excepción cuando el id de usuario no existe", () => __awaiter(void 0, void 0, void 0, function* () {
            const id = "fake";
            try {
                yield manager.updateUserPassword(id, "test");
            }
            catch (error) {
                error.should.have.property("message");
                chai.assert(error.message, `User with ID "${id}" not found`);
            }
        }));
        it("Debería actualizar el password del usuario exitosamente", () => __awaiter(void 0, void 0, void 0, function* () {
            const id = _1_data_1.users[3].id;
            const password = "password3";
            yield manager.updateUserPassword(id, password);
        }));
    });
    describe("addUserRule", () => {
        it("Debería lanzar una excepción cuando el id de usuario no existe", () => __awaiter(void 0, void 0, void 0, function* () {
            const id = "fake";
            const rule = { acc: build_1.Acc.READ, topic: "test/1/r" };
            try {
                yield manager.addUserRule(id, rule);
            }
            catch (error) {
                error.should.have.property("message");
                chai.assert(error.message, `User with ID "${id}" not found`);
            }
        }));
        it("Debería agregar la regla de usuario exitosamente", () => __awaiter(void 0, void 0, void 0, function* () {
            const id = _1_data_1.users[2].id;
            const rule = { acc: build_1.Acc.READ, topic: "test/1/rw" };
            yield manager.addUserRule(id, rule);
        }));
    });
    describe("removeUserRule", () => {
        it("Debería lanzar una excepción cuando el id de usuario no existe", () => __awaiter(void 0, void 0, void 0, function* () {
            const id = "fake";
            const rule = { acc: build_1.Acc.READ, topic: "test/1/r" };
            try {
                yield manager.removeUserRule(id, rule);
            }
            catch (error) {
                error.should.have.property("message");
                chai.assert(error.message, `User with ID "${id}" not found`);
            }
        }));
        it("Debería lanzar una excepción cuando la regla del usuario no existe", () => __awaiter(void 0, void 0, void 0, function* () {
            const id = _1_data_1.users[0].id;
            const rule = { acc: build_1.Acc.READ, topic: "test/1/r" };
            try {
                yield manager.removeUserRule(id, rule);
            }
            catch (error) {
                error.should.have.property("message");
                chai.assert(error.message, "Acl not found");
            }
        }));
        it("Debería eliminar la regla del usuario exitosamente", () => __awaiter(void 0, void 0, void 0, function* () {
            const id = _1_data_1.users[0].id;
            const rule = _1_data_1.users[0].acls[0];
            yield manager.removeUserRule(id, rule);
        }));
    });
    describe("deleteUser", () => {
        it("Debería lanzar una excepción cuando el id de usuario no existe", () => __awaiter(void 0, void 0, void 0, function* () {
            const id = "fake";
            try {
                yield manager.deleteUser(id);
            }
            catch (error) {
                error.should.have.property("message");
                chai.assert(error.message, `User with ID "${id}" not found`);
            }
        }));
        it("Debería eliminar el usuario exitosamente", () => __awaiter(void 0, void 0, void 0, function* () {
            const id = _1_data_1.users[3].id;
            yield manager.deleteUser(id);
        }));
    });
    describe("getRules", () => {
        it("Debería obtener la lista de todas las reglas", () => __awaiter(void 0, void 0, void 0, function* () {
            const ruleList = yield manager.getRules();
            chai.assert(ruleList.length === _1_data_1.rules.length, "El número de reglas debería ser igual");
        }));
    });
    describe("createRule", () => {
        it("Debería lanzar una excepción cuando la regla ya existe", () => __awaiter(void 0, void 0, void 0, function* () {
            const rule = {
                type: _1_data_1.rules[0].type,
                value: _1_data_1.rules[0].value,
                acc: _1_data_1.rules[0].acc
            };
            try {
                yield manager.createRule(rule);
            }
            catch (error) {
                error.should.have.property("message");
                chai.assert(error.message, "Rule already exists");
            }
        }));
        it("Debería crear una nueva regla exitosamente", () => __awaiter(void 0, void 0, void 0, function* () {
            const rule = {
                type: "pattern",
                value: "users/+/messages",
                acc: build_1.Acc.READ_WRITE
            };
            const entity = yield manager.createRule(rule);
            entity.should.have.property("id");
            entity.should.have.property("type");
            entity.should.have.property("value");
            chai.assert(entity.id !== undefined, "El id de la regla no debería ser 'undefined'");
            chai.assert(entity.type === rule.type, "El tyipo de la regla no coincide");
            chai.assert(entity.value === rule.value, "El valor de la regla no coincide");
        }));
    });
    describe("deleteRule", () => {
        it("Debería lanzar una excepción cuando el id de la regla no existe", () => __awaiter(void 0, void 0, void 0, function* () {
            const id = "fake";
            try {
                yield manager.deleteRule(id);
            }
            catch (error) {
                error.should.have.property("message");
                chai.assert(error.message, `Rule with ID "${id}" not found`);
            }
        }));
        it("Debería eliminar la regla exitosamente", () => __awaiter(void 0, void 0, void 0, function* () {
            const id = _1_data_1.rules[3].id;
            yield manager.deleteRule(id);
        }));
    });
});
