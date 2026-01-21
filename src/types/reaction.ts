export type ToggleReactionParams = {
  postId: string;
  type?: "like";
};

export type ReactionResponse = {
  reacted: boolean;
  reactionCount: number;
};

export type ToggleReactionInput = ToggleReactionParams & {
  userId: string;
};
