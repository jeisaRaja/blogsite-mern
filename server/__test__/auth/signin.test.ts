import mongoose, { mongo } from "mongoose"
import User from "../../src/Schema/User"
import { MongoMemoryServer } from "mongodb-memory-server"
import request from "supertest";
import server from "../../src/server";

const populateUser = async () => {

  const password = "$2b$10$ssyJR.fY/1zXaO70jILLu.QMrESTLbvUBsTTuHDw.fUeEgyjiHK1i"
  const fullname = "agus budiman"
  const username = "agusbudiman"
  const email = "agusbudiman@gmail.com"
  const user = await User.create({
    personal_info: { fullname, email, password, username }
  })
  await user.save()
}

const clearDB = async () => {
  await User.deleteMany({})
}

describe('signin route', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
    await populateUser()
  })
  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
  })
  it('valid signin request', async () => {
    const res = await request(server).post('/signin').send({ requestData: { email: "agusbudiman@gmail.com", password: "Cipinang01" } })
    expect(res.status).toBe(200);
  })
  it('wrong password', async () => {
    const res = await request(server).post('/signin').send({ requestData: { email: "agusbudiman@gmail.com", password: "Cipinang56" } })
    expect(res.status).toBe(401);
  })
  it('empty password', async () => {
    const res = await request(server).post('/signin').send({ requestData: { email: "agusbudiman@gmail.com" } })
    expect(res.status).toBe(400);
  })
  it('empty email', async () => {
    const res = await request(server).post('/signin').send({ requestData: { password: "Cipinang56" } })
    expect(res.status).toBe(400);
  })
  it('account did not exist', async () => {
    const res = await request(server).post('/signin').send({ requestData: { email: "nomail@gmail.com", password: "Cipinang56" } })
    expect(res.status).toBe(401);
  })
  it('not using the correct requestData', async () => {
    const res = await request(server).post('/signin').send({ email: "nomail@gmail.com", password: "Cipinang56" })
    expect(res.status).toBe(400)
  })
})

