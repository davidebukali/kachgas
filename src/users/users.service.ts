import { Injectable } from '@nestjs/common';
import { Prisma, User } from 'generated/prisma';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SafeUser } from './dto/safe-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    const displayField =
      (userWhereUniqueInput.email && userWhereUniqueInput.email.length > 0) ||
      false;
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        password: displayField,
        addressBook: true,
        updatedAt: displayField,
        createdAt: displayField,
      },
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    include?: Prisma.UserInclude;
  }): Promise<SafeUser[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        ...include, // Preserve relations if needed
      },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<{
    id: string;
    email: string;
    name: string;
  }> {
    const hashedPassword = await bcrypt.hash(String(data.password), 10);
    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
