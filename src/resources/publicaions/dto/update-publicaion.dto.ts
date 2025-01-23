import { PartialType } from '@nestjs/mapped-types';
import { CreatePublicaionDto } from './create-publicaion.dto';

export class UpdatePublicaionDto extends PartialType(CreatePublicaionDto) {}
