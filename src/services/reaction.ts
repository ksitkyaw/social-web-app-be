import { ToggleReactionInput, ReactionResponse } from "../types";
import { reactionRepository, postRepository } from "../repositories";
import { validateParams } from "../utils/validator";
import { toggleReactionSchema } from "../validation-schemas";
import { NotFoundError } from "../utils/errors";

class ReactionService {
  @validateParams(toggleReactionSchema)
  public async toggleReaction(payload: ToggleReactionInput): Promise<ReactionResponse> {
    const post = await postRepository.findById(payload.postId);
    if (!post) {
      throw new NotFoundError("Post not found");
    }

    const result = await reactionRepository.toggleReaction(payload);
    return {
      reacted: result.reacted,
      reactionCount: result.count,
    };
  }
}

export const reactionService = new ReactionService();
