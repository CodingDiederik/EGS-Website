import { ArticlesService } from '../articles.service';
import { CreateArticleRequest } from '../dto/create-article.dto';
import { UpdateArticleRequest } from '../dto/update-article.dto';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let mockArticlesRepository: any = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneByOrFail: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    service = new ArticlesService(mockArticlesRepository);
  });

  describe('create', () => {
    it('should create and return an article', async () => {
      const createArticleDto: CreateArticleRequest = {
        title: 'Test Article',
        content: 'This is a test article.',
        publicAuthor: 'Author Name',
        publicationDate: '2024-01-01T00:00:00Z' as unknown as Date,
      };

      const createdArticle = {
        id: 1,
        title: createArticleDto.title,
        content: createArticleDto.content,
        publicAuthor: createArticleDto.publicAuthor,
        publicationDate: createArticleDto.publicationDate,
      };

      mockArticlesRepository.create.mockReturnValue(createdArticle);
      mockArticlesRepository.save.mockResolvedValue(createdArticle);

      const result = await service.create(createArticleDto);
      expect(result).not.toBeNull();
      expect(result.title).toBe(createArticleDto.title);
      expect(result.content).toBe(createArticleDto.content);
      expect(result.publicAuthor).toBe(createArticleDto.publicAuthor);
    });
  });

  describe('findAll', () => {
    it('should return an array of articles which are published', async () => {
      const articles = [
        {
          id: 1,
          title: 'Test Article 1',
          content: 'This is a test article.',
          publicAuthor: 'Author Name',
          publicationDate: new Date('2024-01-01T00:00:00Z'),
        },
        {
          id: 2,
          title: 'Test Article 2',
          content: 'This is another test article.',
          publicAuthor: 'Author Name',
          publicationDate: new Date('2024-01-01T00:00:00Z'),
        },
      ];

      mockArticlesRepository.find.mockResolvedValue(articles);

      const result = await service.findAll();
      expect(result).toEqual(articles);
    });

    it('should return an empty array if no published articles exist', async () => {
      mockArticlesRepository.find.mockResolvedValue([]);

      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findRecent', () => {
    it('should return an array of the 6 most recent published articles', async () => {
      const articles = [
        {
          id: 1,
          title: 'Recent Article 1',
          content: 'This is a recent article.',
          publicAuthor: 'Author Name',
          publicationDate: new Date('2024-01-01T00:00:00Z'),
        },
        {
          id: 2,
          title: 'Recent Article 2',
          content: 'This is another recent article.',
          publicAuthor: 'Author Name',
          publicationDate: new Date('2024-01-01T00:00:00Z'),
        },
      ];

      mockArticlesRepository.find.mockResolvedValue(articles);

      const result = await service.findRecent();
      expect(result).toEqual(articles);
    });
  });

  describe('findAllUnpublished', () => {
    it('should return an array of articles which are unpublished', async () => {
      const articles = [
        {
          id: 1,
          title: 'Unpublished Article 1',
          content: 'This is an unpublished article.',
          publicAuthor: 'Author Name',
          publicationDate: null,
        },
        {
          id: 2,
          title: 'Unpublished Article 2',
          content: 'This is another unpublished article.',
          publicAuthor: 'Author Name',
          publicationDate: new Date('2099-01-01T00:00:00Z'),
        },
      ];

      mockArticlesRepository.find.mockResolvedValue(articles);

      const result = await service.findAllUnpublished();
      expect(result).toEqual(articles);
    });

    it('should return an empty array if no unpublished articles exist', async () => {
      mockArticlesRepository.find.mockResolvedValue([]);

      const result = await service.findAllUnpublished();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return the article if it is published', async () => {
      const article = {
        id: 1,
        title: 'Published Article',
        content: 'This is a published article.',
        publicAuthor: 'Author Name',
        publicationDate: new Date('2024-01-01T00:00:00Z'),
      };

      mockArticlesRepository.findOneByOrFail.mockResolvedValue(article);

      const result = await service.findOne(1);
      expect(result).toEqual(article);
    });

    it('should return null if the article is unpublished', async () => {
      const article = {
        id: 1,
        title: 'Unpublished Article',
        content: 'This is an unpublished article.',
        publicAuthor: 'Author Name',
        publicationDate: null,
      };

      mockArticlesRepository.findOneByOrFail.mockResolvedValue(article);

      const result = await service.findOne(1);
      expect(result).toBeNull();
    });
  });

  describe('findOneUnpublished', () => {
    it('should return the article regardless of its publication status', async () => {
      const article = {
        id: 1,
        title: 'Some Article',
        content: 'This is some article.',
        publicAuthor: 'Author Name',
        publicationDate: null,
      };

      mockArticlesRepository.findOneByOrFail.mockResolvedValue(article);

      const result = await service.findOneUnpublished(1);
      expect(result).toEqual(article);
    });
  });

  describe('update', () => {
    it('should update and return the article', async () => {
      const updateArticleDto: UpdateArticleRequest = {
        title: 'Updated Test Article',
        content: 'This is an updated test article.',
        publicationDate: new Date(Date.now()),
        publicAuthor: 'Updated Author Name',
      };

      const existingArticle = {
        id: 1,
        title: 'Test Article',
        content: 'This is a test article.',
        publicAuthor: 'Author Name',
        publicationDate: new Date('2024-01-01T00:00:00Z'),
      };

      const updatedArticle = {
        ...existingArticle,
        ...updateArticleDto,
      };

      mockArticlesRepository.findOneByOrFail.mockResolvedValue(existingArticle);
      mockArticlesRepository.save.mockResolvedValue(updatedArticle);

      const result = await service.update(1, updateArticleDto);
      expect(result).not.toBeNull();
      expect(result.title).toBe(updateArticleDto.title);
      expect(result.content).toBe(updateArticleDto.content);
      expect(result.publicAuthor).toBe(updateArticleDto.publicAuthor);
      expect(result.publicationDate).toEqual(updateArticleDto.publicationDate);
    });

    it('should not update fields that are not provided', async () => {
      const updateArticleDto: UpdateArticleRequest = {
        content: 'This is an updated test article.',
      };

      const existingArticle = {
        id: 1,
        title: 'Test Article',
        content: 'This is a test article.',
        publicAuthor: 'Author Name',
        publicationDate: new Date('2024-01-01T00:00:00Z'),
      };

      const updatedArticle = {
        ...existingArticle,
        ...updateArticleDto,
      };

      mockArticlesRepository.findOneByOrFail.mockResolvedValue(existingArticle);
      mockArticlesRepository.save.mockResolvedValue(updatedArticle);

      const result = await service.update(1, updateArticleDto);
      expect(result).not.toBeNull();
      expect(result.title).toBe(existingArticle.title);
      expect(result.content).toBe(updateArticleDto.content);
    });
  });

  describe('remove', () => {
    it('should remove the article', async () => {
      mockArticlesRepository.softDelete.mockResolvedValue(undefined);

      await service.remove(1);
      expect(mockArticlesRepository.softDelete).toHaveBeenCalledWith(1);
    });
  });
});
