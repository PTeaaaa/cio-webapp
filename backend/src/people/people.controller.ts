import { Controller, Get, Post, Put, Delete, Body, Query, Param, UseGuards, Req, ParseUUIDPipe, ValidationPipe, DefaultValuePipe, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

import { PeopleService } from './people.service';
import { JwtGuard } from '@/auth/guards/jwt.guard';
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
    constructor(
        private readonly peopleService: PeopleService,
    ) { }

    @Post('createpeople')
    @UseGuards(JwtGuard, RolesGuard)
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
    getPeopleByPlaceIdPublic(
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
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.Admin, Role.User)
    updatePerson(
        @Req() req: RequestWithuser,
        @Param('id', new ParseUUIDPipe()) personId: string,
        @Body(new ValidationPipe()) updatePersonDto: UpdatePersonDto,
    ) {
        return this.peopleService.updatePerson(req.user, personId, updatePersonDto);
    }

    @Post(':entityId/upload-image')
    @UseInterceptors(FileInterceptor('image')) // 'image' คือชื่อ field ใน FormData ที่จะใช้ส่งไฟล์
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Param('entityId', ParseUUIDPipe) entityId: string, // ตรวจสอบว่าเป็น UUID ที่ถูกต้อง
    ) {
        if (!file) {
            throw new BadRequestException('No file provided.');
        }

        const imageUrl = await this.peopleService.uploadPersonImage(file, entityId);

        return {
            message: 'Image uploaded successfully',
            imageUrl: imageUrl,
        };
    }

    @Delete('deletepeople/:id')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.Admin, Role.User)
    deletePerson(
        @Req() req: RequestWithuser,
        @Param('id', new ParseUUIDPipe()) personId: string,
    ) {
        return this.peopleService.deletePerson(req.user, personId);
    }
}