import { CreateCommentInput, CommentDTO, CommentJSON } from "../types";
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
    const json = (comment.toJSON ? comment.toJSON() : comment) as CommentJSON;

    return {
      id: json.id,
      postId: this.resolvePostId(json) ?? payload.postId,
      content: json.content,
      createdAt: json.createdAt,
      updatedAt: json.updatedAt,
      author: this.resolveAuthor(json, payload.userId),
    };
  }

  private resolvePostId(comment: CommentJSON) {
    if (comment.postId) {
      return comment.postId;
    }
    const post = comment.post;
    if (!post) {
      return undefined;
    }
    if (typeof post === "string") {
      return post;
    }
    return post._id?.toString();
  }

  private resolveAuthor(comment: CommentJSON, fallbackUserId: string) {
    if (comment.author) {
      return comment.author;
    }
    const user = comment.user;
    if (!user) {
      return { id: fallbackUserId };
    }
    if (typeof user === "string") {
      return { id: user };
    }
    const id = user.id ?? user._id ?? fallbackUserId;
    return {
      id: id.toString?.() ?? id,
      name: user.name,
      email: user.email,
    };
  }
}

export const commentService = new CommentService();
