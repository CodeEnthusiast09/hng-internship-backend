import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  capital: string;

  @Column({ nullable: true })
  region: string;

  @Column({ type: 'bigint' })
  population: number;

  @Column({ name: 'currency_code', nullable: true })
  currencyCode: string;

  @Column({
    name: 'exchange_rate',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  exchangeRate: number;

  @Column({
    name: 'estimated_gdp',
    type: 'decimal',
    precision: 20,
    scale: 2,
    nullable: true,
  })
  estimatedGdp: number;

  @Column({ name: 'flag_url', nullable: true })
  flagUrl: string;

  @Column({ name: 'last_refreshed_at', type: 'timestamp', nullable: true })
  lastRefreshedAt: Date;
}
