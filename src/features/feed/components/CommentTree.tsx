import React from 'react';
import type { Comment } from '../../../types/PostTypes';
import CommentNode from './CommentNode';

interface CommentTreeProps {
    comments: Comment[];
    onAddReply: (parentId: string, content: string) => void;
}

const CommentTree: React.FC<CommentTreeProps> = ({ comments, onAddReply }) => {
    if (!comments || comments.length === 0) {
        return (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                No comments yet. Be the first to share your thoughts!
            </div>
        );
    }

    return (
        <div className="comment-tree">
            {comments.map(comment => (
                <CommentNode
                    key={comment.id}
                    comment={comment}
                    depth={0}
                    onReply={onAddReply}
                />
            ))}
        </div>
    );
};

export default CommentTree;
