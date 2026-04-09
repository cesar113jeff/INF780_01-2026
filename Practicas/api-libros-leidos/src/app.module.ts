// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './books/books.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Tu servidor local
      port: 5432,        // Puerto por defecto de Postgres
      username: 'postgres', // Tu usuario (usualmente 'postgres')
      password: 'root', // La contraseña que pusiste al instalar Postgres
      database: 'biblioteca_db', // El nombre de la DB que creaste en el paso 2.1
      autoLoadEntities: true,
      synchronize: true, // Esto creará las tablas automáticamente basado en tus clases
    }),
    BooksModule,
  ],
})
export class AppModule {}