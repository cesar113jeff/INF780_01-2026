import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest'; // Prueba con esta importación primero
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // Cerramos la aplicación después de los tests para evitar que Jest se quede abierto
  afterAll(async () => {
    await app.close();
  });

  it('/books (GET)', () => {
    return request(app.getHttpServer())
      .get('/books')
      .expect(200);
  });

  it('/books/filter/finished (GET)', () => {
    return request(app.getHttpServer())
      .get('/books/filter/finished')
      .expect(200);
  });
});