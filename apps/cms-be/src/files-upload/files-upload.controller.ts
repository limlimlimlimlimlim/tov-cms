import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs'; // fs 모듈 추가

const options: MulterOptions = {
  storage: diskStorage({
    destination: (req, file, callback) => {
      const uploadDirectory = './files/upload/'; // 업로드 폴더 경로

      if (!fs.existsSync(uploadDirectory)) {
        fs.mkdirSync(uploadDirectory, { recursive: true });
      }
      callback(null, uploadDirectory);
    },
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + uuidv4();
      const fileExtension = file.originalname.split('.').pop();
      const finalName = `${uniqueSuffix}.${fileExtension}`;
      callback(null, finalName);
    },
  }),
};

@Controller('files')
export class FileUploadController {
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file', options))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('::::::::::::::');
    if (!file) {
      throw new HttpException('File upload failed', HttpStatus.BAD_REQUEST);
    }
    try {
      return { fileName: file.filename };
    } catch (error) {
      throw new HttpException(
        'File processing failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
