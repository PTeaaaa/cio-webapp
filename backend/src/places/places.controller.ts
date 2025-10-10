import { Controller, DefaultValuePipe, Get, Param, ParseUUIDPipe, Query, ParseIntPipe, Post, Body, Delete } from '@nestjs/common';
import { PlacesService } from './places.service';
import { GetPlacesByAgencyDto, PlaceSortBy } from './dto/get-places-by-agency.dto';

@Controller('places')
export class PlacesController {
    constructor(private readonly placesService: PlacesService) { }

    @Get('all')
    getAllPlaces() {
        return this.placesService.getAllPlaces();
    }

    @Get('by-id/:id')
    getPlaceById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.placesService.getPlaceById(id);
    }

    @Get('by-agency/:agency')
    getPlacesByAgency(
        @Param('agency') agency: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number = 5,
        @Query('sortBy', new DefaultValuePipe(PlaceSortBy.NUMBER_ORDER)) sortBy: PlaceSortBy = PlaceSortBy.NUMBER_ORDER,
        @Query('sortOrder', new DefaultValuePipe('asc')) sortOrder: 'asc' | 'desc' = 'asc',
    ) {
        return this.placesService.getPlacesByAgency(agency, page, limit, sortBy, sortOrder);
    }

    @Post('create-places')
    createManyPlaces(@Body() placesData: { name: string; agency: string }[]) {
        return this.placesService.createManyPlaces(placesData);
    }

    @Delete('delete/:id')
    deletePlaceById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.placesService.deletePlaceById(id);
    }

    @Delete('delete-many')
    deleteManyPlaces(@Body() placeIds: string[]) {
        return this.placesService.deleteManyPlaces(placeIds);
    }
}