import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (POST)', () => {
    const email = 'asfasdfasdfasf@asdfdsaf.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'asdfsdf' })
      .expect(201)
      .then((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.email).toEqual(email);
      });
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const email = "asdf@asdf.com";

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'asdfsdf' })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      // @ts-ignore
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
