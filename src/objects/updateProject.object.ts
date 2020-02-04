import {ApiProperty} from '@nestjs/swagger';

export class UpdateProjectObject {
    @ApiProperty()
    description: string;
    @ApiProperty()
    mongoHost: string;
    @ApiProperty()
    mongoDatabase: string;
}