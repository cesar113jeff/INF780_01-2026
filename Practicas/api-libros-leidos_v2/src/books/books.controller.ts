import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiOperation } from '@nestjs/swagger';


@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.booksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.booksService.remove(+id);
  }

  @Get('filter/finished') // Esta será la ruta: /books/filter/finished
  @ApiOperation({ summary: 'Listar libros terminados' }) // Esto ayuda a Swagger
  findFinished() {
    return this.booksService.findFinished();
  }
}
