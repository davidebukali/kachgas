import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { Address } from 'generated/prisma/client';

@Injectable()
export class UserAddressService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserAddressDto: CreateUserAddressDto): Promise<Address> {
    return this.prisma.address.create({ data: createUserAddressDto });
  }

  async findAll(): Promise<Address[]> {
    return this.prisma.address.findMany();
  }

  async findOne(id: string): Promise<Address | null> {
    return this.prisma.address.findUnique({ where: { id } });
  }

  async update(
    id: string,
    updateUserAddressDto: UpdateUserAddressDto,
  ): Promise<Address> {
    return this.prisma.address.update({
      where: { id },
      data: updateUserAddressDto,
    });
  }

  async remove(id: string): Promise<Address> {
    return this.prisma.address.delete({ where: { id } });
  }
}
