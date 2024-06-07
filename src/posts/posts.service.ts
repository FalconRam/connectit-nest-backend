import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDTO } from './dto/CreatePostDTO.dto';
import { CreateResponseService } from 'src/utils/createResponse/createResponse.service';
import { CustomRequest } from 'src/common/types';
import mongoose, { Model } from 'mongoose';
import { Posts, SavedUserPosts } from './posts.interface';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
import { User } from 'src/user/user.interface';
import { UpdatePostDTO } from './dto/UpdatePostDTO';
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class PostsService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
    @Inject('POSTS_MESSAGE_MODEL')
    private postsMessageModel: Model<Posts>,
    @Inject('SAVED_USER_POSTS_MODEL')
    private savedUserPostsModel: Model<SavedUserPosts>,
    private createResponse: CreateResponseService,
    private cloudinaryService: CloudinaryService,
    private profileService: ProfileService,
  ) {}

  async createPostService(
    req: CustomRequest,
    { title, message, tags, selectedFile, name }: CreatePostDTO,
  ) {
    // Initiate & Start Session
    const session = await this.postsMessageModel.startSession();
    session.startTransaction();
    try {
      // Create New Instance of post
      const postInst = new this.postsMessageModel({
        title,
        message,
        tags,
        name,
        creator: req.userId,
        createdAt: new Date().toISOString(),
      });

      let newPost = await postInst.save({ session });

      // Upload image to Cloudinary & get Image URL
      const cloudinaryResp = await this.cloudinaryService.convertImgToCloudURL(
        selectedFile,
        newPost._id.toString(),
        'Posts',
      );

      // Update the Post with Cloudinary Image URL
      newPost.selectedFile = cloudinaryResp.secure_url;
      await newPost.save({ session });

      // Commit Transaction
      await session.commitTransaction();

      return this.createResponse.successResponse(newPost, '');
    } catch (error) {
      // Abort Instance created, if any error occurs
      await session.abortTransaction();
      return this.createResponse.handleError(error);
    } finally {
      session.endSession();
    }
  }

  async getPostByPostIdService(userId: string, postId: string) {
    try {
      const pipeLine = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(postId),
          },
        },
        {
          $addFields: {
            creator: { $toObjectId: userId },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'creator',
            foreignField: '_id',
            as: 'userInfo',
          },
        },
        {
          $project: {
            title: 1,
            message: 1,
            name: 1,
            creator: 1,
            tags: 1,
            selectedFile: 1,
            likes: 1,
            comments: 1,
            commentsInfo: 1,
            createdAt: 1,
            profilePicture: { $arrayElemAt: ['$userInfo.profilePicture', 0] },
            creatorBio: { $arrayElemAt: ['$userInfo.bio', 0] },
          },
        },
      ];

      const post = await this.postsMessageModel.aggregate(pipeLine);

      if (!post)
        throw new NotFoundException(
          this.createResponse.customErrorResponse(404, {}, 'Post not found'),
        );

      return this.createResponse.successResponse(post, '');
    } catch (error) {
      this.createResponse.handleError(error);
    }
  }

  async getPostsByUserIdService(userId: string) {
    try {
      // const userDetails = await this.userModel
      //   .findById(userId)
      //   .select('-password');
      // if (!userDetails)
      //   throw new NotFoundException(
      //     this.createResponse.customErrorResponse(404, {}, 'User not found'),
      //   );

      const userDetails = await this.getUserById(userId);

      // Get Posts of the User
      const userPosts = await this.postsMessageModel
        .find({
          creator: userDetails._id,
        })
        .select('-__v');

      // Sort Post by Newly created
      userPosts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      return this.createResponse.successResponse(userPosts, '');
    } catch (error) {
      this.createResponse.handleError(error);
    }
  }

  async updatePostService(
    userId: string,
    postId: string,
    updatePostDTO: UpdatePostDTO,
  ) {
    try {
      // Check if User Exits
      await this.getUserById(userId);

      const updatedPost = await this.postsMessageModel
        .findByIdAndUpdate(postId, updatePostDTO, { new: true })
        .select('-__v');

      if (!updatedPost)
        throw new NotFoundException(
          this.createResponse.customErrorResponse(404, {}, 'Post not found'),
        );

      return this.createResponse.successResponse(updatedPost, '');
    } catch (error) {
      return this.createResponse.handleError(error);
    }
  }

  async getPostbyFollowingService(userId: string) {
    try {
      const { following: followingIds } = await this.getUserById(userId);
      followingIds.push(userId);

      let pipeline = [
        { $match: { creator: { $in: followingIds } } },
        {
          $addFields: {
            creator: { $toObjectId: '$creator' },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'creator',
            foreignField: '_id',
            as: 'userInfo',
          },
        },
        {
          $project: {
            title: 1,
            message: 1,
            name: 1,
            creator: 1,
            tags: 1,
            selectedFile: 1,
            likes: 1,
            comments: 1,
            commentsInfo: 1,
            createdAt: 1,
            profilePicture: { $arrayElemAt: ['$userInfo.profilePicture', 0] },
            creatorBio: { $arrayElemAt: ['$userInfo.bio', 0] },
          },
        },
      ];
      const posts = await this.postsMessageModel
        .aggregate(pipeline)
        .sort({ createdAt: -1 });

      return this.createResponse.successResponse(posts, 'Posts Fetched');
    } catch (error) {
      this.createResponse.handleError(error);
    }
  }

  // Common ProfileService to get User details
  private async getUserById(userId: string): Promise<User> {
    const userResponse = await this.profileService.getUserCommonService(userId);
    if (!userResponse.isExists) {
      throw new NotFoundException(
        this.createResponse.customErrorResponse(404, {}, 'User not found'),
      );
    }
    return userResponse.userDetails as User;
  }
}
