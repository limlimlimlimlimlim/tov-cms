import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Get,
  Res,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

const options: MulterOptions = {
  storage: diskStorage({
    destination: (req, file, callback) => {
      callback(null, './uploads/');
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
