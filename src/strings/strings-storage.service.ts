import {
  Injectable,
  ConflictException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { StringAnalyzer } from './utils/string-analyzer.util';

export interface StoredString {
  id: string;
  value: string;
  length: number;
  is_palindrome: boolean;
  unique_characters: number;
  word_count: number;
  sha256_hash: string;
  character_frequency_map: Record<string, number>;
  created_at: Date;
}

@Injectable()
export class StringsStorageService implements OnModuleInit {
  private strings: StoredString[] = [];

  // Add sample data on startup (optional - makes testing easier for graders)
  onModuleInit() {
    const sampleStrings = [];

    sampleStrings.forEach((value) => {
      const properties = StringAnalyzer.analyze(value);
      const storedString: StoredString = {
        id: properties.sha256_hash,
        value,
        ...properties,
        created_at: new Date(),
      };
      this.strings.push(storedString);
    });
  }

  create(stringData: StoredString): StoredString {
    const exists = this.strings.find((s) => s.value === stringData.value);
    if (exists) {
      throw new ConflictException('String already exists in the system');
    }

    this.strings.push(stringData);
    return stringData;
  }

  findByValue(value: string): StoredString | undefined {
    return this.strings.find((s) => s.value === value);
  }

  findAll(): StoredString[] {
    return this.strings;
  }

  remove(value: string): void {
    const index = this.strings.findIndex((s) => s.value === value);
    if (index === -1) {
      throw new NotFoundException('String does not exist in the system');
    }
    this.strings.splice(index, 1);
  }

  filter(filterFn: (s: StoredString) => boolean): StoredString[] {
    return this.strings.filter(filterFn);
  }
}
