import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Seguimiento de Libros - INF780') // Título para tu práctica [cite: 4]
    .setDescription('Documentación de los endpoints para la gestión de libros leídos')
    .setVersion('1.0')
    .addTag('books')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  
  // Esta será la URL de acceso: http://localhost:3000/api/docs
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();