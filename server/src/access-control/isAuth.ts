import { MiddlewareFn } from "type-graphql";
import { MyContext } from "src/interfaces/MyContext";
import { verify } from "jsonwebtoken";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    throw new Error("Not authenticated!");
  }

  try {
    const [token] = authorization.split(" ").slice(1);
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);

    context.payload = <any>payload;
  } catch (err) {
    console.error(err);
    throw new Error("Not authenticated!");
  }
  return next();
};
