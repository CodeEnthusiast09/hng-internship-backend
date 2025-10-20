import {
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';

export interface ParsedFilters {
  is_palindrome?: boolean;
  min_length?: number;
  max_length?: number;
  word_count?: number;
  contains_character?: string;
}

export interface NLParseResult {
  original: string;
  parsed_filters: ParsedFilters;
}

export class NaturalLanguageParser {
  static parse(query: string): NLParseResult {
    const lowerQuery = query.toLowerCase().trim();
    const filters: ParsedFilters = {};

    try {
      // Parse palindrome
      if (this.containsPalindromeKeyword(lowerQuery)) {
        filters.is_palindrome = true;
      }

      // Parse word count
      const wordCount = this.parseWordCount(lowerQuery);
      if (wordCount !== null) {
        filters.word_count = wordCount;
      }

      // Parse length constraints
      const lengthConstraints = this.parseLengthConstraints(lowerQuery);
      if (lengthConstraints.min_length !== null) {
        filters.min_length = lengthConstraints.min_length;
      }
      if (lengthConstraints.max_length !== null) {
        filters.max_length = lengthConstraints.max_length;
      }

      // Parse character containment
      const character = this.parseContainsCharacter(lowerQuery);
      if (character !== null) {
        filters.contains_character = character;
      }

      // Check if we parsed anything
      if (Object.keys(filters).length === 0) {
        throw new BadRequestException('Unable to parse natural language query');
      }

      // Check for conflicting filters
      this.validateFilters(filters);

      return {
        original: query,
        parsed_filters: filters,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnprocessableEntityException
      ) {
        throw error;
      }
      throw new BadRequestException('Unable to parse natural language query');
    }
  }

  private static containsPalindromeKeyword(query: string): boolean {
    const palindromeKeywords = [
      'palindrome',
      'palindromic',
      'palindromes',
      'reads the same backwards',
      'same forwards and backwards',
    ];
    return palindromeKeywords.some((keyword) => query.includes(keyword));
  }

  private static parseWordCount(query: string): number | null {
    // Pattern: "single word" -> 1
    if (query.includes('single word')) {
      return 1;
    }

    // Pattern: "two word" or "2 word" -> 2
    if (query.match(/two\s+words?/)) {
      return 2;
    }

    // Pattern: "three word" or "3 word" -> 3
    if (query.match(/three\s+words?/)) {
      return 3;
    }

    // Pattern: "X words" where X is a number
    const numberWordMatch = query.match(/(\d+)\s+words?/);
    if (numberWordMatch) {
      return parseInt(numberWordMatch[1], 10);
    }

    // Pattern: word count specific numbers
    const wordNumberMap: Record<string, number> = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
    };

    for (const [word, count] of Object.entries(wordNumberMap)) {
      if (query.match(new RegExp(`\\b${word}\\s+words?\\b`))) {
        return count;
      }
    }

    return null;
  }

  private static parseLengthConstraints(query: string): {
    min_length: number | null;
    max_length: number | null;
  } {
    let min_length: number | null = null;
    let max_length: number | null = null;

    // Pattern: "longer than X" or "more than X characters"
    const longerThanMatch = query.match(/(?:longer|more)\s+than\s+(\d+)/);
    if (longerThanMatch) {
      min_length = parseInt(longerThanMatch[1], 10) + 1;
    }

    // Pattern: "at least X characters"
    const atLeastMatch = query.match(/at\s+least\s+(\d+)/);
    if (atLeastMatch) {
      min_length = parseInt(atLeastMatch[1], 10);
    }

    // Pattern: "shorter than X" or "less than X characters"
    const shorterThanMatch = query.match(/(?:shorter|less)\s+than\s+(\d+)/);
    if (shorterThanMatch) {
      max_length = parseInt(shorterThanMatch[1], 10) - 1;
    }

    // Pattern: "at most X characters"
    const atMostMatch = query.match(/at\s+most\s+(\d+)/);
    if (atMostMatch) {
      max_length = parseInt(atMostMatch[1], 10);
    }

    // Pattern: "between X and Y characters"
    const betweenMatch = query.match(/between\s+(\d+)\s+and\s+(\d+)/);
    if (betweenMatch) {
      min_length = parseInt(betweenMatch[1], 10);
      max_length = parseInt(betweenMatch[2], 10);
    }

    // Pattern: "exactly X characters"
    const exactlyMatch = query.match(/exactly\s+(\d+)/);
    if (exactlyMatch) {
      const exactLength = parseInt(exactlyMatch[1], 10);
      min_length = exactLength;
      max_length = exactLength;
    }

    return { min_length, max_length };
  }

  private static parseContainsCharacter(query: string): string | null {
    // Pattern: "containing the letter X" or "contains the letter X"
    const letterMatch = query.match(
      /contain(?:s|ing)?\s+(?:the\s+)?letter\s+([a-z])/,
    );
    if (letterMatch) {
      return letterMatch[1];
    }

    // Pattern: "containing X" where X is a single character
    const charMatch = query.match(/contain(?:s|ing)?\s+([a-z])(?:\s|$)/);
    if (charMatch) {
      return charMatch[1];
    }

    // Pattern: "with the letter X"
    const withLetterMatch = query.match(/with\s+(?:the\s+)?letter\s+([a-z])/);
    if (withLetterMatch) {
      return withLetterMatch[1];
    }

    // Pattern: "first vowel" -> 'a'
    if (query.includes('first vowel')) {
      return 'a';
    }

    // Pattern: "last vowel" -> 'u'
    if (query.includes('last vowel')) {
      return 'u';
    }

    // Pattern: "a vowel"
    if (query.match(/\ba\s+vowel\b/)) {
      return 'a'; // Default to 'a' as heuristic
    }

    return null;
  }

  private static validateFilters(filters: ParsedFilters): void {
    // Check for conflicting min/max length
    if (
      filters.min_length !== undefined &&
      filters.max_length !== undefined &&
      filters.min_length > filters.max_length
    ) {
      throw new UnprocessableEntityException(
        'Query parsed but resulted in conflicting filters: min_length cannot be greater than max_length',
      );
    }

    // Add more validation as needed
  }
}
