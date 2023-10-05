import Post from '../model/post.js';

export const createPost = async (request, response) => {
    try {
        const newPost = await Post.create(request.body);
        response.status(201).json({ message: 'Post saved successfully', post: newPost });
    } catch (error) {
        response.status(500).json({ error: 'Error while creating a post', message: error.message });
    }
};

export const updatePost = async (request, response) => {
    try {
        const post = await Post.findByIdAndUpdate(request.params.id, request.body);

        if (!post) {
            return response.status(404).json({ message: 'Post not found' });
        }

        response.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        response.status(500).json({ error: 'Error while updating a post', message: error.message });
    }
};

export const deletePost = async (request, response) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(request.params.id);

        if (!deletedPost) {
            return response.status(404).json({ message: 'Post not found' });
        }

        response.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        response.status(500).json({ error: 'Error while deleting a post', message: error.message });
    }
};

export const getPost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id).lean();

        if (!post) {
            return response.status(404).json({ message: 'Post not found' });
        }

        response.status(200).json(post);
    } catch (error) {
        response.status(500).json({ error: 'Error while retrieving a post', message: error.message });
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
        response.status(500).json({ error: 'Error while retrieving posts', message: error.message });
    }
};
