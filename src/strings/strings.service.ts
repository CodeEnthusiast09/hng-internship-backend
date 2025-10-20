import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateStringDto } from './dto/create-string.dto';
import { FilterStringsDto } from './dto/filter-strings.dto';
import { StringAnalyzer } from './utils/string-analyzer.util';
import { NaturalLanguageParser } from './utils/nl-parser.util';
import { StringsStorageService, StoredString } from './strings-storage.service';

@Injectable()
export class StringsService {
  constructor(private readonly storage: StringsStorageService) {}

  create(createStringDto: CreateStringDto) {
    const { value } = createStringDto;

    if (!value || value.trim() === '') {
      throw new BadRequestException(
        'Value field is required and cannot be empty',
      );
    }

    // Analyze the string
    const properties = StringAnalyzer.analyze(value);

    // Create stored string object
    const storedString: StoredString = {
      id: properties.sha256_hash,
      value,
      ...properties,
      created_at: new Date(),
    };

    // Save to storage
    this.storage.create(storedString);

    // Return formatted response
    return this.formatResponse(storedString);
  }

  findOne(stringValue: string) {
    const storedString = this.storage.findByValue(stringValue);

    if (!storedString) {
      throw new NotFoundException('String does not exist in the system');
    }

    return this.formatResponse(storedString);
  }

  findAll(filterDto: FilterStringsDto) {
    let results = this.storage.findAll();

    // Apply filters
    if (filterDto.is_palindrome !== undefined) {
      results = results.filter(
        (s) => s.is_palindrome === filterDto.is_palindrome,
      );
    }

    if (filterDto.min_length !== undefined) {
      results = results.filter((s) => s.length >= filterDto.min_length!);
    }

    if (filterDto.max_length !== undefined) {
      results = results.filter((s) => s.length <= filterDto.max_length!);
    }

    if (filterDto.word_count !== undefined) {
      results = results.filter((s) => s.word_count === filterDto.word_count);
    }

    if (filterDto.contains_character !== undefined) {
      results = results.filter(
        (s) =>
          (s.character_frequency_map[filterDto.contains_character!] ?? 0) > 0,
      );
    }

    return {
      data: results.map((s) => this.formatResponse(s)),
      count: results.length,
      filters_applied: filterDto,
    };
  }

  findByNaturalLanguage(query: string) {
    const parseResult = NaturalLanguageParser.parse(query);
    const filterDto: FilterStringsDto = parseResult.parsed_filters;
    const result = this.findAll(filterDto);

    return {
      data: result.data,
      count: result.count,
      interpreted_query: parseResult,
    };
  }

  remove(stringValue: string) {
    this.storage.remove(stringValue);
  }

  private formatResponse(storedString: StoredString) {
    return {
      id: storedString.id,
      value: storedString.value,
      properties: {
        length: storedString.length,
        is_palindrome: storedString.is_palindrome,
        unique_characters: storedString.unique_characters,
        word_count: storedString.word_count,
        sha256_hash: storedString.sha256_hash,
        character_frequency_map: storedString.character_frequency_map,
      },
      created_at: storedString.created_at,
    };
  }
}
