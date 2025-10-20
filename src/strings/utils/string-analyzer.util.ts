import * as CryptoJS from 'crypto-js';

export interface StringProperties {
  length: number;
  is_palindrome: boolean;
  unique_characters: number;
  word_count: number;
  sha256_hash: string;
  character_frequency_map: Record<string, number>;
}

export class StringAnalyzer {
  static analyze(value: string): StringProperties {
    return {
      length: this.calculateLength(value),
      is_palindrome: this.isPalindrome(value),
      unique_characters: this.countUniqueCharacters(value),
      word_count: this.countWords(value),
      sha256_hash: this.generateSHA256(value),
      character_frequency_map: this.generateCharacterFrequencyMap(value),
    };
  }

  private static calculateLength(value: string): number {
    return value.length;
  }

  private static isPalindrome(value: string): boolean {
    // Remove all non-alphanumeric characters and convert to lowercase
    const normalized = value.toLowerCase().replace(/[\W_]/g, '');

    if (normalized === '') return false; // Empty string after normalization

    return normalized === normalized.split('').reverse().join('');
  }

  private static countUniqueCharacters(value: string): number {
    return new Set(value).size;
  }

  private static countWords(value: string): number {
    const trimmed = value.trim();
    if (trimmed === '') return 0;
    return trimmed.split(/\s+/).length;
  }

  private static generateSHA256(value: string): string {
    return CryptoJS.SHA256(value).toString(CryptoJS.enc.Hex);
  }

  private static generateCharacterFrequencyMap(
    value: string,
  ): Record<string, number> {
    const frequencyMap: Record<string, number> = {};

    for (const char of value) {
      frequencyMap[char] = (frequencyMap[char] || 0) + 1;
    }

    return frequencyMap;
  }
}
