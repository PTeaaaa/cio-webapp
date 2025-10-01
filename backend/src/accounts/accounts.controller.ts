import { Body, Controller, DefaultValuePipe, Param, ParseIntPipe, Query, Get, Put, Delete } from '@nestjs/common';
import { AccountsService, UpdateAccountPayload } from './accounts.service';

@Controller('accounts')
export class AccountsController {

    constructor(private readonly accountsService: AccountsService) { }

    @Get('get-allaccounts')
    async getAllAccounts(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(99999), ParseIntPipe) limit: number = 99999,
    ) {
        return this.accountsService.findAllAccounts(page, limit);
    }

    @Get(':id')
    async getAccountById(@Param('id') id: string) {
        return this.accountsService.findAccountById(id);
    }

    @Put(':id')
    async updateAccount(
        @Param('id') id: string,
        @Body() updateData: UpdateAccountPayload
    ) {
        return this.accountsService.updateAccount(id, updateData);
    }

    @Delete(':id')
    async deleteAccount(@Param('id') id: string) {
        return this.accountsService.deleteAccount(id);
    }

}
