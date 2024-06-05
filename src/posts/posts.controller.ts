import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreatePostDTO } from './dto/CreatePostDTO.dto';
import { PostsService } from './posts.service';
import { CreateResponseService } from 'src/utils/createResponse/createResponse.service';
import { CustomRequest } from 'src/common/types';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private createResponse: CreateResponseService,
  ) {}

  @Post('/create')
  createPostController(
    @Req() req: CustomRequest,
    @Body() createPostDTO: CreatePostDTO,
  ) {
    const { title, message, tags, selectedFile, name } = createPostDTO;
    if (!title || !message || !tags || !selectedFile || !name)
      return this.createResponse.customErrorResponse(
        400,
        {},
        'All Fields are required',
      );
    return this.postsService.createPostService(req, {
      title,
      message,
      tags,
      selectedFile,
      name,
    });
  }
}
