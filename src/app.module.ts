import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StringsModule } from './strings/strings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    StringsModule,
  ],
})
export class AppModule {}
