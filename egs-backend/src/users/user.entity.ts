import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/entities/baseEntity';
import { UserRole } from './users.enum';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column()
  hashedPassword!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Column({ nullable: true })
  JTI?: string;
}
