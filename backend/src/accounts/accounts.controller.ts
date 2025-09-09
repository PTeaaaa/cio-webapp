import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Put, Query } from '@nestjs/common';
import { AccountsService, UpdateAccountPayload } from './accounts.service';

@Controller('accounts')
export class AccountsController {

    constructor(private readonly accountsService: AccountsService) { }

    @Get('get-allaccounts')
    async getAllAccounts(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 5,
        @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number = 5,
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

    
}
