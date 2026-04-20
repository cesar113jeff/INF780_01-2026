import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsInt, Min, IsBoolean } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 'Cien años de soledad' })
  @IsNotEmpty({ message: 'titulo should not be empty' })
  titulo!: string;

  @ApiProperty({ example: 'Gabriel García Márquez' })
  @IsNotEmpty({ message: 'autor should not be empty' })
  autor!: string;

  @ApiProperty({ example: 150, required: false })
  @IsOptional()
  @IsInt({ message: 'paginasLeidas must be an integer' })
  @Min(0, { message: 'paginasLeidas must not be less than 0' })
  paginasLeidas?: number;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean({ message: 'terminado must be a boolean' })
  terminado?: boolean;
}