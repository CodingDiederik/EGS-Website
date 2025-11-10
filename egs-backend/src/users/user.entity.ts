import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/entities/baseEntity';
import { UserRole } from './users.enum';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column()
  @Exclude()
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Column({ nullable: true })
  @Exclude()
  JTI?: string;
}
