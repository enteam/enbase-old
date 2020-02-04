import {ApiProperty} from '@nestjs/swagger';

export class UpdateProjectObject {
    @ApiProperty()
    name: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    mongoHost: string;
    @ApiProperty()
    mongoDatabase: string;
}