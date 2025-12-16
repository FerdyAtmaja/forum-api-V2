const CommentsHandler = require('../handler');
const AddCommentUseCase = require('../../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../../Applications/use_case/DeleteCommentUseCase');

describe('CommentsHandler', () => {
  describe('postCommentHandler', () => {
    it('should return 201 and added comment', async () => {
      const requestPayload = {
        content: 'sebuah comment',
      };
      const mockAddedComment = {
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
      };
      const mockAddCommentUseCase = new AddCommentUseCase({});
      mockAddCommentUseCase.execute = jest.fn()
        .mockImplementation(() => Promise.resolve(mockAddedComment));

      const mockContainer = {
        getInstance: jest.fn().mockReturnValue(mockAddCommentUseCase),
      };

      const commentsHandler = new CommentsHandler(mockContainer);

      const mockRequest = {
        payload: requestPayload,
        params: {
          threadId: 'thread-123',
        },
        auth: {
          credentials: {
            id: 'user-123',
          },
        },
      };

      const mockH = {
        response: jest.fn(() => ({
          code: jest.fn(),
        })),
      };

      await commentsHandler.postCommentHandler(mockRequest, mockH);

      expect(mockAddCommentUseCase.execute).toBeCalledWith(requestPayload, 'thread-123', 'user-123');
      expect(mockH.response).toBeCalledWith({
        status: 'success',
        data: {
          addedComment: mockAddedComment,
        },
      });
    });
  });

  describe('deleteCommentHandler', () => {
    it('should return success status', async () => {
      const mockDeleteCommentUseCase = new DeleteCommentUseCase({});
      mockDeleteCommentUseCase.execute = jest.fn()
        .mockImplementation(() => Promise.resolve());

      const mockContainer = {
        getInstance: jest.fn().mockReturnValue(mockDeleteCommentUseCase),
      };

      const commentsHandler = new CommentsHandler(mockContainer);

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

      const response = await commentsHandler.deleteCommentHandler(mockRequest);

      expect(mockDeleteCommentUseCase.execute).toBeCalledWith('thread-123', 'comment-123', 'user-123');
      expect(response).toEqual({
        status: 'success',
      });
    });
  });
});