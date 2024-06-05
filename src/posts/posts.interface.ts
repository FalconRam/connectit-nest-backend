import { Document } from 'mongoose';

interface ReplyComment {
  _id: string;
  replierId: string;
  replierName: string;
  reply: string;
  replyLikes: string[];
  createdAt: Date;
}

interface PostComment {
  _id: string;
  commenterId: string;
  commenterName: string;
  comment: string;
  commentLikes: string[];
  replyComments: ReplyComment[];
  createdAt: Date;
}

export interface Posts extends Document {
  _id: string;
  title: string;
  message: string;
  name: string;
  creator: string;
  tags: string[];
  selectedFile: string;
  likes: string[];
  comments: string[];
  commentsInfo: {
    postComment: PostComment[];
  };
  createdAt: Date;
}

export interface SavedUserPosts extends Document {
  userId: string;
  savedPosts: string[];
  createdAt: Date;
  updatedAt: Date;
}
