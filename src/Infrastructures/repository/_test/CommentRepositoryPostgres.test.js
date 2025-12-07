const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment and return added comment correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-comment-persist-123', username: 'dicodingcommentpersist' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-comment-persist-123', owner: 'user-comment-persist-123' });

      const newComment = new NewComment({
        content: 'sebuah comment',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepositoryPostgres.addComment(newComment, 'thread-comment-persist-123', 'user-comment-persist-123');

      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-comment-return-456', username: 'dicodingcommentreturn' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-comment-return-456', owner: 'user-comment-return-456' });

      const newComment = new NewComment({
        content: 'sebuah comment',
      });
      const fakeIdGenerator = () => '456';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const addedComment = await commentRepositoryPostgres.addComment(newComment, 'thread-comment-return-456', 'user-comment-return-456');

      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-456',
        content: 'sebuah comment',
        owner: 'user-comment-return-456',
      }));
    });
  });

  describe('verifyCommentExists function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentExists('comment-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment found', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-comment-789' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-comment-789', owner: 'user-comment-789' });
      await CommentsTableTestHelper.addComment({ id: 'comment-verify-123', threadId: 'thread-comment-789', owner: 'user-comment-789' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentExists('comment-verify-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-not-found', 'user-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when comment not owned by user', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-comment-999' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-comment-999', owner: 'user-comment-999' });
      await CommentsTableTestHelper.addComment({ id: 'comment-owner-123', threadId: 'thread-comment-999', owner: 'user-comment-999' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-owner-123', 'user-other'))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when comment owned by user', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-comment-111' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-comment-111', owner: 'user-comment-111' });
      await CommentsTableTestHelper.addComment({ id: 'comment-owner-456', threadId: 'thread-comment-111', owner: 'user-comment-111' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-owner-456', 'user-comment-111'))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should delete comment correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-comment-222' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-comment-222', owner: 'user-comment-222' });
      await CommentsTableTestHelper.addComment({ id: 'comment-delete-123', threadId: 'thread-comment-222', owner: 'user-comment-222' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await commentRepositoryPostgres.deleteComment('comment-delete-123');

      const comment = await CommentsTableTestHelper.findCommentsById('comment-delete-123');
      expect(comment[0].is_delete).toEqual(true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-comment-333', username: 'dicodingcomment3' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-comment-333', owner: 'user-comment-333' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-get-123',
        content: 'sebuah comment',
        date: '2021-08-08T07:22:33.555Z',
        threadId: 'thread-comment-333',
        owner: 'user-comment-333',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-comment-333');

      expect(comments).toHaveLength(1);
      expect(comments[0]).toStrictEqual({
        id: 'comment-get-123',
        username: 'dicodingcomment3',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        is_delete: false,
      });
    });
  });

  describe('getLikeCountByCommentId function', () => {
    it('should return like count correctly', async () => {
      const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
      await UsersTableTestHelper.addUser({ id: 'user-comment-444' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-comment-444', owner: 'user-comment-444' });
      await CommentsTableTestHelper.addComment({ id: 'comment-like-123', threadId: 'thread-comment-444', owner: 'user-comment-444' });
      await CommentLikesTableTestHelper.addLike({ id: 'like-1', commentId: 'comment-like-123', owner: 'user-comment-444' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const likeCount = await commentRepositoryPostgres.getLikeCountByCommentId('comment-like-123');

      expect(likeCount).toEqual(1);
      await CommentLikesTableTestHelper.cleanTable();
    });
  });
});
