const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist new reply and return added reply correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-reply-123', username: 'dicodingreply' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-reply-123', owner: 'user-reply-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-reply-123', threadId: 'thread-reply-123', owner: 'user-reply-123' });

      const newReply = new NewReply({
        content: 'sebuah reply',
        commentId: 'comment-reply-123',
        owner: 'user-reply-123',
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await replyRepositoryPostgres.addReply(newReply);

      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-reply-456', username: 'dicodingreply2' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-reply-456', owner: 'user-reply-456' });
      await CommentsTableTestHelper.addComment({ id: 'comment-reply-456', threadId: 'thread-reply-456', owner: 'user-reply-456' });

      const newReply = new NewReply({
        content: 'sebuah reply',
        commentId: 'comment-reply-456',
        owner: 'user-reply-456',
      });
      const fakeIdGenerator = () => '456';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const addedReply = await replyRepositoryPostgres.addReply(newReply);

      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-456',
        content: 'sebuah reply',
        owner: 'user-reply-456',
      }));
    });
  });

  describe('verifyReplyExists function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyExists('reply-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply found', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-reply-verify-unique', username: 'replyverifyuser' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-reply-verify-unique', owner: 'user-reply-verify-unique' });
      await CommentsTableTestHelper.addComment({ id: 'comment-reply-verify-unique', threadId: 'thread-reply-verify-unique', owner: 'user-reply-verify-unique' });
      await RepliesTableTestHelper.addReply({ id: 'reply-verify-unique', commentId: 'comment-reply-verify-unique', owner: 'user-reply-verify-unique' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyExists('reply-verify-unique'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError when reply not owned by user', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-reply-999' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-reply-999', owner: 'user-reply-999' });
      await CommentsTableTestHelper.addComment({ id: 'comment-reply-999', threadId: 'thread-reply-999', owner: 'user-reply-999' });
      await RepliesTableTestHelper.addReply({ id: 'reply-owner-123', commentId: 'comment-reply-999', owner: 'user-reply-999' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-owner-123', 'user-other'))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when reply owned by user', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-reply-111' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-reply-111', owner: 'user-reply-111' });
      await CommentsTableTestHelper.addComment({ id: 'comment-reply-111', threadId: 'thread-reply-111', owner: 'user-reply-111' });
      await RepliesTableTestHelper.addReply({ id: 'reply-owner-456', commentId: 'comment-reply-111', owner: 'user-reply-111' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-owner-456', 'user-reply-111'))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteReply function', () => {
    it('should delete reply correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-reply-222' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-reply-222', owner: 'user-reply-222' });
      await CommentsTableTestHelper.addComment({ id: 'comment-reply-222', threadId: 'thread-reply-222', owner: 'user-reply-222' });
      await RepliesTableTestHelper.addReply({ id: 'reply-delete-123', commentId: 'comment-reply-222', owner: 'user-reply-222' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await replyRepositoryPostgres.deleteReply('reply-delete-123');

      const reply = await RepliesTableTestHelper.findRepliesById('reply-delete-123');
      expect(reply[0].is_delete).toEqual(true);
    });
  });

  describe('verifyReplyOwner function - NotFound case', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-not-found', 'user-123'))
        .rejects.toThrowError(NotFoundError);
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('should return replies correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-reply-comment-unique', username: 'replycommentuser' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-reply-comment-unique', owner: 'user-reply-comment-unique' });
      await CommentsTableTestHelper.addComment({ id: 'comment-reply-comment-unique', threadId: 'thread-reply-comment-unique', owner: 'user-reply-comment-unique' });
      await RepliesTableTestHelper.addReply({
        id: 'reply-comment-123',
        content: 'sebuah reply',
        date: '2021-08-08T07:59:18.982Z',
        commentId: 'comment-reply-comment-unique',
        owner: 'user-reply-comment-unique',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const replies = await replyRepositoryPostgres.getRepliesByCommentId('comment-reply-comment-unique');

      expect(replies).toHaveLength(1);
      expect(replies[0]).toStrictEqual({
        id: 'reply-comment-123',
        content: 'sebuah reply',
        date: '2021-08-08T07:59:18.982Z',
        username: 'replycommentuser',
        is_delete: false,
      });
    });
  });

  describe('getRepliesByThreadId function', () => {
    it('should return replies correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-reply-thread-unique', username: 'replythreaduser' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-reply-thread-unique', owner: 'user-reply-thread-unique' });
      await CommentsTableTestHelper.addComment({ id: 'comment-reply-thread-unique', threadId: 'thread-reply-thread-unique', owner: 'user-reply-thread-unique' });
      await RepliesTableTestHelper.addReply({
        id: 'reply-get-123',
        content: 'sebuah reply',
        date: '2021-08-08T07:59:18.982Z',
        commentId: 'comment-reply-thread-unique',
        owner: 'user-reply-thread-unique',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const replies = await replyRepositoryPostgres.getRepliesByThreadId('thread-reply-thread-unique');

      expect(replies).toHaveLength(1);
      expect(replies[0]).toStrictEqual({
        id: 'reply-get-123',
        content: 'sebuah reply',
        date: '2021-08-08T07:59:18.982Z',
        username: 'replythreaduser',
        comment_id: 'comment-reply-thread-unique',
        is_delete: false,
      });
    });
  });
});
