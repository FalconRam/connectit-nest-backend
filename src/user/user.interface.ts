import { Document } from 'mongoose';

export interface User extends Document {
  readonly _id: string;
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly bio: string;
  readonly profilePicture: string;
  readonly profileBgWallPicture: string;
  readonly createdAt: Date;
  readonly followers: string[];
  readonly following: string[];
  readonly city: string;
  readonly country: string;
}
