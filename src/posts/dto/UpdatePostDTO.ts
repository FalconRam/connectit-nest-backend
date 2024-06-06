import { IsString } from 'class-validator';

export class UpdatePostDTO {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsString()
  tags: string;
}
