import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  basePrice: number;

  @IsOptional()
  @IsString()
  imageUrl?: string; // Optional field for product image

  @IsNotEmpty()
  @IsNumber()
  sizeKg: number;
}
