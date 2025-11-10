import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { LessThanOrEqual, MoreThan, Repository, IsNull } from 'typeorm';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  /**
   * Creates a new article.
   * @param createArticleDto
   * @returns the created article
   */
  async create(createArticleDto: CreateArticleDto) {
    const article = new Article();
    article.title = createArticleDto.title;
    article.content = createArticleDto.content;
    article.publicAuthor = createArticleDto.publicAuthor;
    if (createArticleDto.publicationDate) {
      article.publicationDate = new Date(createArticleDto.publicationDate);
    }

    await this.articleRepository.save(article);

    return article;
  }

  /**
   * Gets all published articles.
   * @returns an array of published articles
   */
  async findAll(): Promise<Article[]> {
    return await this.articleRepository.find({
      where: {
        publicationDate: LessThanOrEqual(new Date()),
      },
    });
  }

  /**
   * Finds all unpublished articles.
   * @returns an array of unpublished articles
   */
  async findAllUnpublished(): Promise<Article[]> {
    return await this.articleRepository.find({
      where: [
        { publicationDate: IsNull() },
        { publicationDate: MoreThan(new Date()) },
      ],
    });
  }

  /**
   * Finds an article by ID.
   * @param id - The ID of the article to find.
   * @returns The found article or null if not found or unpublished.
   */
  async findOne(id: number): Promise<Article | null> {
    const article = await this.articleRepository.findOneByOrFail({ id });
    if (!article.publicationDate || article.publicationDate > new Date()) {
      return null;
    }
    return article;
  }

  /**
   * Finds an article by ID.
   * @param id - The ID of the article to find.
   * @returns The found article or null if not found.
   */
  async findOneUnpublished(id: number): Promise<Article | null> {
    const article = await this.articleRepository.findOneByOrFail({ id });
    return article;
  }

  /**
   * Updates an article by ID.
   * @param id - The ID of the article to update.
   * @param updateArticleDto - The data to update the article with.
   * @returns The updated article.
   */
  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    const article = await this.articleRepository.findOneByOrFail({ id });

    if (updateArticleDto.title !== undefined) {
      article.title = updateArticleDto.title;
    }
    if (updateArticleDto.content !== undefined) {
      article.content = updateArticleDto.content;
    }
    if (updateArticleDto.publicAuthor !== undefined) {
      article.publicAuthor = updateArticleDto.publicAuthor;
    }
    if (updateArticleDto.publicationDate !== undefined) {
      article.publicationDate = new Date(updateArticleDto.publicationDate);
    }

    await this.articleRepository.save(article);
    return article;
  }

  /**
   * Soft deletes an article by ID.
   * @param id - The ID of the article to delete.
   */
  async remove(id: number): Promise<void> {
    await this.articleRepository.softDelete(id);
  }
}
