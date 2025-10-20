import { Module } from '@nestjs/common';
import { StringsService } from './strings.service';
import { StringsController } from './strings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StringEntity } from './entities/string.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StringEntity])],
  controllers: [StringsController],
  providers: [StringsService],
})
export class StringsModule {}
