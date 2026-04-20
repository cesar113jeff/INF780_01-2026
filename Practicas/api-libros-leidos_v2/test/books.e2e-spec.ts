import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { BooksModule } from '../src/books/books.module';
import { Book } from '../src/books/entities/book.entity';

describe('BooksController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'root',
          database: 'biblioteca_db_test',
          autoLoadEntities: true,
          synchronize: true,
        }),
        BooksModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    dataSource = moduleFixture.get<DataSource>(DataSource);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await dataSource.getRepository(Book).clear();
  });

  const validBook = {
    titulo: 'El Principito',
    autor: 'Antoine de Saint-Exupéry',
    paginasLeidas: 120,
    terminado: false,
  };

  describe('POST /books', () => {
    it('Caso 1: Crear libro con datos válidos → 201', async () => {
      const response = await request(app.getHttpServer())
        .post('/books')
        .send(validBook)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.titulo).toBe(validBook.titulo);
      expect(response.body.autor).toBe(validBook.autor);
    });

    it('Caso 2: Crear libro sin título (campo obligatorio) → 400', async () => {
      const response = await request(app.getHttpServer())
        .post('/books')
        .send({ autor: 'Autor test', paginasLeidas: 100 })
        .expect(400);

      expect(response.body.message).toContain('titulo should not be empty');
    });

    it('Caso 3: Crear libro sin autor (campo obligatorio) → 400', async () => {
      const response = await request(app.getHttpServer())
        .post('/books')
        .send({ titulo: 'Título test', paginasLeidas: 100 })
        .expect(400);

      expect(response.body.message).toContain('autor should not be empty');
    });

    it('Caso 4: Crear libro con número de páginas negativo → 400', async () => {
      const response = await request(app.getHttpServer())
        .post('/books')
        .send({ titulo: 'Test', autor: 'Autor', paginasLeidas: -10 })
        .expect(400);

      expect(response.body.message).toContain('paginasLeidas must not be less than 0');
    });
  });

  describe('GET /books', () => {
    it('Caso 5: Listar todos los libros cuando existen registros → 200', async () => {
      await request(app.getHttpServer()).post('/books').send(validBook);

      const response = await request(app.getHttpServer())
        .get('/books')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('Caso 6: Listar libros cuando no hay registros → 200 (array vacío)', async () => {
      const response = await request(app.getHttpServer())
        .get('/books')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('GET /books/:id', () => {
    it('Caso 7: Obtener libro existente por ID → 200', async () => {
      const created = await request(app.getHttpServer())
        .post('/books')
        .send(validBook);

      const response = await request(app.getHttpServer())
        .get(`/books/${created.body.id}`)
        .expect(200);

      expect(response.body.id).toBe(created.body.id);
      expect(response.body.titulo).toBe(validBook.titulo);
    });

    it('Caso 8: Obtener libro con ID inexistente → 404', async () => {
      await request(app.getHttpServer())
        .get('/books/99999')
        .expect(404);
    });

    it('Caso 9: Obtener libro con ID inválido (formato incorrecto) → 400', async () => {
      const response = await request(app.getHttpServer())
        .get('/books/abc')
        .expect(400);

      expect(response.body.message).toContain('numeric string is expected');
    });
  });

  describe('PATCH /books/:id', () => {
    it('Caso 10: Actualizar título de un libro existente → 200', async () => {
      const created = await request(app.getHttpServer())
        .post('/books')
        .send(validBook);

      const response = await request(app.getHttpServer())
        .patch(`/books/${created.body.id}`)
        .send({ titulo: 'Nuevo Título' })
        .expect(200);

      expect(response.body.titulo).toBe('Nuevo Título');
    });

    it('Caso 11: Actualizar libro con ID inexistente → 404', async () => {
      await request(app.getHttpServer())
        .patch('/books/99999')
        .send({ titulo: 'Nuevo Título' })
        .expect(404);
    });

    it('Caso 12: Actualizar con datos inválidos (páginas negativas) → 400', async () => {
      const created = await request(app.getHttpServer())
        .post('/books')
        .send(validBook);

      const response = await request(app.getHttpServer())
        .patch(`/books/${created.body.id}`)
        .send({ paginasLeidas: -50 })
        .expect(400);

      expect(response.body.message).toContain('paginasLeidas must not be less than 0');
    });
  });

  describe('DELETE /books/:id', () => {
    it('Caso 13: Eliminar libro existente → 200', async () => {
      const created = await request(app.getHttpServer())
        .post('/books')
        .send(validBook);

      await request(app.getHttpServer())
        .delete(`/books/${created.body.id}`)
        .expect(200);

      await request(app.getHttpServer())
        .get(`/books/${created.body.id}`)
        .expect(404);
    });

    it('Caso 14: Eliminar libro con ID inexistente → 404', async () => {
      await request(app.getHttpServer())
        .delete('/books/99999')
        .expect(404);
    });
  });

  describe('Flujo completo', () => {
    it('Caso 15: Crear → Leer → Actualizar → Verificar cambio → Eliminar → Verificar 404', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/books')
        .send(validBook)
        .expect(201);

      const bookId = createResponse.body.id;

      const readResponse = await request(app.getHttpServer())
        .get(`/books/${bookId}`)
        .expect(200);

      expect(readResponse.body.titulo).toBe(validBook.titulo);

      const updateResponse = await request(app.getHttpServer())
        .patch(`/books/${bookId}`)
        .send({ titulo: 'Título Actualizado', paginasLeidas: 200 })
        .expect(200);

      expect(updateResponse.body.titulo).toBe('Título Actualizado');
      expect(updateResponse.body.paginasLeidas).toBe(200);

      const verifyResponse = await request(app.getHttpServer())
        .get(`/books/${bookId}`)
        .expect(200);

      expect(verifyResponse.body.titulo).toBe('Título Actualizado');

      await request(app.getHttpServer())
        .delete(`/books/${bookId}`)
        .expect(200);

      await request(app.getHttpServer())
        .get(`/books/${bookId}`)
        .expect(404);
    });
  });
});