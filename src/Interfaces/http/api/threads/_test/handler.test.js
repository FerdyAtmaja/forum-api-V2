const ThreadsHandler = require('../handler');
const AddThreadUseCase = require('../../../../../Applications/use_case/AddThreadUseCase');
const GetThreadUseCase = require('../../../../../Applications/use_case/GetThreadUseCase');

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


});
