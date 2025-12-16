const LikesHandler = require('../handler');
const ToggleCommentLikeUseCase = require('../../../../../Applications/use_case/ToggleCommentLikeUseCase');

describe('LikesHandler', () => {
  describe('putCommentLikeHandler', () => {
    it('should return success status', async () => {
      const mockToggleCommentLikeUseCase = new ToggleCommentLikeUseCase({});
      mockToggleCommentLikeUseCase.execute = jest.fn()
        .mockImplementation(() => Promise.resolve());

      const mockContainer = {
        getInstance: jest.fn().mockReturnValue(mockToggleCommentLikeUseCase),
      };

      const likesHandler = new LikesHandler(mockContainer);

      const mockRequest = {
        params: {
          threadId: 'thread-123',
          commentId: 'comment-123',
        },
        auth: {
          credentials: {
            id: 'user-123',
          },
        },
      };

      const response = await likesHandler.putCommentLikeHandler(mockRequest);

      expect(mockToggleCommentLikeUseCase.execute).toBeCalledWith('thread-123', 'comment-123', 'user-123');
      expect(response).toEqual({
        status: 'success',
      });
    });
  });
});