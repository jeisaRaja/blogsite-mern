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

describe('signup route', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
    await populateUser()
  })
  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
  })

  it('valid signup', async () => {
    const fullname = 'agus budiman'
    const email = 'newemail@gmail.com'
    const password = 'IwantToCode123'
    const passwordRepeat = 'IwantToCode123'
    const requestData = {
      fullname, email, password, passwordRepeat
    }
    const res = await request(server).post('/signup').send({ requestData })
    expect(res.status).toBe(200)
  })

  it('account existed', async () => {
    const fullname = 'agus budiman'
    const email = "agusbudiman@gmail.com"
    const password = 'IwantToCode123'
    const passwordRepeat = 'IwantToCode123'
    const requestData = {
      fullname, email, password, passwordRepeat
    }
    const res = await request(server).post('/signup').send({ requestData })
    expect(res.status).toBe(400)
  })

  it('missing email', async () => {
    const fullname = 'agus budiman'
    const password = 'IwantToCode123'
    const passwordRepeat = 'IwantToCode123'
    const requestData = {
      fullname, password, passwordRepeat
    }
    const res = await request(server).post('/signup').send({ requestData })
    expect(res.status).toBe(400)
  })

  it('email invalid format', async () => {
    const fullname = 'agus budiman'
    const email = 'email'
    const password = 'IwantToCode123'
    const passwordRepeat = 'IwantToCode123'
    const requestData = {
      fullname, password, passwordRepeat, email
    }
    const res = await request(server).post('/signup').send({ requestData })
    expect(res.status).toBe(400)
  })

  it('missing property', async () => {
    const fullname = 'agus budiman'
    const email = 'email'
    const password = 'IwantToCode123'
    const requestData = {
      fullname, email, password
    }
    const res = await request(server).post('/signup').send({ requestData })
    expect(res.status).toBe(400)
  })

  it('weak password', async () => {
    const fullname = 'agus budiman'
    const email = 'email'
    const password = 'justasmall'
    const passwordRepeat = 'justasmall'
    const requestData = {
      fullname, email, passwordRepeat
    }
    const res = await request(server).post('/signup').send({ requestData })
    expect(res.status).toBe(400)
  })

  it('mismatch password', async () => {
    const fullname = 'agus budiman'
    const email = 'email'
    const password = 'justasmall'
    const passwordRepeat = 'notthesame'
    const requestData = {
      fullname, email, passwordRepeat
    }
    const res = await request(server).post('/signup').send({ requestData })
    expect(res.status).toBe(400)
  })
})