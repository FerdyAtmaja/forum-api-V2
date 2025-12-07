const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and return thread with likeCount', async () => {
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'johndoe',
          password: 'secret',
          fullname: 'John Doe',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      const loginResponse2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'johndoe',
          password: 'secret',
        },
      });

      const { data: { accessToken: accessToken2 } } = JSON.parse(loginResponse2.payload);

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { data: { addedThread } } = JSON.parse(threadResponse.payload);

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { data: { addedComment } } = JSON.parse(commentResponse.payload);

      await server.inject({
        method: 'PUT',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      await server.inject({
        method: 'PUT',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${addedThread.id}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(1);
      expect(responseJson.data.thread.comments[0].likeCount).toEqual(2);
    });
  });
});
