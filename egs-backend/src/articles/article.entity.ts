import { Column } from 'typeorm';
import { BaseEntity } from '../common/entities/baseEntity';

export class Article extends BaseEntity {
  @Column()
  title!: string;

  @Column('text')
  content!: string;
}
