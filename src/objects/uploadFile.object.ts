import {ApiProperty} from '@nestjs/swagger';

export class UploadFileObject {
    @ApiProperty({type: 'string', format: 'binary'})
    zip: any;
}
