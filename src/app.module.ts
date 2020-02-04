import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import {ProjectSchema} from './schemas/project.schema';
import {ProjectsService} from './projects/projects.service';
import {ProjectsController} from './projects/projects.controller';
import { FunctionsService } from './functions/functions.service';
import { FunctionsController } from './functions/functions.controller';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGO_URI),
        MongooseModule.forFeature([{name: 'Project', schema: ProjectSchema}])],
    controllers: [AppController, ProjectsController, FunctionsController],
    providers: [AppService, ProjectsService, FunctionsService],
})
export class AppModule {
}
