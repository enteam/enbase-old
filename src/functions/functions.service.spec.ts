import {Test, TestingModule} from '@nestjs/testing';
import {FunctionsService} from './functions.service';
import {mockgooseProvider} from '../../test/misc';
import {getModelToken} from '@nestjs/mongoose';
import {ProjectSchema} from '../schemas/project.schema';
import {ProjectsService} from '../projects/projects.service';
import {ProjectsController} from '../projects/projects.controller';

describe('FunctionsService', () => {
    let service: FunctionsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [mockgooseProvider, {
                provide: getModelToken('Project'),
                useFactory: async connection => connection.model('Project', ProjectSchema),
                inject: ['DbConnectionToken'],
            }, FunctionsService, ProjectsService],
            controllers: [ProjectsController],
        }).compile();

        service = module.get<FunctionsService>(FunctionsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
