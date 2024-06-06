import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const replyCommentSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid(10),
  },
  replierId: { type: String },
  replierName: { type: String },
  reply: { type: String },
  replyLikes: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const postCommentSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid(10),
  },
  commenterId: { type: String },
  commenterName: { type: String },
  comment: { type: String },
  commentLikes: [String],
  replyComments: [replyCommentSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const postMessageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    name: { type: String, required: true },
    creator: { type: String, required: true },
    tags: [String],
    selectedFile: { type: String, default: '' },
    likes: {
      type: [String],
      default: [],
    },
    comments: {
      type: [String],
      default: [],
    },
    commentsInfo: {
      postComment: [postCommentSchema],
    },
  },
  { timestamps: true },
);

const savedUserPostsSchema = new mongoose.Schema(
  {
    userId: { type: String, ref: 'User', required: true },
    savedPosts: { type: [String], default: [] },
  },
  { timestamps: true },
);

export { postMessageSchema, savedUserPostsSchema };
