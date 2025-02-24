const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");

describe("API Tests", () => {
  afterAll(async () => {
    await mongoose.connection.close(); // ✅ Close MongoDB after tests
  });

  it("should get all the users", async () => {
    const res = await request(app)
      .get("/user")  // ✅ Use the correct route
      .set("Cookie", ["jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Yjk2NzA3ZmE5ZDhmNWRkOWE4OGMxNCIsImlhdCI6MTc0MDIyMDAwNSwiZXhwIjoxNzQwODI0ODA1fQ.bOriURaU0U2rGxRoq55EsY3iiZFArbbvHiLfNQvIVj8"]);
  
    console.log("Response Status:", res.statusCode);
    console.log("Response Body:", res.body);  // Log response body for debugging
  
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user");
  });

  it("should get all the users", async () => {
    const res = await request(app)
      .get("/allUsers")  // ✅ Use the correct route)

    console.log("Response Status:", res.statusCode);
    console.log("Response Body:", res.body);  // Log response body for debugging
  
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("users");
  });
});

