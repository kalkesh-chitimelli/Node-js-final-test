import index from "./index.js";
import supertest from "supertest";

describe("To test api endpoints", () => {
  it("To test endpoint GET/users", async () => {
    await supertest(index)
      .get("/users")
      .expect(200)
      .expect([
        {
          id: 1,
          name: "kalkesh",
        },
        {
          id: 2,
          name: "shardul",
        },
      ]);
  });
  it("To test endpoint GET/new", async () => {
    await supertest(index)
      .get("/new")
      .expect(200)
      .expect({ text: "welcome to the new page" });
  });
  it("To test endpoint GET/nonexisting", async () => {
    await supertest(index).get("/nonexisting").expect(404);
  });
  it("To test endpoint GET/path", () => {
    supertest(index).get("/path").expect(301);
  });
  it("To test endpoint POST/users", () => {
    supertest(index)
      .post("/users")
      .send({ id: 3, name: "gaurav" })
      .expect("user gaurav registered successfully");
  });
});
