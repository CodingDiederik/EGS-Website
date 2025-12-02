import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateArticleRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(57)
  title!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(5000)
  content!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  publicAuthor!: string;

  @IsOptional()
  @IsDate()
  publicationDate?: Date;
}
