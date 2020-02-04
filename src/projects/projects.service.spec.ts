import {Test, TestingModule} from '@nestjs/testing';
import {ProjectsService} from './projects.service';
import {mockgooseProvider} from '../../test/misc';
import {getModelToken} from '@nestjs/mongoose';
import {ProjectSchema} from '../schemas/project.schema';
import {FunctionsService} from '../functions/functions.service';
import {FunctionsController} from '../functions/functions.controller';

describe('ProjectsService', () => {
    let service: ProjectsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [mockgooseProvider, {
                provide: getModelToken('Project'),
                useFactory: async connection => connection.model('Project', ProjectSchema),
                inject: ['DbConnectionToken'],
            }, FunctionsService, ProjectsService],
            controllers: [FunctionsController],
        }).compile();

        service = module.get<ProjectsService>(ProjectsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
