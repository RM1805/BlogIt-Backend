import Post from '../model/post.js';

export const createPost = async (request, response) => {
    try {
        await Post.create(request.body);

        response.status(200).json('Post saved successfully');
    } catch (error) {
        response.status(500).json(error);
    }
};

export const updatePost = async (request, response) => {
    try {
        const post = await Post.findOneAndUpdate(
            { _id: request.params.id },
            { $set: request.body }
        );

        if (!post) {
            return response.status(404).json({ msg: 'Post not found' });
        }

        response.status(200).json('Post updated successfully');
    } catch (error) {
        response.status(500).json(error);
    }
};

export const deletePost = async (request, response) => {
    try {
        const post = await Post.findByIdAndDelete(request.params.id);

        response.status(200).json('Post deleted successfully');
    } catch (error) {
        response.status(500).json(error);
    }
};

export const getPost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id).lean();

        response.status(200).json(post);
    } catch (error) {
        response.status(500).json(error);
    }
};

export const getAllPosts = async (request, response) => {
    let username = request.query.username;
    let category = request.query.category;
    try {
        let posts;
        if (username) {
            posts = await Post.find({ username: username }).lean();
        } else if (category) {
            posts = await Post.find({ categories: category }).lean();
        } else {
            posts = await Post.find({}).lean();
        }

        response.status(200).json(posts);
    } catch (error) {
        response.status(500).json(error);
    }
};
