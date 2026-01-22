export type GeneratePresignedUrlOptions = {
  shorten?: boolean;
};

export type GeneratePresignedUrlParams = {
  folder: string;
  contentType: string;
  userId: string;
  options?: GeneratePresignedUrlOptions;
};

export type GeneratePresignedUrlResponse = {
  presignedUrl: string;
  fileUrl: string;
};
