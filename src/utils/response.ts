export const successResponse = (body: Record<string, any>) => {
  return { status: { success: true }, body };
};
export const failureResponse = (error?: any) => {
  return { status: { success: false, error } };
};
