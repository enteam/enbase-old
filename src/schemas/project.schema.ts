import * as mongoose from 'mongoose';

export const ProjectSchema = new mongoose.Schema({
    name: String,
    description: String,
    mongoHost: String,
    mongoDatabase: String,
    functionsCodePath: String,
});
