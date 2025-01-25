import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DonationService } from './donations.service';
import { Donation, Prisma } from '@prisma/client';
import { DonationPaginationParams } from 'src/global/utils/pagination';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DonationEntity } from './entities/donation.entity';


@Controller('donations')
@ApiTags('donations')
export class DonationController {
  constructor(private readonly donationsService: DonationService) { }

  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: DonationEntity })
  create(@Body() createDonationDto: Prisma.DonationCreateInput) {
    return this.donationsService.createDonation(createDonationDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: DonationEntity, isArray: true })
  findAll(@Query() params: DonationPaginationParams) {
    return this.donationsService.findAllDonations(params);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: DonationEntity })
  findOne(@Param('id') id: string) {
    return this.donationsService.findSingleDonation({ id });
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: DonationEntity })
  update(@Param('id') id: string, @Body() updateDonationDto: Prisma.DonationUpdateInput) {
    return this.donationsService.updateDonation({ where: { id }, data: updateDonationDto });
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: DonationEntity })
  remove(@Param('id') id: string) {
    return this.donationsService.deleteDonation({ id });
  }
}
