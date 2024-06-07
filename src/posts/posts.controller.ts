import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { CreatePostDTO } from './dto/CreatePostDTO.dto';
import { PostsService } from './posts.service';
import { CreateResponseService } from 'src/utils/createResponse/createResponse.service';
import { CustomRequest } from 'src/common/types';
import { UpdatePostDTO } from './dto/UpdatePostDTO';

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

  @Get('/feeds')
  getPostsByFollowing(@Req() req: CustomRequest) {
    return this.postsService.getPostbyFollowingService(req.userId);
  }

  @Get('/user-posts/:userId')
  getPostsByUserIdContorller(@Param() params: any) {
    if (!params.userId)
      throw new BadRequestException(
        this.createResponse.customErrorResponse(400, {}, 'UserId is Required'),
      );
    return this.postsService.getPostsByUserIdService(params.userId);
  }

  @Patch('/update/:postId')
  updatePostContorller(
    @Req() req: CustomRequest,
    @Body() updatePostDTO: UpdatePostDTO,
    @Param() params: any,
  ) {
    if (!params.postId)
      throw new BadRequestException(
        this.createResponse.customErrorResponse(400, {}, 'PostId is Required'),
      );
    return this.postsService.updatePostService(
      req.userId,
      params.postId,
      updatePostDTO,
    );
  }

  @Get('/:postId')
  getPostByPostIdContorller(@Req() req: CustomRequest, @Param() params: any) {
    if (!params.postId)
      throw new BadRequestException(
        this.createResponse.customErrorResponse(400, {}, 'PostId is Required'),
      );
    return this.postsService.getPostByPostIdService(req.userId, params.postId);
  }
}
