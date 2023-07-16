import { Type } from 'class-transformer';
import { IsArray, IsUUID, ValidateNested } from 'class-validator';

class RemoveProductImageDto {
  @IsUUID()
  productImageId: string;
}

export class RemoveProductImageDtoArr {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RemoveProductImageDto)
  objects: RemoveProductImageDto[];
}
