import { Controller, Get, HttpCode, HttpStatus, Headers, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '@/auth/guards/jwt.guard';
import { SidebarItemsService } from './sidebar-items.service';
import { Request } from 'express';
import { SessionUser } from '@/auth/auth.service';

interface RequestWithUser extends Request {
    user: SessionUser;
}

@Controller('sidebar-items')
export class SidebarItemsController {
    constructor(private readonly SidebarItemsService: SidebarItemsService) {}

    @Get()
    @UseGuards(JwtGuard)
    async getSidebarItems(@Req() req: RequestWithUser) {
        const user = req.user;
        return this.SidebarItemsService.getSidebarItems(user);
    }
}