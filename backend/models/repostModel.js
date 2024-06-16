import mongoose from 'mongoose';

const repostSchema = mongoose.Schema(
    {
        postedBy: {
            type: mongoose.Schema.Types.ObjectId, //id of user that repost
            ref: 'User',
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId, //id of post which is reposted
            ref: 'Post',
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const Repost = mongoose.model('Repost', repostSchema);

export default Repost;
