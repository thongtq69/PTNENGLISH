import mongoose, { Schema, Document } from 'mongoose';

export interface IPage extends Document {
    title: string;
    slug: string;
    sections: any[];
    content?: any;
    lastModified: Date;
}

const PageSchema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sections: { type: [Schema.Types.Mixed], default: [] },
    content: { type: Schema.Types.Mixed },
    lastModified: { type: Date, default: Date.now }
});

export default mongoose.models.Page || mongoose.model<IPage>('Page', PageSchema);
