const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ToggleCommentLikeUseCase = require('../ToggleCommentLikeUseCase');

describe('ToggleCommentLikeUseCase', () => {
  it('should orchestrate the add like action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.verifyLikeExists = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
      threadRepository: mockThreadRepository,
    });

    await toggleCommentLikeUseCase.execute(
      useCasePayload.threadId,
      useCasePayload.commentId,
      useCasePayload.userId,
    );

    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.verifyLikeExists).toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
    expect(mockLikeRepository.addLike).toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
  });

  it('should orchestrate the delete like action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.verifyLikeExists = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockLikeRepository.deleteLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
      threadRepository: mockThreadRepository,
    });

    await toggleCommentLikeUseCase.execute(
      useCasePayload.threadId,
      useCasePayload.commentId,
      useCasePayload.userId,
    );

    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.verifyLikeExists).toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
    expect(mockLikeRepository.deleteLike).toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
  });
});
