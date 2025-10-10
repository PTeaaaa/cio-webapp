import { Body, Controller, DefaultValuePipe, Param, ParseIntPipe, Query, Get, Put, Delete, Post, HttpCode, HttpStatus, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AccountsService, UpdateAccountPayload } from './accounts.service';
import { AccountDto } from './dto/account.dto';
import { JwtGuard } from '@/auth/guards/jwt.guard';
import { SessionUser } from '@/auth/auth.service';

interface RequestWithUser extends Request {
    user: SessionUser;
}

@Controller('accounts')
export class AccountsController {

    constructor(private readonly accountsService: AccountsService) { }

    @Get('get-allaccounts')
    async getAllAccounts(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(99999), ParseIntPipe) limit: number = 99999,
    ) {
        return this.accountsService.getAllAccounts(page, limit);
    }

    @Get(':id')
    async getAccountById(@Param('id') id: string) {
        return this.accountsService.findAccountById(id);
    }

    @Post('create')
    @UseGuards(JwtGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Req() req: RequestWithUser,
        @Body(ValidationPipe) accountDto: AccountDto
    ) {
        const { username, password, role, assignPlace } = accountDto;
        const user = await this.accountsService.createAccount(
            username,
            password,
            role,
            assignPlace,
            req.user.id
        );

        return {
            message: 'Account created successfully',
            user,
        };
    }

    @Put(':id')
    @UseGuards(JwtGuard)
    async updateAccount(
        @Req() req: RequestWithUser,
        @Param('id') id: string,
        @Body() updateData: UpdateAccountPayload
    ) {
        return this.accountsService.updateAccount(id, updateData, req.user.id);
    }

    @Delete(':id')
    async deleteAccount(@Param('id') id: string) {
        return this.accountsService.deleteAccount(id);
    }

}
