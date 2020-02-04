import {Injectable} from '@nestjs/common';
import {Project} from '../interfaces/project.interface';
import {InjectModel} from '@nestjs/mongoose';
import {Model, Types} from 'mongoose';
import {CreateProjectObject} from '../objects/createProject.object';
import {UpdateProjectObject} from '../objects/updateProject.object';

@Injectable()
export class ProjectsService {
    constructor(@InjectModel('Project') private readonly projectModel: Model<Project>) {
    }

    async create(createProjectObject: CreateProjectObject): Promise<Project> {
        const project = new this.projectModel(createProjectObject);
        return project.save();
    }

    async index(): Promise<Project[]> {
        return this.projectModel.find().exec();
    }

    async findById(id: string): Promise<Project> {
        return this.projectModel.findOne({_id: Types.ObjectId(id)}).exec();
    }

    async edit(id: string, updateProjectObject: UpdateProjectObject): Promise<Project> {
        await this.projectModel.updateOne({_id: Types.ObjectId(id)}, {$set: updateProjectObject});
        return this.projectModel.findOne({_id: Types.ObjectId(id)}).exec();
    }

    async remove(id: string): Promise<void> {
        await this.projectModel.deleteOne({_id: Types.ObjectId(id)});
    }

}
