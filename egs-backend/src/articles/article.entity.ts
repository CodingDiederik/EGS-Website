import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/entities/baseEntity';

@Entity()
export class Article extends BaseEntity {
  @Column()
  title!: string;

  @Column('text')
  content!: string;

  @Column()
  publicAuthor!: string;

  @Column({ nullable: true })
  publicationDate?: Date;
}
