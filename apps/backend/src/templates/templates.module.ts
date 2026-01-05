import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import {
  TemplateCollection,
  CustomTemplate,
  FavoriteTemplate,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TemplateCollection,
      CustomTemplate,
      FavoriteTemplate,
    ]),
  ],
  controllers: [TemplatesController],
  providers: [TemplatesService],
  exports: [TemplatesService],
})
export class TemplatesModule {}
