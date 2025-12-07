const ThreadsHandler = require('../handler');
const AddThreadUseCase = require('../../../../../Applications/use_case/AddThreadUseCase');
const GetThreadUseCase = require('../../../../../Applications/use_case/GetThreadUseCase');
const AddCommentUseCase = require('../../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../../Applications/use_case/DeleteCommentUseCase');
const AddReplyUseCase = require('../../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../../Applications/use_case/DeleteReplyUseCase');
const ToggleCommentLikeUseCase = require('../../../../../Applications/use_case/ToggleCommentLikeUseCase');

describe('ThreadsHandler', () => {
  describe('postThreadHandler', () => {
    it('should return 201 and added thread', async () => {
      const requestPayload = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };
      const mockAddedThread = {
        id: 'thread-123',
        title: 'sebuah thread',
        owner: 'user-123',
      };
      const mockAddThreadUseCase = new AddThreadUseCase({});
      mockAddThreadUseCase.execute = jest.fn()
        .mockImplementation(() => Promise.resolve(mockAddedThread));

      const mockContainer = {
        getInstance: jest.fn().mockReturnValue(mockAddThreadUseCase),
      };

      const threadsHandler = new ThreadsHandler(mockContainer);

      const mockRequest = {
        payload: requestPayload,
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

      await threadsHandler.postThreadHandler(mockRequest, mockH);

      expect(mockAddThreadUseCase.execute).toBeCalledWith(requestPayload, 'user-123');
      expect(mockH.response).toBeCalledWith({
        status: 'success',
        data: {
          addedThread: mockAddedThread,
        },
      });
    });
  });

  describe('getThreadHandler', () => {
    it('should return thread details', async () => {
      const mockThread = {
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
        comments: [],
      };
      const mockGetThreadUseCase = new GetThreadUseCase({});
      mockGetThreadUseCase.execute = jest.fn()
        .mockImplementation(() => Promise.resolve(mockThread));

      const mockContainer = {
        getInstance: jest.fn().mockReturnValue(mockGetThreadUseCase),
      };

      const threadsHandler = new ThreadsHandler(mockContainer);

      const mockRequest = {
        params: {
          threadId: 'thread-123',
        },
      };

      const response = await threadsHandler.getThreadHandler(mockRequest);

      expect(mockGetThreadUseCase.execute).toBeCalledWith('thread-123');
      expect(response).toEqual({
        status: 'success',
        data: {
          thread: mockThread,
        },
      });
    });
  });

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

      const threadsHandler = new ThreadsHandler(mockContainer);

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

      await threadsHandler.postCommentHandler(mockRequest, mockH);

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

      const threadsHandler = new ThreadsHandler(mockContainer);

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

      const response = await threadsHandler.deleteCommentHandler(mockRequest);

      expect(mockDeleteCommentUseCase.execute).toBeCalledWith('thread-123', 'comment-123', 'user-123');
      expect(response).toEqual({
        status: 'success',
      });
    });
  });

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

      const threadsHandler = new ThreadsHandler(mockContainer);

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

      await threadsHandler.postReplyHandler(mockRequest, mockH);

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

      const threadsHandler = new ThreadsHandler(mockContainer);

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

      const response = await threadsHandler.deleteReplyHandler(mockRequest);

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

  describe('putCommentLikeHandler', () => {
    it('should return success status', async () => {
      const mockToggleCommentLikeUseCase = new ToggleCommentLikeUseCase({});
      mockToggleCommentLikeUseCase.execute = jest.fn()
        .mockImplementation(() => Promise.resolve());

      const mockContainer = {
        getInstance: jest.fn().mockReturnValue(mockToggleCommentLikeUseCase),
      };

      const threadsHandler = new ThreadsHandler(mockContainer);

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

      const response = await threadsHandler.putCommentLikeHandler(mockRequest);

      expect(mockToggleCommentLikeUseCase.execute).toBeCalledWith('thread-123', 'comment-123', 'user-123');
      expect(response).toEqual({
        status: 'success',
      });
    });
  });
});
