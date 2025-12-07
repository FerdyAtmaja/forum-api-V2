const createServer = require('../Infrastructures/http/createServer');
const container = require('../Infrastructures/container');

jest.mock('../Infrastructures/http/createServer');
jest.mock('../Infrastructures/container');

describe('app', () => {
  it('should start server correctly', async () => {
    const mockServer = {
      start: jest.fn(),
      info: {
        uri: 'http://localhost:5000',
      },
    };

    createServer.mockResolvedValue(mockServer);
    console.log = jest.fn();

    // eslint-disable-next-line global-require
    require('../app');

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(createServer).toHaveBeenCalledWith(container);
    expect(mockServer.start).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('server start at http://localhost:5000');
  });
});
