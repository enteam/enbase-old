import * as mongoose from 'mongoose';
import {Mockgoose} from 'mockgoose-fix';

export const mockgooseProvider = {
    provide: 'DbConnectionToken',
    useFactory: async () => {
        (mongoose as any).Promise = global.Promise;
        await mongoose.connect('mongodb://localhost/testing');
        return mongoose;
    },
};