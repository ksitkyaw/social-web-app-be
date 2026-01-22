export type CommentDTO = {
  id: string;
  postId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name?: string;
    email?: string;
  };
};

export type CreateCommentParams = {
  postId: string;
  content: string;
};

export type CreateCommentInput = CreateCommentParams & {
  userId: string;
};
export type CommentJSON = CommentDTO & {
  post?: string | { _id?: string };
  postId?: string;
  user?: {
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
  } | string;
  author?: CommentDTO["author"];
};
