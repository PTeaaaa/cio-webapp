import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query } from '@nestjs/common';
import { AccountsService } from './accounts.service';

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
}
