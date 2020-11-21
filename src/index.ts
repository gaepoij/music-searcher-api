import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { TestResolver, AuthResolver } from "./resolvers";
import { initConnection } from "./database/index";
import cors from "cors";
import { spotifyRequest } from "./spotify";
require("dotenv").config();

const main = async () => {
  await initConnection();

  const app = express();
  app.use(
    cors({
      origin: process.env.WEB_ORIGIN,
      credentials: true,
    })
  );

  app.get("/", (_req, res) => {
    res.send("API ONLINE");
  });

  app.post("/refresh_token", async (req, res) => {
    const token = req.headers.cookie?.split("gid=")[1];
    if (!token || token !== "undefined") {
      const request = await spotifyRequest("POST", "refresh_token", {
        refresh_token: token,
      });
      return res.send({ accessToken: request.data.access_token });
    } else {
      return res.send({ accessToken: "" });
    }
  });

  app.listen(4000, () => {
    console.log("Started server on port 4000");
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [TestResolver, AuthResolver],
      validate: false,
    }),
    context: async ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.get("/", (_, res) => {
    res.send("Server is online");
  });
};

main();
