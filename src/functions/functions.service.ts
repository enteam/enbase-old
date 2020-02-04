import {Injectable, Logger} from '@nestjs/common';
import {Deployment} from '../interfaces/deployment.interface';
import {Project} from '../interfaces/project.interface';
import {existsSync, mkdirSync, symlinkSync, writeFileSync} from 'fs';
import {join} from 'path';
import * as Zip from 'adm-zip';
import * as util from 'util';
import {exec} from 'child_process';
import * as lnk from 'lnk';

const run = util.promisify(exec);

@Injectable()
export class FunctionsService {

    private readonly logger = new Logger(FunctionsService.name);

    async deploy(project: Project, code: Buffer): Promise<Deployment> {
        const deployedAt = (new Date()).getTime();
        this.logger.log(`Deploying ${project.name}`);
        await this.ensureDirectoryExists(join(process.cwd(), 'functions'));
        await this.ensureDirectoryExists(join(process.cwd(), 'functions', 'archives'));
        await this.ensureDirectoryExists(join(process.cwd(), 'functions', 'code'));
        const zipPath = join(process.cwd(), 'functions', 'archives', project.name + '_' + deployedAt + '.zip');
        const codePath = join(process.cwd(), 'functions', 'code', project.name + '_' + deployedAt);
        await this.save(code, zipPath);
        await this.extract(zipPath, codePath);
        await this.install(codePath, project);
        project.functionsCodePath = codePath;
        await project.save();
        return {
            project,
            deployedAt,
        };
    }

    async save(buffer: Buffer, path: string) {
        writeFileSync(path, buffer);
    }

    async extract(source: string, target: string) {
        const zip = new Zip(source);
        zip.extractAllTo(target, true);
    }

    async install(cwd: string, project: Project) {
        this.logger.log('Installing dependencies with yarn');
        const {stdout, stderr} = await run('yarn', {cwd});
        this.logger.log(stdout);
        this.logger.error(stderr);
        this.logger.log(`Finished installation of deployment of ${project.name}`);
    }

    async ensureDirectoryExists(path: string) {
        if (!existsSync(path)) {
            mkdirSync(path);
        }
    }

}
