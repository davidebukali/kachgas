export type JwtPayload = {
  sub: string;
  id: number;
  name: string;
};

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
