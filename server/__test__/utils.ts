import supertest from "supertest";
import server from "../src/server";

export const postRequest = async (endpoint: string, payload: object) => {
  let request = supertest(server).post(`${endpoint}`);
  console.log(request.url)
  request = request.set('Content-Type', 'application/json');
  return await request.send(payload);
}