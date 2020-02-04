import {Test, TestingModule} from '@nestjs/testing';
import {ProjectsController} from './projects.controller';
import {mockgooseProvider} from '../../test/misc';
import {getModelToken} from '@nestjs/mongoose';
import {ProjectSchema} from '../schemas/project.schema';
import {FunctionsService} from '../functions/functions.service';
import {ProjectsService} from './projects.service';
import {FunctionsController} from '../functions/functions.controller';

describe('Projects Controller', () => {
    let controller: ProjectsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [mockgooseProvider, {
                provide: getModelToken('Project'),
                useFactory: async connection => connection.model('Project', ProjectSchema),
                inject: ['DbConnectionToken'],
            }, FunctionsService, ProjectsService],
            controllers: [ProjectsController],
        }).compile();

        controller = module.get<ProjectsController>(ProjectsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
