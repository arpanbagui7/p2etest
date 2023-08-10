export const ResponseHandler = (
  status: number,
  error: object | null = null,
  content: object | null = null
) => {
  return {
    status,
    error,
    content,
  };
};

export const ResponseError = (status: number, msg: string, reason: string) => {
  return {
    status,
    msg,
    reason,
  };
};
