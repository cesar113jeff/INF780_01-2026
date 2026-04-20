import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';

describe('BooksService', () => {
  let service: BooksService;

  // Repositorio ficticio (Mock) con todos los métodos necesarios
  const mockRepository = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(book => Promise.resolve({ id: 1, ...book })),
    find: jest.fn().mockResolvedValue([{ id: 1, titulo: 'Libro de Prueba' }]),
    findOneBy: jest.fn().mockResolvedValue({ id: 1, titulo: 'Libro de Prueba' }),
    update: jest.fn().mockResolvedValue({ id: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    findBy: jest.fn().mockResolvedValue([{ id: 1, terminado: true }]),
    remove: jest.fn().mockResolvedValue({ id: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  // --- Todas las pruebas deben ir AQUÍ ADENTRO ---

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debe crear un nuevo libro', async () => {
    const dto = { titulo: 'NestJS para principiantes', autor: 'Cesar A.' };
    expect(await service.create(dto as any)).toEqual({ id: 1, ...dto });
  });

  it('debe listar todos los libros', async () => {
    const result = await service.findAll();
    expect(result).toEqual([{ id: 1, titulo: 'Libro de Prueba' }]);
  });

  it('debe encontrar un libro por ID', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual({ id: 1, titulo: 'Libro de Prueba' });
  });

  it('debe filtrar libros terminados', async () => {
    const result = await service.findFinished();
    expect(result).toEqual([{ id: 1, terminado: true }]);
  });

  it('debe eliminar un libro', async () => {
    await expect(service.remove(1)).resolves.not.toThrow();
  });
});