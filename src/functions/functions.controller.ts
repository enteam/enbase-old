import {All, Controller, Get, Param, Post, Put, Req, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FunctionsService} from './functions.service';
import {FileInterceptor} from '@nestjs/platform-express';
import {ApiConsumes, ApiBody} from '@nestjs/swagger';
import {UploadFileObject} from '../objects/uploadFile.object';
import {ProjectsService} from '../projects/projects.service';

@Controller('')
export class FunctionsController {
    constructor(private readonly functionsService: FunctionsService, private readonly projectsService: ProjectsService) {
    }

    @Post('functions/:id')
    @UseInterceptors(FileInterceptor('zip'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'List of cats',
        type: UploadFileObject,
    })
    async deploy(@Param('id') projectId: string, @UploadedFile() zip: { buffer: Buffer }): Promise<void> {
        const project = await this.projectsService.findById(projectId);
        this.functionsService.deploy(project, zip.buffer);
    }

    @All(':projectName/:functionName')
    async execute(@Param('projectName') projectName: string, @Param('functionName') functionName: string, @Req() req, @Res() res) {
        await this.functionsService.execute(projectName, functionName, req, res);
    }

}
