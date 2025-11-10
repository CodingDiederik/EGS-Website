import { Exclude } from 'class-transformer';
import { User } from '../../users/user.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  @Exclude()
  createdAt!: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt!: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedDate?: Date;

  @OneToOne(() => User, (user) => user.id)
  @Exclude()
  createdBy!: User;

  @OneToOne(() => User, (user) => user.id)
  @Exclude()
  updatedBy!: User;

  @OneToOne(() => User, (user) => user.id)
  @Exclude()
  deletedBy!: User;
}
