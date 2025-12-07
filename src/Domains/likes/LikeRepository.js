class LikeRepository {
  async verifyLikeExists(_commentId, _owner) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async addLike(_commentId, _owner) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteLike(_commentId, _owner) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = LikeRepository;
