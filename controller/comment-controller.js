import Comment from '../model/comment.js';

export const newComment = async (request, response) => {
    try {
        const newComment = await Comment.create(request.body);
        response.status(201).json({ message: 'Comment saved successfully', comment: newComment });
    } catch (error) {
        response.status(500).json({ error: 'Error while saving a comment', message: error.message });
    }
};

export const getComments = async (request, response) => {
    try {
        const comments = await Comment.find({ postId: request.params.id }).lean();

        response.status(200).json(comments);
    } catch (error) {
        response.status(500).json({ error: 'Error while retrieving comments', message: error.message });
    }
};

export const deleteComment = async (request, response) => {
    try {
        const comment = await Comment.findById(request.params.id);

        if (!comment) {
            return response.status(404).json({ message: 'Comment not found' });
        }

        await Comment.findByIdAndDelete(request.params.id);

        response.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        response.status(500).json({ error: 'Error while deleting a comment', message: error.message });
    }
};
