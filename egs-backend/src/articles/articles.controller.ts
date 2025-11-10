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
  NotFoundException,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleRequest } from './dto/create-article.dto';
import { UpdateArticleRequest } from './dto/update-article.dto';
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
  async create(@Body() createArticleDto: CreateArticleRequest) {
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
   * Gets all unpublished articles.
   * @returns
   */
  @Get('/unpublished')
  async findAllUnpublished() {
    return await this.articlesService.findAllUnpublished();
  }

  /**
   * Get an article by ID.
   */
  @Get('/unpublished/:articleId')
  async findOneUnpublished(
    @Param('articleId', ParseIntPipe) articleId: number,
  ) {
    return await this.articlesService.findOneUnpublished(articleId);
  }

  /**
   * Get an article by ID which is published. (Public)
   * @param articleId
   * @returns
   */
  @Get(':articleId')
  @Public()
  async findOne(@Param('articleId', ParseIntPipe) articleId: number) {
    const article = await this.articlesService.findOne(articleId);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
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
    @Body() updateArticleDto: UpdateArticleRequest,
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
