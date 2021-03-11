import "mocha";
import * as chai from "chai";

import { Acc, getFileManager, Rule, User, UserRule } from "../build";

chai.should();

getFileManager().then(manager => {

  describe("File Manager Test", async () => {

    describe("getUsers", () => {
  
      it("Debería obtener la lista de usuarios", async () => {
        const users = await manager.getUsers();
        chai.assert(users.length === 6, "El resultado debería tener 6 elementos");
        users.forEach(u => {
          u.should.have.property("username");
          u.should.have.property("password");
          chai.assert(u.password === "" || u.password === undefined, "El password del usuario no debería mostrarse");
        });
      });
  
    });
  
    describe("getUser", () => {
  
      it("Debería obtener 'undefined' cuando el nombre del usuario no existe", async () => {
        const username = "fake";
        const user = await manager.getUser(username);
        chai.assert(user === undefined, "Debería ser 'undefined'");
      });
  
      it("Debería obtener la información del usuario con username 'test1'", async () => {
        const username = "test1";
        const user = await manager.getUser(username);
        chai.assert(user !== undefined, "No debería ser 'undefined'");
        user.should.have.property("username");
        chai.assert(user.username === username, `Se esperaba que tuviera el username = '${username}'`);
      });
  
    });
  
    describe("createUser", () => {
      
      it("Debería lanzar un error cuando el nombre de usuario ya existe", async () => {
        const username = "test1";
        const password = "test1";
        const user: User = { username, password };
        try {
          await manager.createUser(user);
        } catch (error) {
          error.should.have.property("message");
          chai.assert(error.message, `Username "${username}" already exists`);
        }
      });
  
      it("Debería crear un nuevo usuario exitosamente", async () => {
        const username = "test4";
        const password = "test4";
        const user: User = { username, password };
        const saved = await manager.createUser(user);
        saved.should.have.property("username");
        chai.assert(saved.username === username, "El nombre de usuario no coincide");
        chai.assert(saved.password === undefined, "El password debería ser 'undefined'");
      });
  
    });
  
    describe("updateUserPassword", () => {
  
      it("Debería lanzar un error cuando el nombre de usuario no existe", async () => {
        const username = "fake";
        const password = "test";
        try {
          await manager.updateUserPassword(username, password);
        } catch (error) {
          error.should.have.property("message");
          chai.assert(error.message, `Username ${username} does not exists`);
        }
      });
  
      it("Debería actualizar el password del usuario exitosamente", async () => {
        const username = "test5";
        const password = "test5";
        manager.updateUserPassword(username, password);
      });
  
    });
  
    describe("addUserRule", () => {
  
      it("Debería lanzar un error cuando no se encuentre el usuario", async () => {
        const username = "fake";
        const rule: UserRule = { topic: "test5/msg", acc: Acc.READ_WRITE };
        try {
          await manager.addUserRule(username, rule);
        } catch (error) {
          error.should.have.property("message");
          chai.assert(error.message, "User not found");
        }
      });
  
      it("Debería agregar la regla de usuario exitosamente", async () => {
        const username = "test5";
        const rule: UserRule = { topic: "test5/events", acc: Acc.READ };
        manager.addUserRule(username, rule);
      });
  
    });
  
    describe("removeUserRule", () => {
      
      it("Debería lanzar un error cuando no se encuentre el usuario", async () => {
        const username = "fake";
        const rule: UserRule = { topic: "test5/msg", acc: Acc.WRITE };
        try {
          await manager.removeUserRule(username, rule);
        } catch (error) {
          error.should.have.property("message");
          chai.assert(error.message, "User not found");
        }
      });
  
      it("Debería lanzar un error cuando no se encuentre el usuario", async () => {
        const username = "test5";
        const rule: UserRule = { topic: "test5/msg", acc: Acc.READ };
        try {
          await manager.removeUserRule(username, rule);
        } catch (error) {
          error.should.have.property("message");
          chai.assert(error.message, "Acl not found");
        }
      });
  
      it("Debería eliminar la regla de usuario exitosamente", async () => {
        const username = "test5";
        const rule: UserRule = { topic: "test5/msg", acc: Acc.WRITE };
        await manager.removeUserRule(username, rule);
      });
  
    });
  
    describe("deleteUser", () => {
  
      it("Debería lanzar un error cuando no el nombre de usuario usuario no exista", async () => {
        const username = "fake";
        try {
          await manager.deleteUser(username);
        } catch (error) {
          error.should.have.property("message");
          chai.assert(error.message, `Username ${username} does not exists`);
        }
      });
  
      it("Debería lanzar un error cuando no el nombre de usuario usuario no exista", async () => {
        const username = "test6";
        try {
          await manager.deleteUser(username);
        } catch (error) {
          error.should.have.property("message");
          chai.assert(error.message, "User not found");
        }
      });
  
      it("Debería eliminar el usuario exitosamente", async () => {
        const username = "test7";
        await manager.deleteUser(username);
      });
  
    });
  
    describe("getRules", () => {
  
      it("Debería obtener la lista de reglas", async () => {
        const rules = await manager.getRules()
        chai.assert(rules.length > 0, "El resultado debería tener elementos");
        rules.forEach(r => {
          r.should.have.property("type");
          r.should.have.property("value");
        });
      });
  
    });
  
    describe("createRule", () => {
  
      it("Debería lanzar un error cuando la regla ya existe", async () => {
        const rule: Rule = {
          type: "topic",
          value: "test/general",
          acc: Acc.READ
        };
        try {
          await manager.createRule(rule);
        } catch (error) {
          error.should.have.property("message");
          chai.assert(error.message, "Rule already exists");
        }
      });
  
      it("Debería crear la regla exitosamente", async () => {
        const rule: Rule = {
          type: "topic",
          value: "test/events",
          acc: Acc.READ
        };
        await manager.createRule(rule);
      });
  
    });
  
    describe("deleteRule", () => {
  
      it("Debería lanzar un error cuando la regla no existe", async () => {
        const rule: Rule = {
          type: "topic",
          value: "test/%u/erase",
          acc: Acc.READ
        };
        try {
          await manager.deleteRule(rule);
        } catch (error) {
          error.should.have.property("message");
          chai.assert(error.message, "Rule not found");
        }
      });
  
      it("Debería eliminar la regla exitosamente", async () => {
        const rule: Rule = {
          type: "pattern",
          value: "test/%u/erase",
          acc: Acc.WRITE
        };
        await manager.deleteRule(rule);
      });
  
    });
  
  });

});