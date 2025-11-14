import { Article } from '../articles/article.entity';
import { DataSource } from 'typeorm';

export default class ArticleSeeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Article);

    const content = `Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.

          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.

          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.

          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.

          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.`;

    const seeds = [
      {
        title: 'Article 1',
        content: content,
        publicAuthor: 'Secretaris Jeugd',
        publicationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
      },
      {
        title: 'Article 2',
        content: content,
        publicAuthor: 'Toernooicommissie',
        publicationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 1 week ago
      },
      {
        title: 'Article 3',
        content: content,
        publicAuthor: 'Toernooicommissie',
        publicationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 1 week ago
      },
      {
        title: 'Article 4',
        content: content,
        publicAuthor: 'Toernooicommissie',
        publicationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 1 week ago
      },
      {
        title: 'Article 5',
        content: content,
        publicAuthor: 'Toernooicommissie',
        publicationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 1 week ago
      },
      {
        title: 'Article 6',
        content: content,
        publicAuthor: 'Toernooicommissie',
        publicationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 1 week ago
      },
      {
        title: 'Article 7',
        content: content,
        publicAuthor: 'Toernooicommissie',
        publicationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 1 week ago
      },
      {
        title: 'Article 8',
        content: content,
        publicAuthor: 'Kampcoördinator',
        publicationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
      },
      {
        title: 'Article 9',
        content: content,
        publicAuthor: 'Bestuur EGS',
      },
    ];

    for (const seed of seeds) {
      if (await repository.findOneBy({ title: seed.title })) {
        if (process.env.OVERRIDE_SEEDS === 'true') {
          await repository.delete({ title: seed.title });
        } else {
          continue;
        }
      }

      const article = repository.create(seed);
      await repository.save(article);
    }
  }
}
