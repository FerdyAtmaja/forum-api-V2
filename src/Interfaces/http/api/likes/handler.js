const ToggleCommentLikeUseCase = require('../../../../Applications/use_case/ToggleCommentLikeUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putCommentLikeHandler = this.putCommentLikeHandler.bind(this);
  }

  async putCommentLikeHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const toggleCommentLikeUseCase = this._container.getInstance(ToggleCommentLikeUseCase.name);
    await toggleCommentLikeUseCase.execute(threadId, commentId, credentialId);

    return {
      status: 'success',
    };
  }
}

module.exports = LikesHandler;