import type { Comment } from '@/types';

export interface CommentItemProps {
    comment: Comment;
    onEdit?: (comment: Comment) => void;
    onDelete?: (commentId: string) => void;
    isOwner?: boolean;
}
