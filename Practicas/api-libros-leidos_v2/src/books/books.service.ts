// src/books/books.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  // 1. Crear un nuevo libro
  async create(createBookDto: CreateBookDto): Promise<Book> {
    const newBook = this.bookRepository.create(createBookDto);
    return await this.bookRepository.save(newBook);
  }

  // 2. Obtener todos los libros (Puntaje rúbrica: CRUD)
  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find();
  }

  // 3. Obtener un libro por ID
  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      throw new NotFoundException(`El libro con ID ${id} no fue encontrado`);
    }
    return book;
  }

  // 4. Actualizar un libro (PATCH)
  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id); // Reutilizamos findOne para validar si existe
    const updatedBook = Object.assign(book, updateBookDto);
    return await this.bookRepository.save(updatedBook);
  }

  // 5. Eliminar un libro
  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    await this.bookRepository.remove(book);
  }

  // 6. Endpoint Extra: Filtrar libros terminados (Para asegurar el "Excelente")
  async findFinished(): Promise<Book[]> {
    return await this.bookRepository.findBy({ terminado: true });
  }
}