import { Controller, Get, Post, Put, Delete, Body, Query, Param, UseGuards, Req, ParseUUIDPipe, ValidationPipe, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { PeopleService } from './people.service';
import { SessionGuard } from '@/auth/guards/session.guard';
import { Request } from 'express';
import { SessionUser } from '@/auth/auth.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/roles.enum';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

interface RequestWithuser extends Request {
    user: SessionUser;
}

@Controller('people')
export class PeopleController {
    constructor(private readonly peopleService: PeopleService) { }

    @Post('createpeople')
    @UseGuards(SessionGuard, RolesGuard)
    @Roles(Role.Admin, Role.User)
    createPerson(
        @Body(new ValidationPipe()) createPersonDto: CreatePersonDto,
    ) {
        return this.peopleService.createPerson(createPersonDto);
    }

    @Get('getpeoplebyplaceId/:placeId')
    getPeopleByPlaceId(
        @Param('placeId', new ParseUUIDPipe()) placeId: string,
    ) {
        return this.peopleService.getPeopleByPlaceId(placeId);
    }

    @Get('getpeoplebyplaceId-public/:placeId')
    getPeopleByPlaceIdPUBLIC(
        @Param('placeId', new ParseUUIDPipe()) placeId: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 5,
        @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number = 5,
    ) {
        return this.peopleService.getPeopleByPlaceIdPublic(placeId, page, limit);
    }

    @Get('getpersonbypersonId/:personId')
    getPersonByPersonId(
        @Param('personId', new ParseUUIDPipe()) personId: string,
    ) {
        return this.peopleService.getPersonByPersonId(personId);
    }

    @Put('updatepeople/:id')
    @UseGuards(SessionGuard, RolesGuard)
    @Roles(Role.Admin, Role.User)
    updatePerson(
        @Req() req: RequestWithuser,
        @Param('id', new ParseUUIDPipe()) personId: string,
        @Body(new ValidationPipe()) updatePersonDto: UpdatePersonDto,
    ) {
        return this.peopleService.updatePerson(req.user, personId, updatePersonDto);
    }

    @Delete('deletepeople/:id')
    @UseGuards(SessionGuard, RolesGuard)
    @Roles(Role.Admin, Role.User)
    deletePerson(
        @Req() req: RequestWithuser,
        @Param('id', new ParseUUIDPipe()) personId: string,
    ) {
        return this.peopleService.deletePerson(req.user, personId);
    }
}