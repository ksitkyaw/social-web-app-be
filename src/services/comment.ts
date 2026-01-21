import { CreateCommentInput, CommentDTO } from "../types";
import { commentRepository, postRepository } from "../repositories";
import { validateParams } from "../utils/validator";
import { createCommentSchema } from "../validation-schemas";
import { NotFoundError } from "../utils/errors";

class CommentService {
  @validateParams(createCommentSchema)
  public async createComment(payload: CreateCommentInput): Promise<CommentDTO> {
    const post = await postRepository.findById(payload.postId);
    if (!post) {
      throw new NotFoundError("Post not found");
    }

    const comment = await commentRepository.createComment(payload);

    const json = comment.toJSON ? comment.toJSON() : comment;

    return {
      id: json.id,
      postId: json.post?.toString(),
      content: json.content,
      createdAt: json.createdAt,
      updatedAt: json.updatedAt,
      author: json.author,
    };
  }

  private resolveOwnerId(comment: any): string {
    const user = comment.user ?? comment.author;
    if (!user) {
      return "";
    }
    if (typeof user === "string") {
      return user;
    }
    const id = user.id ?? user._id;
    return id?.toString?.() ?? "";
  }
}
