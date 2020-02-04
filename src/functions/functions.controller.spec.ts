import {Test, TestingModule} from '@nestjs/testing';
import {FunctionsController} from './functions.controller';
import {FunctionsService} from './functions.service';
import {ProjectsService} from '../projects/projects.service';
import {getModelToken} from '@nestjs/mongoose';
import {ProjectSchema} from '../schemas/project.schema';
import {mockgooseProvider} from '../../test/misc';

describe('Functions Controller', () => {
    let controller: FunctionsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [mockgooseProvider, {
                provide: getModelToken('Project'),
                useFactory: async connection => connection.model('Project', ProjectSchema),
                inject: ['DbConnectionToken'],
            }, FunctionsService, ProjectsService],
            controllers: [FunctionsController],
        }).compile();

        controller = module.get<FunctionsController>(FunctionsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
