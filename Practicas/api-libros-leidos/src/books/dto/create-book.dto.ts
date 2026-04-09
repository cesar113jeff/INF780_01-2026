import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: 'Cien años de soledad' })
  titulo!: string;

  @ApiProperty({ example: 'Gabriel García Márquez' })
  autor!: string;

  @ApiProperty({ example: 150, required: false })
  paginasLeidas?: number;

  @ApiProperty({ example: false, required: false })
  terminado?: boolean;
}