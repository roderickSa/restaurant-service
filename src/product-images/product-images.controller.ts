import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProductImagesService } from './product-images.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FILES_MAX_COUNT, fileFilter } from 'src/common/helpers/file.helper';
import { ProductImage } from './entities/product-image.entity';
import { RemoveProductImageDtoArr } from './dto/remove-product-image.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Auth(ValidRoles.admin)
@Controller('product-images')
export class ProductImagesController {
  constructor(private readonly productImagesService: ProductImagesService) {}

  @Post('updateimages/:productId')
  @UseInterceptors(
    FilesInterceptor('file', FILES_MAX_COUNT, {
      fileFilter,
    }),
  )
  async updateImages(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ProductImage[]> {
    return this.productImagesService.updateImages(productId, files);
  }

  @Delete('removeImages')
  async removeImages(
    @Body() removeProductImageDtoArr: RemoveProductImageDtoArr,
  ): Promise<void> {
    return this.productImagesService.removeImages(removeProductImageDtoArr);
  }
}
