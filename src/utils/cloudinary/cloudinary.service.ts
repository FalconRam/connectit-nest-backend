import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  getFolderName(folderName: string) {
    switch (folderName) {
      case 'Posts':
        return process.env.CONNECTIT_POSTS;
      case 'ProfilePicture':
        return process.env.CONNECTIT_PROFILEPICTURE;
      case 'BgWallPicture':
        return process.env.CONNECTIT_PROFILEBGWALLPICTURE;
      default:
        throw new Error('Folder not exits');
    }
  }
  async convertImgToCloudURL(
    imgBase64: string,
    public_id: string,
    folderName: string,
  ): Promise<UploadApiResponse> {
    try {
      let folder = this.getFolderName(folderName);

      // Cloudinary Configuration
      cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECERT,
      });

      // Upload Image
      const cloudinaryResp = await cloudinary.uploader.upload(imgBase64, {
        public_id,
        folder,
      });
      return cloudinaryResp;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
