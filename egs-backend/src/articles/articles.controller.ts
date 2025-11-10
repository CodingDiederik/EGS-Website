import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('articles')
@UseInterceptors(ClassSerializerInterceptor)
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  /**
   * Create a new article.
   * @param createArticleDto
   * @returns
   */
  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    return await this.articlesService.create(createArticleDto);
  }

  /**
   * Get all articles. (Public)
   * @returns
   */
  @Get()
  @Public()
  async findAll() {
    return await this.articlesService.findAll();
  }

  /**
   * Get an article by ID. (Public)
   * @param articleId
   * @returns
   */
  @Get(':articleId')
  @Public()
  async findOne(@Param('articleId', ParseIntPipe) articleId: number) {
    return await this.articlesService.findOne(articleId);
  }

  /**
   * Update an article by ID.
   * @param articleId
   * @param updateArticleDto
   * @returns
   */
  @Patch(':articleId')
  async update(
    @Param('articleId', ParseIntPipe) articleId: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return await this.articlesService.update(articleId, updateArticleDto);
  }

  /**
   * Delete an article by ID.
   * @param articleId
   * @returns
   */
  @Delete(':articleId')
  async remove(@Param('articleId', ParseIntPipe) articleId: number) {
    return await this.articlesService.remove(articleId);
  }
}
