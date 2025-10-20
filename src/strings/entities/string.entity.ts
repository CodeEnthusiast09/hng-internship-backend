import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('strings')
export class StringEntity {
  @PrimaryColumn()
  id: string; // SHA256 hash

  @Column({ type: 'text', unique: true })
  value: string;

  @Column({ type: 'int' })
  length: number;

  @Column({ type: 'boolean' })
  is_palindrome: boolean;

  @Column({ type: 'int' })
  unique_characters: number;

  @Column({ type: 'int' })
  word_count: number;

  @Column({ type: 'varchar' })
  sha256_hash: string;

  @Column({ type: 'jsonb' })
  character_frequency_map: Record<string, number>;

  @CreateDateColumn()
  created_at: Date;
}
