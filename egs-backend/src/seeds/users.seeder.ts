import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { UserRole } from '../users/user.entity';

export default class UserSeeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(User);

    const seeds = [
      {
        email: 'admin@example.com',
        name: 'Admin User',
        hashedPassword: 'hashedpassword1',
        role: UserRole.ADMIN,
      },
      {
        email: 'user@example.com',
        name: 'Regular User',
        hashedPassword: 'hashedpassword2',
        role: UserRole.USER,
      },
    ];

    for (const seed of seeds) {
      if (await repository.findOneBy({ email: seed.email })) {
        continue;
      }

      const user = repository.create(seed);
      await repository.save(user);
    }

  }
}
