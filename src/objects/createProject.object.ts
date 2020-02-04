import {IsNotEmpty} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class CreateProjectObject {
    @IsNotEmpty()
    @ApiProperty()
    name: string;
    @ApiProperty()
    description: string;
    @IsNotEmpty()
    @ApiProperty()
    mongoHost: string;
    @IsNotEmpty()
    @ApiProperty()
    mongoDatabase: string;
}