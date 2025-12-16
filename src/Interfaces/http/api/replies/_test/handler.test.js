const RepliesHandler = require('../handler');
const AddReplyUseCase = require('../../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../../Applications/use_case/DeleteReplyUseCase');

describe('RepliesHandler', () => {
  describe('postReplyHandler', () => {
    it('should return 201 and added reply', async () => {
      const requestPayload = {
        content: 'sebuah reply',
      };
      const mockAddedReply = {
        id: 'reply-123',
        content: 'sebuah reply',
        owner: 'user-123',
      };
      const mockAddReplyUseCase = new AddReplyUseCase({});
      mockAddReplyUseCase.execute = jest.fn()
        .mockImplementation(() => Promise.resolve(mockAddedReply));

      const mockContainer = {
        getInstance: jest.fn().mockReturnValue(mockAddReplyUseCase),
      };

      const repliesHandler = new RepliesHandler(mockContainer);

      const mockRequest = {
        payload: requestPayload,
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

      const mockH = {
        response: jest.fn(() => ({
          code: jest.fn(),
        })),
      };

      await repliesHandler.postReplyHandler(mockRequest, mockH);

      expect(mockAddReplyUseCase.execute).toBeCalledWith({
        content: 'sebuah reply',
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });
      expect(mockH.response).toBeCalledWith({
        status: 'success',
        data: {
          addedReply: mockAddedReply,
        },
      });
    });
  });

  describe('deleteReplyHandler', () => {
    it('should return success status', async () => {
      const mockDeleteReplyUseCase = new DeleteReplyUseCase({});
      mockDeleteReplyUseCase.execute = jest.fn()
        .mockImplementation(() => Promise.resolve());

      const mockContainer = {
        getInstance: jest.fn().mockReturnValue(mockDeleteReplyUseCase),
      };

      const repliesHandler = new RepliesHandler(mockContainer);

      const mockRequest = {
        params: {
          threadId: 'thread-123',
          commentId: 'comment-123',
          replyId: 'reply-123',
        },
        auth: {
          credentials: {
            id: 'user-123',
          },
        },
      };

      const response = await repliesHandler.deleteReplyHandler(mockRequest);

      expect(mockDeleteReplyUseCase.execute).toBeCalledWith({
        threadId: 'thread-123',
        commentId: 'comment-123',
        replyId: 'reply-123',
        owner: 'user-123',
      });
      expect(response).toEqual({
        status: 'success',
      });
    });
  });
});