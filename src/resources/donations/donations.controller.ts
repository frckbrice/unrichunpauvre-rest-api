import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DonationService } from './donations.service';
import { Donation, Prisma } from '@prisma/client';
import { DonationPaginationParams } from 'src/global/utils/pagination';


@Controller('donations')
export class DonationController {
  constructor(private readonly donationsService: DonationService) { }

  @Post()
  create(@Body() createDonationDto: Prisma.DonationCreateInput) {
    return this.donationsService.createDonation(createDonationDto);
  }

  @Get()
  findAll(@Query() params: DonationPaginationParams) {
    return this.donationsService.findAllDonations(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.donationsService.findSingleDonation({ id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDonationDto: Prisma.DonationUpdateInput) {
    return this.donationsService.updateDonation({ where: { id }, data: updateDonationDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.donationsService.deleteDonation({ id });
  }
}
