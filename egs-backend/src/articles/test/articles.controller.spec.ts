import { ArticlesController } from '../articles.controller';
import { CreateArticleRequest } from '../dto/create-article.dto';

describe('ArticlesController', () => {
  let controller: ArticlesController;

  let mockArticlesService: any = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllUnpublished: jest.fn(),
    findOneUnpublished: jest.fn(),
    findRecent: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    controller = new ArticlesController(mockArticlesService);
  });

  describe('/ (POST)', () => {
    it('should create an article', async () => {
      const createArticleDto: CreateArticleRequest = {
        title: 'Test Article',
        content: 'This is a test article.',
        publicAuthor: 'John Doe',
      };

      const result = {
        id: 1,
        ...createArticleDto,
      };

      jest
        .spyOn(mockArticlesService, 'create')
        .mockImplementation(async () => result);

      expect(await controller.create(createArticleDto)).toBe(result);
    });
  });

  describe('/ (GET)', () => {
    it('should return an array of articles', async () => {
      const result = [
        {
          id: 1,
          title: 'Test Article',
          content: 'This is a test article.',
          publicAuthor: 'John Doe',
        },
      ];

      jest
        .spyOn(mockArticlesService, 'findAll')
        .mockImplementation(async () => result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('/recent (GET)', () => {
    it('should return an array of recent published articles', async () => {
      const result = [
        {
          id: 3,
          title: 'Recent Article',
          content: 'This is a recent published article.',
          publicAuthor: 'Alice Smith',
        },
      ];

      jest
        .spyOn(mockArticlesService, 'findRecent')
        .mockImplementation(async () => result);

      expect(await controller.findRecent()).toBe(result);
    });
  });

  describe('/unpublished (GET)', () => {
    it('should return an array of unpublished articles', async () => {
      const result = [
        {
          id: 2,
          title: 'Unpublished Article',
          content: 'This article is not yet published.',
          publicAuthor: 'Jane Doe',
        },
      ];

      jest
        .spyOn(mockArticlesService, 'findAllUnpublished')
        .mockImplementation(async () => result);

      expect(await controller.findAllUnpublished()).toBe(result);
    });
  });

  describe('/:id (GET)', () => {
    it('should return an article by ID', async () => {
      const articleId = 1;
      const result = {
        id: articleId,
        title: 'Test Article',
        content: 'This is a test article.',
        publicAuthor: 'John Doe',
      };

      jest
        .spyOn(mockArticlesService, 'findOne')
        .mockImplementation(async () => result);

      expect(await controller.findOne(articleId)).toBe(result);
    });

    it('should throw NotFoundException if article not found', async () => {
      const articleId = 999;

      jest
        .spyOn(mockArticlesService, 'findOne')
        .mockImplementation(async () => null);

      await expect(controller.findOne(articleId)).rejects.toThrow(
        'Article not found',
      );
    });
  });

  describe('/:id (PATCH)', () => {
    it('should update an article', async () => {
      const articleId = 1;
      const updateData = { title: 'Updated Title' };
      const result = {
        id: articleId,
        title: 'Updated Title',
        content: 'This is a test article.',
        publicAuthor: 'John Doe',
      };

      jest
        .spyOn(mockArticlesService, 'update')
        .mockImplementation(async () => result);

      expect(await controller.update(articleId, updateData)).toBe(result);
    });
  });

  describe('/:id (DELETE)', () => {
    it('should delete an article', async () => {
      const articleId = 1;

      jest
        .spyOn(mockArticlesService, 'remove')
        .mockImplementation(async () => {});

      expect(await controller.remove(articleId)).toBeUndefined();
    });
  });

  describe('/unpublished/:id (GET)', () => {
    it('should return an unpublished article by ID', async () => {
      const articleId = 2;
      const result = {
        id: articleId,
        title: 'Unpublished Article',
        content: 'This article is not yet published.',
        publicAuthor: 'Jane Doe',
      };

      jest
        .spyOn(mockArticlesService, 'findOneUnpublished')
        .mockImplementation(async () => result);

      expect(await controller.findOneUnpublished(articleId)).toBe(result);
    });
  });
});
