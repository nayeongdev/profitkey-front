import { Profile } from '@/shared/ui/profile.tsx';
import { formatDate } from './date.ts';
import { HeartIcon, CommentIcon } from '@/shared/ui/icon.tsx';
import { CommentForm } from './comment-form.tsx';
import { useState } from 'react';
import { CommentMenu } from './comment-menu';
import { cn } from '@/shared/lib/utils.ts';
import { Loader2 } from 'lucide-react';
import { Comment } from '../api/schema';
import { useNavigate } from 'react-router';
import { commentMutation } from '../api/query.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type User } from '@/shared/api';

type CommentBaseProps = {
  stockCode: string;
  comment: Comment;
  user?: User;
  isReply?: boolean;
  onEdit?: (id: string | undefined, newContent: string) => void;
  onDelete?: (id: string) => void;
  onAddReply?: (content: string) => void;
  replies?: Comment[];
  onReplyEdit?: (id: string | undefined, newContent: string) => void;
  onReplyDelete?: (id: string) => void;
  hasMoreReplies?: boolean;
  isFetchingMoreReplies?: boolean;
  onLoadMoreReplies?: () => void;
};

export function CommentBase({
  stockCode,
  comment,
  user,
  isReply = false,
  onEdit,
  onDelete,
  onAddReply,
  replies = [],
  onReplyEdit,
  onReplyDelete,
  hasMoreReplies,
  isFetchingMoreReplies,
  onLoadMoreReplies,
}: CommentBaseProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 상태 관리
  const [isReplyVisible, setIsReplyVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);

  const postLiked = useMutation({
    ...commentMutation.like,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['community', 'all', 'lists', { stockCode }],
      });
      queryClient.invalidateQueries({
        queryKey: ['community', 'all', 'replies'],
      });
    },
  });

  const handleFormClick = () => {
    if (!user) {
      if (confirm('로그인이 필요한 서비스입니다. 로그인 하시겠습니까?')) {
        navigate('/login');
      }
    }
  };

  const handleLikeButton = () => {
    if (!user) {
      if (confirm('로그인이 필요한 서비스입니다. 로그인 하시겠습니까?')) {
        navigate('/login');
      }
      return;
    }

    postLiked.mutate({
      commentId: comment.id,
      userId: user.userId,
      liked: !comment.liked,
    });
  };

  // 댓글 수정 제출
  const handleEditSubmit = (newContent: string): void => {
    setContent(newContent);
    setIsEditing(false);
    onEdit?.(comment.id, newContent);
  };

  // 수정 시작
  const handleStartEdit = (): void => {
    setIsEditing(true);
  };

  // 삭제 처리
  const handleDelete = (): void => {
    onDelete?.(comment.id);
  };

  // 수정 취소
  const cancelEdit = (): void => {
    setIsEditing(false);
    setContent(comment.content);
  };

  const renderContent = () => (
    <>
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <CommentForm
            initialValue={content}
            rows={3}
            placeholder="댓글을 수정하세요"
            onSubmit={handleEditSubmit}
            onCancel={cancelEdit}
          />
        </div>
      ) : (
        <>
          <div
            className={cn(
              'min-h-[50px] w-full rounded-[5px] bg-[#FFB40033] p-4',
              isReply ? '' : 'break-words'
            )}
          >
            {isReply ? <p>{content}</p> : content}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex">
              <button onClick={handleLikeButton} className="flex gap-2 p-2">
                <HeartIcon
                  className={cn(
                    'fill-neutral-300 hover:fill-[#D94F70]',
                    comment.liked ? 'fill-[#D94F70]' : ''
                  )}
                />
                <span>{comment.likeCount ? comment.likeCount : null}</span>
              </button>
              {!isReply && (
                <button
                  onClick={() => setIsReplyVisible(!isReplyVisible)}
                  className="flex gap-2 p-2"
                >
                  <CommentIcon className="fill-neutral-300" />
                  <span>
                    {comment.replieCount ? comment.replieCount : null}
                  </span>
                </button>
              )}
            </div>
            {user?.userId === comment.writerId && (
              <CommentMenu onEdit={handleStartEdit} onDelete={handleDelete} />
            )}
          </div>
        </>
      )}
    </>
  );

  // 대댓글 영역 렌더링
  const renderReplies = () => {
    if (isReply || !onAddReply) return null;

    return (
      isReplyVisible && (
        <div className="flex flex-col gap-5 ps-16">
          {replies && (
            <div className="replies-list flex flex-col gap-5 pb-1 pr-1">
              {replies.map((reply) => (
                <CommentBase
                  key={reply.id}
                  stockCode={stockCode}
                  user={user}
                  comment={reply}
                  isReply={true}
                  onEdit={onReplyEdit}
                  onDelete={onReplyDelete}
                />
              ))}
              {hasMoreReplies && isFetchingMoreReplies && (
                <div className="my-4 text-center text-gray-500">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                </div>
              )}
              {hasMoreReplies && (
                <button
                  onClick={onLoadMoreReplies}
                  className="text-center text-sm text-gray-500 hover:text-gray-700"
                  disabled={isFetchingMoreReplies}
                >
                  댓글 더보기
                </button>
              )}
            </div>
          )}
          <div className="flex items-center justify-center gap-4">
            <Profile imgUrl={user?.profileImage} orientation="horizontal" />
            <div className="grow">
              <CommentForm
                rows={1}
                placeholder={
                  user ? `댓글을 남겨보세요` : '로그인 후 댓글을 작성해보세요'
                }
                onSubmit={(content) => {
                  if (!user) return;
                  onAddReply?.(content);
                }}
                onClick={handleFormClick}
                disabled={!user}
              />
            </div>
          </div>
        </div>
      )
    );
  };

  return (
    <>
      {isReply ? (
        <div className="flex flex-col gap-[10px]">
          <div className="flex items-center gap-[10px]">
            <Profile
              username={comment.writerNickname}
              imgUrl={comment.writerImageUrl}
              orientation="horizontal"
            />
            {formatDate(comment.createdAt)}
          </div>
          <div
            className={cn(
              'ps-16',
              isReply
                ? 'relative before:absolute before:left-6 before:top-1 before:h-full before:w-[1px] before:bg-neutral-500'
                : ''
            )}
          >
            {renderContent()}
          </div>
        </div>
      ) : (
        <li className="flex flex-col gap-5">
          <div className="flex flex-col gap-[10px]">
            <div className="flex items-center gap-[10px]">
              <Profile
                username={comment.writerNickname}
                imgUrl={comment.writerImageUrl}
                orientation="horizontal"
              />
              {formatDate(comment.createdAt)}
            </div>
            <div
              className={cn(
                'ps-16',
                isReply
                  ? 'relative before:absolute before:left-5 before:top-1 before:h-full before:w-[1px] before:bg-neutral-500'
                  : ''
              )}
            >
              {renderContent()}
            </div>
          </div>
          {renderReplies()}
        </li>
      )}
    </>
  );
}
