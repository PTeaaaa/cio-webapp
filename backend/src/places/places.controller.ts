import { Controller, DefaultValuePipe, Get, Param, ParseUUIDPipe, Query, ParseIntPipe } from '@nestjs/common';
import { PlacesService } from './places.service';

@Controller('places')
export class PlacesController {
    constructor(private readonly placesService: PlacesService) {}

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
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 5,
        @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number = 5,
    ) {
        return this.placesService.getPlacesByAgency(agency, page, limit);
    }
}