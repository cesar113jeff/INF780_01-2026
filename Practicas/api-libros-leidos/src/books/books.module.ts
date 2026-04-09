// src/books/books.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importar esto
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book } from './entities/book.entity'; // Importar tu entidad

@Module({
  imports: [TypeOrmModule.forFeature([Book])], // Registrar la entidad aquí
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}