import {Project} from './project.interface';

export interface Deployment {
    project: Project;
    deployedAt: number;
}