import { PaginatedResult, PaginationQuery } from "./common";

export type PostDTO = {
  id: string;
  title: string;
  content: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    email: string;
  };
  reactionCount: number;
  commentCount: number;
};

export type CreatePostParams = {
  title: string;
  content: string;
  image?: string;
};

export type UpdatePostParams = Partial<CreatePostParams>;

export type ListPostsQuery = PaginationQuery;

export type PostListResponse = PaginatedResult<PostDTO>;

export type CreatePostInput = CreatePostParams & {
  userId: string;
};

export type UpdatePostInput = UpdatePostParams & {
  userId: string;
  postId: string;
};

export type ListMyPostsInput = PaginationQuery & {
  userId: string;
};

export type ListPostsInput = PaginationQuery;
