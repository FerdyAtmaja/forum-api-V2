const AuthenticationsHandler = require('../handler');
const LoginUserUseCase = require('../../../../../Applications/use_case/LoginUserUseCase');
const RefreshAuthenticationUseCase = require('../../../../../Applications/use_case/RefreshAuthenticationUseCase');
const LogoutUserUseCase = require('../../../../../Applications/use_case/LogoutUserUseCase');

describe('AuthenticationsHandler', () => {
  describe('postAuthenticationHandler', () => {
    it('should return 201 and authentication tokens', async () => {
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const mockAuthentication = {
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      };
      const mockLoginUserUseCase = new LoginUserUseCase({});
      mockLoginUserUseCase.execute = jest.fn()
        .mockImplementation(() => Promise.resolve(mockAuthentication));

      const mockContainer = {
        getInstance: jest.fn().mockReturnValue(mockLoginUserUseCase),
      };

      const authenticationsHandler = new AuthenticationsHandler(mockContainer);

      const mockRequest = {
        payload: requestPayload,
      };

      const mockH = {
        response: jest.fn(() => ({
          code: jest.fn(),
        })),
      };

      await authenticationsHandler.postAuthenticationHandler(mockRequest, mockH);

      expect(mockLoginUserUseCase.execute).toBeCalledWith(requestPayload);
      expect(mockH.response).toBeCalledWith({
        status: 'success',
        data: {
          accessToken: 'access_token',
          refreshToken: 'refresh_token',
        },
      });
    });
  });

  describe('putAuthenticationHandler', () => {
    it('should return 200 and new access token', async () => {
      const requestPayload = {
        refreshToken: 'refresh_token',
      };
      const mockAccessToken = 'new_access_token';
      const mockRefreshAuthenticationUseCase = new RefreshAuthenticationUseCase({});
      mockRefreshAuthenticationUseCase.execute = jest.fn()
        .mockImplementation(() => Promise.resolve(mockAccessToken));

      const mockContainer = {
        getInstance: jest.fn().mockReturnValue(mockRefreshAuthenticationUseCase),
      };

      const authenticationsHandler = new AuthenticationsHandler(mockContainer);

      const mockRequest = {
        payload: requestPayload,
      };

      const response = await authenticationsHandler.putAuthenticationHandler(mockRequest);

      expect(mockRefreshAuthenticationUseCase.execute).toBeCalledWith(requestPayload);
      expect(response).toEqual({
        status: 'success',
        data: {
          accessToken: mockAccessToken,
        },
      });
    });
  });

  describe('deleteAuthenticationHandler', () => {
    it('should return success status', async () => {
      const requestPayload = {
        refreshToken: 'refresh_token',
      };
      const mockLogoutUserUseCase = new LogoutUserUseCase({});
      mockLogoutUserUseCase.execute = jest.fn()
        .mockImplementation(() => Promise.resolve());

      const mockContainer = {
        getInstance: jest.fn().mockReturnValue(mockLogoutUserUseCase),
      };

      const authenticationsHandler = new AuthenticationsHandler(mockContainer);

      const mockRequest = {
        payload: requestPayload,
      };

      const response = await authenticationsHandler.deleteAuthenticationHandler(mockRequest);

      expect(mockLogoutUserUseCase.execute).toBeCalledWith(requestPayload);
      expect(response).toEqual({
        status: 'success',
      });
    });
  });
});
