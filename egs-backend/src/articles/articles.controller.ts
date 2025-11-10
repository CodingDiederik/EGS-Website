import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  findAll() {
    return this.articlesService.findAll();
  }

  @Get(':articleId')
  findOne(@Param('articleId', ParseIntPipe) articleId: number) {
    return this.articlesService.findOne(articleId);
  }

  @Patch(':articleId')
  update(
    @Param('articleId', ParseIntPipe) articleId: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.update(articleId, updateArticleDto);
  }

  @Delete(':articleId')
  remove(@Param('articleId', ParseIntPipe) articleId: number) {
    return this.articlesService.remove(articleId);
  }
}
