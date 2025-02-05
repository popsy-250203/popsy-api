import { IsNotEmpty, IsNumber } from 'class-validator';

export class UnlikePostDto {
  @IsNumber()
  @IsNotEmpty()
  postId: number;
}
