import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StringsService } from './strings.service';
import { CreateStringDto } from './dto/create-string.dto';
import { FilterStringsDto } from './dto/filter-strings.dto';
import { NaturalLanguageQueryDto } from './dto/natural-language-query.dto';

@Controller('strings')
export class StringsController {
  constructor(private readonly stringsService: StringsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createStringDto: CreateStringDto) {
    return this.stringsService.create(createStringDto);
  }

  @Get()
  findAll(@Query() filterDto: FilterStringsDto) {
    return this.stringsService.findAll(filterDto);
  }

  @Get('filter-by-natural-language')
  findByNaturalLanguage(@Query() queryDto: NaturalLanguageQueryDto) {
    return this.stringsService.findByNaturalLanguage(queryDto.query);
  }

  @Get(':stringValue')
  findOne(@Param('stringValue') stringValue: string) {
    return this.stringsService.findOne(stringValue);
  }

  @Delete(':stringValue')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('stringValue') stringValue: string) {
    return this.stringsService.remove(stringValue);
  }
}
