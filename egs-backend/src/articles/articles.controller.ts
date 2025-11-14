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
import { Article } from './article.entity';

@Controller('articles')
@UseInterceptors(ClassSerializerInterceptor)
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  /**
   * Create a new article.
   * @param createArticleDto
   * @returns The created article
   */
  @Post()
  async create(@Body() createArticleDto: CreateArticleRequest): Promise<Article> {
    return await this.articlesService.create(createArticleDto);
  }

  /**
   * Get all articles. (Public)
   * @returns All articles
   */
  @Get()
  @Public()
  async findAll(): Promise<Article[]> {
    return await this.articlesService.findAll();
  }

  /**
   * Gets the 6 most recent published articles. (Public)
   * @returns The 6 most recent published articles
   */
  @Get('/recent')
  @Public()
  async findRecent(): Promise<Article[]> {
    return await this.articlesService.findRecent();
  }

  /**
   * Gets all unpublished articles.
   * @returns All unpublished articles
   */
  @Get('/unpublished')
  async findAllUnpublished(): Promise<Article[]> {
    return await this.articlesService.findAllUnpublished();
  }

  /**
   * Get an article by ID.
   * @param articleId the ID of the article
   * @throws NotFoundException if the article is not found
   * @returns The unpublished article
   */
  @Get('/unpublished/:articleId')
  async findOneUnpublished(
    @Param('articleId', ParseIntPipe) articleId: number,
  ) {
    return await this.articlesService.findOneUnpublished(articleId);
  }

  /**
   * Get an article by ID which is published. (Public)
   * @param articleId the ID of the article
   * @returns The published article
   * @throws NotFoundException if the article is not found
   */
  @Get(':articleId')
  @Public()
  async findOne(@Param('articleId', ParseIntPipe) articleId: number): Promise<Article> {
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
   * @returns The updated article
   * @throws NotFoundException if the article is not found
   */
  @Patch(':articleId')
  async update(
    @Param('articleId', ParseIntPipe) articleId: number,
    @Body() updateArticleDto: UpdateArticleRequest,
  ): Promise<Article> {
    return await this.articlesService.update(articleId, updateArticleDto);
  }

  /**
   * Delete an article by ID.
   * @param articleId
   * @returns nothing
   */
  @Delete(':articleId')
  async remove(@Param('articleId', ParseIntPipe) articleId: number): Promise<void> {
    return await this.articlesService.remove(articleId);
  }
}
