import "reflect-metadata";
import "dotenv/config";

import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import cors from "cors";
import { verify } from "jsonwebtoken";

import { UserResolver } from "./entities/UserResolver";
import { User } from "./entities/User";
import { createAccessToken } from "./access-control/authentication";
import { sendRefreshToken } from "./access-control/sendRefreshToken";

(async () => {
  const app = express();
  app.use(cookieParser());
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );
  app.get("/", (_req, res) => {
    res.send("hello");
  });

  app.post("/refresh_token", async ({ cookies }, res) => {
    const token = cookies.jid;

    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }

    let payload: any = null;

    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.error(err);
      return res.send({ ok: false, accessToken: "" });
    }

    // token is valid, send back access token
    const user = await User.findOne({ id: payload.userId });

    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: "" });
    }

    sendRefreshToken(res, createAccessToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  await createConnection();

  const apolloServer = new ApolloServer({
    context: ({ req, res }) => ({ req, res }),
    schema: await buildSchema({ resolvers: [UserResolver] }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("server started on http://localhost:4000");
  });
})();
