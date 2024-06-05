import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDTO } from './dto/CreatePostDTO.dto';
import { CreateResponseService } from 'src/utils/createResponse/createResponse.service';
import { CustomRequest } from 'src/common/types';
import { Model } from 'mongoose';
import { Posts, SavedUserPosts } from './posts.interface';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';

@Injectable()
export class PostsService {
  constructor(
    @Inject('POSTS_TEST_MODEL')
    private postsTestModel: Model<Posts>,
    @Inject('SAVED_USER_POSTS_MODEL')
    private savedUserPostsModel: Model<SavedUserPosts>,
    private createResponse: CreateResponseService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createPostService(
    req: CustomRequest,
    { title, message, tags, selectedFile, name }: CreatePostDTO,
  ) {
    const session = await this.postsTestModel.startSession();
    session.startTransaction();
    try {
      const postInst = new this.postsTestModel({
        title,
        message,
        tags,
        name,
        creator: req.userId,
        createdAt: new Date().toISOString(),
      });

      let newPost = await postInst.save({ session });

      const cloudinaryResp = await this.cloudinaryService.convertImgToCloudURL(
        selectedFile,
        newPost._id.toString(),
        'Posts',
      );

      newPost.selectedFile = cloudinaryResp.secure_url;
      const updatedPost = await newPost.save({ session });

      await session.commitTransaction();
      session.endSession();

      return this.createResponse.successResponse(updatedPost, '');
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return this.createResponse.handleError(error);
    }
  }
}
