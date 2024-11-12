import { PartialType } from '@nestjs/swagger';
import { CreateStatistcDto } from './create-statistc.dto';

export class UpdateStatistcDto extends PartialType(CreateStatistcDto) {}
