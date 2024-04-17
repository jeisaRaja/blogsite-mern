import mongoose, { Schema, Types } from "mongoose";

interface Activity {
    total_likes: number;
    total_comments: number;
    total_reads: number;
    total_parent_comments: number;
}

interface BlogDocument extends Document {
    blog_id: string;
    title: string;
    banner?: string | null;
    des?: string | null;
    content?: string | null;
    tags?: string[];
    author: Types.ObjectId;
    activity?: Activity;
    comments?: Types.ObjectId[];
    draft: boolean;
    publishedAt: Date;
    updatedAt: Date;
}

const blogSchema = new mongoose.Schema({

    blog_id: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    banner: {
        type: String,
        // required: true,
    },
    des: {
        type: String,
        maxlength: 200,
        // required: true
    },
    content: {
        type: String,
        // required: true
    },
    tags: {
        type: [String],
        // required: true
    },
    author: {
        type: Types.ObjectId,
        required: true,
        ref: 'users'
    },
    activity: {
        total_likes: {
            type: Number,
            default: 0
        },
        total_comments: {
            type: Number,
            default: 0
        },
        total_reads: {
            type: Number,
            default: 0
        },
        total_parent_comments: {
            type: Number,
            default: 0
        },
    },
    comments: {
        type: [Types.ObjectId],
        ref: 'comments'
    },
    draft: {
        type: Boolean,
        default: false
    }

},
    {
        timestamps: {
            createdAt: 'publishedAt',
            updatedAt: 'updatedAt'
        }

    })

export default mongoose.model<BlogDocument>("blogs", blogSchema);