class ToggleCommentLikeUseCase {
  constructor({ commentRepository, likeRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
    this._threadRepository = threadRepository;
  }

  async execute(threadId, commentId, userId) {
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExists(commentId);
    const isLiked = await this._likeRepository.verifyLikeExists(commentId, userId);

    if (isLiked) {
      await this._likeRepository.deleteLike(commentId, userId);
    } else {
      await this._likeRepository.addLike(commentId, userId);
    }
  }
}

module.exports = ToggleCommentLikeUseCase;
