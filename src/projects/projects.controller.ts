import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {ProjectsService} from './projects.service';
import {Project} from '../interfaces/project.interface';
import {CreateProjectObject} from '../objects/createProject.object';
import {UpdateProjectObject} from '../objects/updateProject.object';
import {ApiBody} from '@nestjs/swagger';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {
    }

    @Get()
    async index(): Promise<Project[]> {
        return await this.projectsService.index();
    }

    @Post()
    @ApiBody({type: CreateProjectObject})
    async create(@Body() createProjectObject: CreateProjectObject): Promise<Project> {
        return await this.projectsService.create(createProjectObject);
    }

    @Put(':id')
    @ApiBody({type: UpdateProjectObject})
    async edit(@Param('id') id: string, @Body() updateProjectObject: UpdateProjectObject): Promise<Project> {
        return await this.projectsService.edit(id, updateProjectObject);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return await this.projectsService.remove(id);
    }
}
