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
require("mocha");
const chai = require("chai");
const build_1 = require("../build");
chai.should();
build_1.getFileManager().then(manager => {
    describe("File Manager Test", () => __awaiter(void 0, void 0, void 0, function* () {
        describe("getUsers", () => {
            it("Debería obtener la lista de usuarios", () => __awaiter(void 0, void 0, void 0, function* () {
                const users = yield manager.getUsers();
                chai.assert(users.length === 6, "El resultado debería tener 6 elementos");
                users.forEach(u => {
                    u.should.have.property("username");
                    u.should.have.property("password");
                    chai.assert(u.password === "" || u.password === undefined, "El password del usuario no debería mostrarse");
                });
            }));
        });
        describe("getUser", () => {
            it("Debería obtener 'undefined' cuando el nombre del usuario no existe", () => __awaiter(void 0, void 0, void 0, function* () {
                const username = "fake";
                const user = yield manager.getUser(username);
                chai.assert(user === undefined, "Debería ser 'undefined'");
            }));
            it("Debería obtener la información del usuario con username 'test1'", () => __awaiter(void 0, void 0, void 0, function* () {
                const username = "test1";
                const user = yield manager.getUser(username);
                chai.assert(user !== undefined, "No debería ser 'undefined'");
                user.should.have.property("username");
                chai.assert(user.username === username, `Se esperaba que tuviera el username = '${username}'`);
            }));
        });
        describe("createUser", () => {
            it("Debería lanzar un error cuando el nombre de usuario ya existe", () => __awaiter(void 0, void 0, void 0, function* () {
                const username = "test1";
                const password = "test1";
                const user = { username, password };
                try {
                    yield manager.createUser(user);
                }
                catch (error) {
                    error.should.have.property("message");
                    chai.assert(error.message, `Username "${username}" already exists`);
                }
            }));
            it("Debería crear un nuevo usuario exitosamente", () => __awaiter(void 0, void 0, void 0, function* () {
                const username = "test4";
                const password = "test4";
                const user = { username, password };
                const saved = yield manager.createUser(user);
                saved.should.have.property("username");
                chai.assert(saved.username === username, "El nombre de usuario no coincide");
                chai.assert(saved.password === undefined, "El password debería ser 'undefined'");
            }));
        });
        describe("updateUserPassword", () => {
            it("Debería lanzar un error cuando el nombre de usuario no existe", () => __awaiter(void 0, void 0, void 0, function* () {
                const username = "fake";
                const password = "test";
                try {
                    yield manager.updateUserPassword(username, password);
                }
                catch (error) {
                    error.should.have.property("message");
                    chai.assert(error.message, `Username ${username} does not exists`);
                }
            }));
            it("Debería actualizar el password del usuario exitosamente", () => __awaiter(void 0, void 0, void 0, function* () {
                const username = "test5";
                const password = "test5";
                manager.updateUserPassword(username, password);
            }));
        });
        describe("addUserRule", () => {
            it("Debería lanzar un error cuando no se encuentre el usuario", () => __awaiter(void 0, void 0, void 0, function* () {
                const username = "fake";
                const rule = { topic: "test5/msg", acc: build_1.Acc.READ_WRITE };
                try {
                    yield manager.addUserRule(username, rule);
                }
                catch (error) {
                    error.should.have.property("message");
                    chai.assert(error.message, "User not found");
                }
            }));
            it("Debería agregar la regla de usuario exitosamente", () => __awaiter(void 0, void 0, void 0, function* () {
                const username = "test5";
                const rule = { topic: "test5/events", acc: build_1.Acc.READ };
                manager.addUserRule(username, rule);
            }));
        });
        describe("removeUserRule", () => {
            it("Debería lanzar un error cuando no se encuentre el usuario", () => __awaiter(void 0, void 0, void 0, function* () {
                const username = "fake";
                const rule = { topic: "test5/msg", acc: build_1.Acc.WRITE };
                try {
                    yield manager.removeUserRule(username, rule);
                }
                catch (error) {
                    error.should.have.property("message");
                    chai.assert(error.message, "User not found");
                }
            }));
            it("Debería lanzar un error cuando no se encuentre el usuario", () => __awaiter(void 0, void 0, void 0, function* () {
                const username = "test5";
                const rule = { topic: "test5/msg", acc: build_1.Acc.READ };
                try {
                    yield manager.removeUserRule(username, rule);
                }
                catch (error) {
                    error.should.have.property("message");
                    chai.assert(error.message, "Acl not found");
                }
            }));
            it("Debería eliminar la regla de usuario exitosamente", () => __awaiter(void 0, void 0, void 0, function* () {
                const username = "test5";
                const rule = { topic: "test5/msg", acc: build_1.Acc.WRITE };
                yield manager.removeUserRule(username, rule);
            }));
        });
        describe("deleteUser", () => {
            it("Debería lanzar un error cuando no el nombre de usuario usuario no exista", () => __awaiter(void 0, void 0, void 0, function* () {
                const username = "fake";
                try {
                    yield manager.deleteUser(username);
                }
                catch (error) {
                    error.should.have.property("message");
                    chai.assert(error.message, `Username ${username} does not exists`);
                }
            }));
            it("Debería lanzar un error cuando no el nombre de usuario usuario no exista", () => __awaiter(void 0, void 0, void 0, function* () {
                const username = "test6";
                try {
                    yield manager.deleteUser(username);
                }
                catch (error) {
                    error.should.have.property("message");
                    chai.assert(error.message, "User not found");
                }
            }));
            it("Debería eliminar el usuario exitosamente", () => __awaiter(void 0, void 0, void 0, function* () {
                const username = "test7";
                yield manager.deleteUser(username);
            }));
        });
        describe("getRules", () => {
            it("Debería obtener la lista de reglas", () => __awaiter(void 0, void 0, void 0, function* () {
                const rules = yield manager.getRules();
                chai.assert(rules.length > 0, "El resultado debería tener elementos");
                rules.forEach(r => {
                    r.should.have.property("type");
                    r.should.have.property("value");
                });
            }));
        });
        describe("createRule", () => {
            it("Debería lanzar un error cuando la regla ya existe", () => __awaiter(void 0, void 0, void 0, function* () {
                const rule = {
                    type: "topic",
                    value: "test/general",
                    acc: build_1.Acc.READ
                };
                try {
                    yield manager.createRule(rule);
                }
                catch (error) {
                    error.should.have.property("message");
                    chai.assert(error.message, "Rule already exists");
                }
            }));
            it("Debería crear la regla exitosamente", () => __awaiter(void 0, void 0, void 0, function* () {
                const rule = {
                    type: "topic",
                    value: "test/events",
                    acc: build_1.Acc.READ
                };
                yield manager.createRule(rule);
            }));
        });
        describe("deleteRule", () => {
            it("Debería lanzar un error cuando la regla no existe", () => __awaiter(void 0, void 0, void 0, function* () {
                const rule = {
                    type: "topic",
                    value: "test/%u/erase",
                    acc: build_1.Acc.READ
                };
                try {
                    yield manager.deleteRule(rule);
                }
                catch (error) {
                    error.should.have.property("message");
                    chai.assert(error.message, "Rule not found");
                }
            }));
            it("Debería eliminar la regla exitosamente", () => __awaiter(void 0, void 0, void 0, function* () {
                const rule = {
                    type: "pattern",
                    value: "test/%u/erase",
                    acc: build_1.Acc.WRITE
                };
                yield manager.deleteRule(rule);
            }));
        });
    }));
});
