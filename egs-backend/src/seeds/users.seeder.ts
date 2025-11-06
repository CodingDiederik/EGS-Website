import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { UserRole } from '../users/users.enum';
import * as bcrypt from 'bcrypt';

export default class UserSeeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(User);

    const seeds = [
      {
        email: 'admin@example.com',
        name: 'Admin User',
        hashedPassword: await bcrypt.hash('adminpassword', 10),
        role: UserRole.ADMIN,
      },
      {
        email: 'user@example.com',
        name: 'Regular User',
        hashedPassword: await bcrypt.hash('userpassword', 10),
        role: UserRole.USER,
      },
    ];

    for (const seed of seeds) {
      if (await repository.findOneBy({ email: seed.email })) {
        if (process.env.OVERRIDE_SEEDS == 'true') {
          await repository.delete({ email: seed.email });
        } else {
          continue;
        }
      }

      const user = repository.create(seed);
      await repository.save(user);
    }
  }
}
