const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyLikeExists function', () => {
    it('should return false when like does not exist', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-like-verify-1', username: 'userlikeverify1' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-like-verify-1', owner: 'user-like-verify-1' });
      await CommentsTableTestHelper.addComment({ id: 'comment-like-verify-1', threadId: 'thread-like-verify-1', owner: 'user-like-verify-1' });

      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      const isLikeExists = await likeRepositoryPostgres.verifyLikeExists('comment-like-verify-1', 'user-like-verify-1');

      expect(isLikeExists).toEqual(false);
    });

    it('should return true when like exists', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-like-verify-2', username: 'userlikeverify2' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-like-verify-2', owner: 'user-like-verify-2' });
      await CommentsTableTestHelper.addComment({ id: 'comment-like-verify-2', threadId: 'thread-like-verify-2', owner: 'user-like-verify-2' });
      await CommentLikesTableTestHelper.addLike({ id: 'like-verify-2', commentId: 'comment-like-verify-2', owner: 'user-like-verify-2' });

      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      const isLikeExists = await likeRepositoryPostgres.verifyLikeExists('comment-like-verify-2', 'user-like-verify-2');

      expect(isLikeExists).toEqual(true);
    });
  });

  describe('addLike function', () => {
    it('should persist like and return correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-like-add-1', username: 'userlikeadd1' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-like-add-1', owner: 'user-like-add-1' });
      await CommentsTableTestHelper.addComment({ id: 'comment-like-add-1', threadId: 'thread-like-add-1', owner: 'user-like-add-1' });

      const fakeIdGenerator = () => 'add-1';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await likeRepositoryPostgres.addLike('comment-like-add-1', 'user-like-add-1');

      const likes = await CommentLikesTableTestHelper.findLikeById('like-add-1');
      expect(likes).toHaveLength(1);
    });
  });

  describe('deleteLike function', () => {
    it('should delete like from database', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-like-delete-1', username: 'userlikedelete1' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-like-delete-1', owner: 'user-like-delete-1' });
      await CommentsTableTestHelper.addComment({ id: 'comment-like-delete-1', threadId: 'thread-like-delete-1', owner: 'user-like-delete-1' });
      await CommentLikesTableTestHelper.addLike({ id: 'like-delete-1', commentId: 'comment-like-delete-1', owner: 'user-like-delete-1' });

      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await likeRepositoryPostgres.deleteLike('comment-like-delete-1', 'user-like-delete-1');

      const likes = await CommentLikesTableTestHelper.findLikeById('like-delete-1');
      expect(likes).toHaveLength(0);
    });
  });
});
