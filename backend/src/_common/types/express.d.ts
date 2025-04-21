declare global {
  namespace Express {
    interface Request {
      cookies: {
        token?: string;
      };
      user?: {
        id: string;
      };
    }
  }
}
