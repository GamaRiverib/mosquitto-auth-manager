import { join } from "path";

import "mocha";
import * as chai from "chai";

import { Acc, getRepositoryManager, ID, MosquittoAuthFileRepository, Rule, User, UserRule } from "../build";

import { users, rules } from "./1.data";

chai.should();

describe("Repository Manager Test", () => {

  const usersFile = join(__dirname, "data", "1.users.repository.json");
  const rulesFile = join(__dirname, "data", "1.rules.repository.json");
    
  const repository = new MosquittoAuthFileRepository(usersFile, rulesFile);
  const manager = getRepositoryManager(repository);

  describe("getUserList", () => {

    it("Debería obtener la lista de todos los usuarios", async () => {
      const userList = await manager.getUserList();
      chai.assert(userList.length === users.length, "El número de usuarios debería ser igual");
    });

    it("Debería obtener solamente un usuario con el username igual a 'user1'", async () => {
      const query = "user1"
      const userList = await manager.getUserList({ query });
      chai.assert(userList.length === 1, "El resultado debería tener solamente un elemento");
      const user = userList[0];
      user.should.have.property("id");
      user.should.have.property("username");
      chai.assert(user.username === query, "El nombre de usuario no coincide");
      user.should.have.property("password");
      chai.assert(user.password === undefined, "El password debería ser 'undefined'");
    });

    it("Debería obtener una lista con solamente 3 elementos", async () => {
      const limit = 3;
      const userList = await manager.getUserList({ limit });
      chai.assert(userList.length === limit, `El resultado debería tener solamente ${limit} elementos`);
    });

  });

  describe("getUser", () => {

    it("Debería obtener 'undefined' cuando el id del usuario no existe", async () => {
      const user = await manager.getUser("fake" as ID);
      chai.assert(user === undefined, "Se esperaba que retornará 'undefined'");
    });

    it("Debería obtener el elemento con el id indicado'", async () => {
      const u = users[0];
      const user = await manager.getUser(u.id);
      chai.assert(user !== undefined, "No debería ser 'undefined'");
      user.should.have.property("id");
      user.should.have.property("username");
      user.should.have.property("password");
      chai.assert(user.id === u.id, "El id del usuario no coincide");
      chai.assert(user.username === u.username, "El nombre del usuario no coincide");
      chai.assert(user.password === undefined, "El password debería ser 'undefined'");
    });

  });

  describe("findUserByUsername", () => {

    it("Debería obtener 'undefined' cuando el nombre de usuario no existe", async () => {
      const username = "fake";
      const user = await manager.findUserByUsername(username);
      chai.assert(user === undefined, "Se esperaba que retornará 'undefined'");
    });

    it("Debería obtener el elemento con el id indicado'", async () => {
      const username = "user5";
      const user = await manager.findUserByUsername(username);
      chai.assert(user !== undefined, "No debería ser 'undefined'");
      user.should.have.property("id");
      user.should.have.property("username");
      user.should.have.property("password");
      chai.assert(user.username === username, "El nombre del usuario no coincide");
      chai.assert(user.password === undefined, "El password debería ser 'undefined'");
    });

  });

  describe("create", () => {

    it("Debería lanzar una excepción cuando el nombre de usuario ya existe", async () => {
      const username = "user1";
      const user: User = { username, password: "test1" };
      try {
        await manager.create(user);
      } catch (error) {
        error.should.have.property("message");
        chai.assert(error.message, `Username "${username}" already exists`);
      }
    });

    it("Debería crear un nuevo usuario exitosamente", async () => {
      const user: User = { username: "user6", password: "test6" };
      const entity = await manager.create(user);
      entity.should.have.property("id");
      entity.should.have.property("username");
      entity.should.have.property("password");
      chai.assert(entity.id !== undefined, "El id del usuario no debería ser 'undefined'");
      chai.assert(entity.username === user.username, "El nombre del usuario no coincide");
      chai.assert(entity.password === undefined, "El password debería ser 'undefined'");
    });

  });

  describe("updateUserPassword", () => {

    it("Debería lanzar una excepción cuando el id de usuario no existe", async () => {
      const id = "fake" as ID;
      try {
        await manager.updateUserPassword(id, "test")
      } catch (error) {
        error.should.have.property("message");
        chai.assert(error.message, `User with ID "${id}" not found`);
      }
    });

    it("Debería actualizar el password del usuario exitosamente", async () => {
      const id = users[3].id;
      const password = "password3";
      await manager.updateUserPassword(id, password);
    });

  });

  describe("addUserRule", () => {

    it("Debería lanzar una excepción cuando el id de usuario no existe", async () => {
      const id = "fake" as ID;
      const rule: UserRule = { acc: Acc.READ, topic: "test/1/r"};
      try {
        await manager.addUserRule(id, rule);
      } catch (error) {
        error.should.have.property("message");
        chai.assert(error.message, `User with ID "${id}" not found`);
      }
    });

    it("Debería agregar la regla de usuario exitosamente", async () => {
      const id = users[2].id;
      const rule: UserRule = { acc: Acc.READ, topic: "test/1/rw"};
      await manager.addUserRule(id, rule);
    });

  });

  describe("removeUserRule", () => {

    it("Debería lanzar una excepción cuando el id de usuario no existe", async () => {
      const id = "fake" as ID;
      const rule: UserRule = { acc: Acc.READ, topic: "test/1/r"};
      try {
        await manager.removeUserRule(id, rule);
      } catch (error) {
        error.should.have.property("message");
        chai.assert(error.message, `User with ID "${id}" not found`);
      }
    });

    it("Debería lanzar una excepción cuando la regla del usuario no existe", async () => {
      const id = users[0].id;
      const rule: UserRule = { acc: Acc.READ, topic: "test/1/r"};
      try {
        await manager.removeUserRule(id, rule);
      } catch (error) {
        error.should.have.property("message");
        chai.assert(error.message, "Acl not found");
      }
    });

    it("Debería eliminar la regla del usuario exitosamente", async () => {
      const id = users[0].id;
      const rule = users[0].acls[0];
      await manager.removeUserRule(id, rule);
    });

  });

  describe("deleteUser", () => {

    it("Debería lanzar una excepción cuando el id de usuario no existe", async () => {
      const id = "fake" as ID;
      try {
        await manager.deleteUser(id);
      } catch (error) {
        error.should.have.property("message");
        chai.assert(error.message, `User with ID "${id}" not found`);
      }
    });

    it("Debería eliminar el usuario exitosamente", async () => {
      const id = users[3].id;
      await manager.deleteUser(id);
    });

  });

  describe("getRules", () => {

    it("Debería obtener la lista de todas las reglas", async () => {
      const ruleList = await manager.getRules();
      chai.assert(ruleList.length === rules.length, "El número de reglas debería ser igual");
    });

  });

  describe("createRule", () => {

    it("Debería lanzar una excepción cuando la regla ya existe", async () => {
      const rule: Rule = {
        type: rules[0].type,
        value: rules[0].value,
        acc: rules[0].acc
      };
      try {
        await manager.createRule(rule);
      } catch (error) {
        error.should.have.property("message");
        chai.assert(error.message, "Rule already exists");
      }
    });

    it("Debería crear una nueva regla exitosamente", async () => {
      const rule: Rule = {
        type: "pattern",
        value: "users/+/messages",
        acc: Acc.READ_WRITE
      };
      const entity = await manager.createRule(rule);
      entity.should.have.property("id");
      entity.should.have.property("type");
      entity.should.have.property("value");
      chai.assert(entity.id !== undefined, "El id de la regla no debería ser 'undefined'");
      chai.assert(entity.type === rule.type, "El tyipo de la regla no coincide");
      chai.assert(entity.value === rule.value, "El valor de la regla no coincide");
    });

  });

  describe("deleteRule", () => {

    it("Debería lanzar una excepción cuando el id de la regla no existe", async () => {
      const id = "fake" as ID;
      try {
        await manager.deleteRule(id);
      } catch (error) {
        error.should.have.property("message");
        chai.assert(error.message, `Rule with ID "${id}" not found`);
      }
    });

    it("Debería eliminar la regla exitosamente", async () => {
      const id = rules[3].id;
      await manager.deleteRule(id);
    });

  });

});