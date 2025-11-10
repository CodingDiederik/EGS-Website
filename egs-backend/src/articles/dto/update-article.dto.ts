import { PartialType } from '@nestjs/swagger';
import { CreateArticleRequest } from './create-article.dto';

export class UpdateArticleRequest extends PartialType(CreateArticleRequest) {}
