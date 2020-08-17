import {
  Arg,
  Mutation,
  Query,
  Resolver,
  ObjectType,
  Field,
  Ctx,
  UseMiddleware,
  Int,
} from "type-graphql";
import { getConnection } from "typeorm";
import { verify } from "jsonwebtoken";
import { hash, compare } from "bcryptjs";

import { User } from "./User";
import { MyContext } from "../interfaces/MyContext";
import {
  createAccessToken,
  createRefreshToken,
} from "../access-control/authentication";
import { isAuth } from "../access-control/isAuth";
import { sendRefreshToken } from "../access-control/sendRefreshToken";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext) {
    return `your user is ${payload?.userId}`;
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() context: MyContext) {
    const authorization = context.req.headers["authorization"];

    if (!authorization) return null;

    try {
      const [token] = authorization.split(" ").slice(1);
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);

      context.payload = payload;

      return User.findOne(payload.userId);
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg("userId", () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);

    return true;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: MyContext) {
    sendRefreshToken(res, "");

    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("Could not find user!");
    }

    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      throw new Error("Bad password!");
    }

    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
      user,
    };
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string
  ) {
    try {
      const hashedPassword = await hash(password, 12);

      await User.insert({
        email,
        password: hashedPassword,
      });

      return true;
    } catch (e) {
      console.error("error inserting user!");
      return false;
    }
  }
}
