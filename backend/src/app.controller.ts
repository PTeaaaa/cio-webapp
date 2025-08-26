import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { SessionGuard } from './auth/guards/session.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorators/roles.decorator';
import { Role } from './auth/enums/roles.enum';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('admin')
  @UseGuards(SessionGuard, RolesGuard)
  @Roles(Role.Admin)
  getAdminData() {
    return { message: 'Welcome, Admin! You can see this secret data.' };
  }
}
