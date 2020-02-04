import * as mongoose from 'mongoose';
import {Mockgoose} from 'mockgoose-fix';

export const mockgooseProvider = {
    provide: 'DbConnectionToken',
    useFactory: async () => {
        (mongoose as any).Promise = global.Promise;
        const mockgoose = new Mockgoose(mongoose);
        mockgoose.helper.setDbVersion('3.4.3');
        mockgoose.prepareStorage().then(async () => {
            await mongoose.connect('mongodb://localhost/testing');
        });
        return mongoose;
    },
};