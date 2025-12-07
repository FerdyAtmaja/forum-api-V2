const createServer = require('../createServer');

describe('HTTP server', () => {
  it('should response 404 when request unregistered route', async () => {
    // Arrange
    const server = await createServer({});

    // Action
    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute',
    });

    // Assert
    expect(response.statusCode).toEqual(404);
  });

  it('should handle server error correctly', async () => {
    // Arrange
    const requestPayload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'super_secret',
    };
    const server = await createServer({}); // fake injection

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(500);
    expect(responseJson.status).toEqual('error');
    expect(responseJson.message).toEqual('terjadi kegagalan pada server kami');
  });

  it('should handle JWT validation correctly', async () => {
    // Arrange
    const server = await createServer({});

    // Create a valid JWT token using the same secret as in the server
    // eslint-disable-next-line global-require
    const Jwt = require('@hapi/jwt');
    const payload = { id: 'user-123' };
    const token = Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);

    // Action - test endpoint that requires authentication with valid token
    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      payload: {
        title: 'Test Thread',
        body: 'Test Body',
      },
    });

    // Assert - should get 500 because container is empty, but JWT validation should work
    expect(response.statusCode).toBe(500);
  });
});
