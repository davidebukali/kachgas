import { IsOptional, IsString } from 'class-validator';

export class UpdateUserAddressDto {
  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  latitude: number;

  @IsOptional()
  @IsString()
  longitude: number;
}
