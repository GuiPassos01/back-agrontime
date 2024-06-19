import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MailService } from './mail.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}