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
        const post = await Post.findByIdAndUpdate(request.params.id, request.body);

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
        await Post.findByIdAndDelete(request.params.id);

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
    const { username, category } = request.query;

    const query = {};
    if (username) query.username = username;
    if (category) query.categories = category;

    try {
        const posts = await Post.find(query).lean().select('-content');

        response.status(200).json(posts);
    } catch (error) {
        response.status(500).json(error);
    }
};
