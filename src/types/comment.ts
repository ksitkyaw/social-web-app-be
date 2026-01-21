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
