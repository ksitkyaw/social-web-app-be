import {
  CreatePostInput,
  ListMyPostsInput,
  ListPostsInput,
  PostDTO,
  PostListResponse,
  UpdatePostInput,
  UpdatePostParams,
} from "../types";
import { commentRepository, postRepository, reactionRepository } from "../repositories";
import { validateParams } from "../utils/validator";
import {
  createPostSchema,
  listMyPostsSchema,
  listPostsSchema,
  updatePostSchema,
} from "../validation-schemas";
import { AuthorizationError, NotFoundError } from "../utils/errors";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

class PostService {
  @validateParams(createPostSchema)
  public async createPost(payload: CreatePostInput): Promise<PostDTO> {
    const post = await postRepository.createPost(payload);
    const populated = await postRepository.findById(post.id);
    return this.toPostDTO(populated ?? post);
  }

  @validateParams(updatePostSchema)
  public async updatePost(params: UpdatePostInput): Promise<PostDTO> {
    const { postId, userId, ...updates } = params;
    const existing = await postRepository.findById(postId);
    if (!existing) {
      throw new NotFoundError("Post not found");
    }
    if (existing.user._id.toString() !== userId) {
      throw new AuthorizationError("You can only edit your own posts");
    }

    const updated = await postRepository.updatePost(postId, updates as UpdatePostParams);
    if (!updated) {
      throw new NotFoundError("Post not found");
    }
    return this.toPostDTO(updated);
  }

  @validateParams(listMyPostsSchema)
  public async listMyPosts(params: ListMyPostsInput): Promise<PostListResponse> {
    const { userId, page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = params;
    const { data, total } = await postRepository.listPosts({ user: userId }, { page, limit });
    const counts = await this.getAggregates(data);

    return {
      data: data.map((post) => this.toPostDTO(post, counts.reactions, counts.comments)),
      pagination: this.buildPagination(total, page, limit),
    };
  }

  @validateParams(listPostsSchema)
  public async listPosts(params: ListPostsInput): Promise<PostListResponse> {
    const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = params;
    const { data, total } = await postRepository.listPosts({}, { page, limit });
    const counts = await this.getAggregates(data);

    return {
      data: data.map((post) => this.toPostDTO(post, counts.reactions, counts.comments)),
      pagination: this.buildPagination(total, page, limit),
    };
  }

  public async ensureOwnPost(postId: string, userId: string) {
    const post = await postRepository.findById(postId);
    if (!post) {
      throw new NotFoundError("Post not found");
    }
    if (this.resolveOwnerId(post) !== userId) {
      throw new AuthorizationError("You can only modify your posts");
    }
    return post;
  }

  private async getAggregates(posts: any[]) {
    const ids = posts
      .map((post) => this.resolvePostId(post))
      .filter((id): id is string => Boolean(id));

    const [reactions, comments] = await Promise.all([
      reactionRepository.countByPosts(ids),
      commentRepository.countByPosts(ids),
    ]);
    return { reactions, comments };
  }

  private toPostDTO(
    post: any,
    reactionCounts?: Record<string, number>,
    commentCounts?: Record<string, number>,
  ): PostDTO {
    const json = post.toJSON ? post.toJSON() : post;
    const id = this.resolvePostId(json);
    return {
      id,
      title: json.title,
      content: json.content,
      image: json.image ?? null,
      createdAt: json.createdAt,
      updatedAt: json.updatedAt,
      author: json.author ?? {
        id: this.resolveOwnerId(json) ?? "",
        name: json.user?.name ?? "",
        email: json.user?.email ?? "",
      },
      reactionCount: reactionCounts?.[id] ?? 0,
      commentCount: commentCounts?.[id] ?? 0,
    };
  }

  private buildPagination(total: number, page: number, limit: number) {
    const totalPages = Math.ceil(total / limit) || 1;
    return {
      page,
      limit,
      total,
      totalPages,
    };
  }

  private resolveOwnerId(post: any): string {
    const user = post.user ?? post.author;
    if (!user) {
      return "";
    }
    if (typeof user === "string") {
      return user;
    }
    const id = user.id ?? user._id;
    return id?.toString?.() ?? "";
  }

  private resolvePostId(post: any): string {
    if (!post) {
      return "";
    }
    if (typeof post === "string") {
      return post;
    }
    const id = post.id ?? post._id;
    return id?.toString?.() ?? "";
  }
}

export const postService = new PostService();
