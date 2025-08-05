import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/contants';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Get('/')
  findAll() {
    return this.usersService.users({
      include: {
        addressBook: true,
      },
    });
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.usersService.user({ id });
  }

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Public()
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update({ where: { id }, data: updateUserDto });
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.delete({ id });
  }
}
