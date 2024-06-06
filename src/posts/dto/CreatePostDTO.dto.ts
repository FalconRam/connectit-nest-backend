import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDTO {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsString()
  tags: string;

  @IsString()
  @IsNotEmpty()
  selectedFile: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
