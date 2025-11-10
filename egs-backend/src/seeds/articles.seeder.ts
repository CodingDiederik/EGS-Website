import { Article } from '../articles/article.entity';
import { DataSource } from 'typeorm';

export default class ArticleSeeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Article);

    const seeds = [
      {
        title: 'Jeugdkampioenschap 2025 - winter',
        content:
          'Het jeugdkampioenschap van 2025 zal plaatsvinden in de winterperiode. Meer details volgen binnenkort.',
        publicAuthor: 'Admin Team',
        publicationDate: new Date('2024-12-01'),
      },
      {
        title: 'Lente Toernooi 2025 Aankondiging',
        content:
          'We zijn verheugd om het Lente Toernooi van 2025 aan te kondigen, dat zal plaatsvinden in april. Schrijf je snel in!',
        publicAuthor: 'Toernooicommissie',
        publicationDate: new Date('2025-02-15'),
      },
      {
        title: 'Zomerkamp 2026 - Registratie Geopend',
        content:
          'De registratie voor het Zomerkamp van 2026 is nu geopend! Zorg ervoor dat je je plek veiligstelt voor een onvergetelijke ervaring.',
        publicAuthor: 'Kampcoördinator',
        publicationDate: new Date('2026-03-10'),
      },
      {
        title: 'Kersttoernooi 2025 - Save the Date',
        content:
          'Het jaarlijkse Kersttoernooi zal plaatsvinden op 20 december 2025. Bereid je voor op een dag vol plezier en competitie!',
        publicAuthor: 'Evenemententeam',
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
