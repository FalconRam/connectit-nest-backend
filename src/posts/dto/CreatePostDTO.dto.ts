import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  tags: string;

  @IsString()
  @IsNotEmpty()
  selectedFile: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
