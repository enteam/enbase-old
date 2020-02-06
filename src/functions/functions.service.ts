import {Injectable, Logger} from '@nestjs/common';
import {Deployment} from '../interfaces/deployment.interface';
import {Project} from '../interfaces/project.interface';
import {existsSync, mkdirSync, symlinkSync, writeFileSync} from 'fs';
import {join} from 'path';
import * as Zip from 'adm-zip';
import * as util from 'util';
import {exec} from 'child_process';
import {ProjectsService} from '../projects/projects.service';

const run = util.promisify(exec);

@Injectable()
export class FunctionsService {

    constructor(private readonly projectsService: ProjectsService) {
    }

    async onModuleInit() {
        await this.loadAll();
    }

    private readonly logger = new Logger(FunctionsService.name);
    private functions: { [projectName: string]: { [functionName: string]: { type: string, handler: any } } } = {};

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
        await this.load(project);
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

    async loadAll() {
        for (const project of await this.projectsService.index()) {
            this.load(project);
        }
    }

    async load(project: Project) {
        const self = this;
        // @ts-ignore
        global.enbase = {
            functions: {
                onRequest(handler: any) {
                    return {
                        type: 'http',
                        handler,
                    };
                },
            },
        };
        if (project.functionsCodePath != null) {
            const mod = require(join(project.functionsCodePath, 'index.js'));
            if (self.functions[project.name] == null) {
                self.functions[project.name] = {};
            }
            for (const [k, v] of Object.entries(mod)) {
                self.functions[project.name][k] = v as { type: 'string', handler: any };
                this.logger.log(`[${project.name}] Loaded function: ${k}`);
            }
        }
    }

    async execute(projectName: string, functionName: string, request: any, response: any): Promise<any> {
        const func = this.functions[projectName][functionName];
        if (func.type === 'http') {
            func.handler(request, response);
        }
        return null;
    }

}
