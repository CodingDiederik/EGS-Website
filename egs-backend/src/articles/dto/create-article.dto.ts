import { IsDate, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(5000)
  content!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  publicAuthor!: string;

  @IsDate()
  publicationDate?: Date;
}
