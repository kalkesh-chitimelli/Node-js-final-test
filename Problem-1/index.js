import express from "express";
import { arrayOfArticleObjects, arrayOfUserObjects } from "./memory.js";
import { v4 as uuidv4 } from "uuid";
const app = express();
const port = 8080;

app.listen(port, () => {
  console.log(`connected to port ${port}`);
});
app.use(express.json());

app.post("/api/user", async (req, res) => {
  const data = await req.body;
  if (Object.keys(data).length === 0) {
    return res.status(400).json("Body is empty");
  } else {
    arrayOfUserObjects.push(data);
    return res.status(201).json("user created successfully");
  }
});

app.post("/api/authenticate", async (req, res) => {
  const data = await req.body;
  if (Object.keys(data).length === 0) {
    return res.status(400).json("Body is empty");
  } else {
    const loginUser = await arrayOfUserObjects.find((user) => {
      if (user.login === data.login) return user;
    });
    if (loginUser === undefined) {
      return res
        .status(404)
        .json("There is no user of the given login name in the database");
    } else {
      if (loginUser.password !== data.password) {
        return res
          .status(401)
          .json("The password does not match that saved in the database");
      } else {
        const token = uuidv4();
        loginUser.token = token;
        return res.status(200).json({ token: token });
      }
    }
  }
});

app.post("/api/logout", async (req, res) => {
  const data = await req.body;
  const tokenHeader = await req.header("auth");
  const logoutUser = await arrayOfUserObjects.find((user) => {
    if (user.login === data.login && user.token === tokenHeader) return user;
  });
  if (logoutUser === undefined) {
    return res.status(401).json("The token is invalid");
  } else {
    logoutUser.token = "";
    return res.status(200).json("User logged out successfully");
  }
});

app.get("/api/articles", async (req, res) => {
  const tokenHeader = await req.header("auth");
  if (tokenHeader === "") {
    const resultData = await arrayOfArticleObjects.filter((article) => {
      if (article.visibility === "public") {
        return article;
      }
    });
    return res.status(200).json(resultData);
  } else {
    const userInArticle = await arrayOfUserObjects.find((user) => {
      if (user.token === tokenHeader) return user;
    });
    console.log(userInArticle);
    const resultData = await arrayOfArticleObjects.filter((article) => {
      if (
        article.visibility === "public" ||
        article.visibility === "logged_in" ||
        (article.visibility === "private" &&
          article.user_id === userInArticle.user_id)
      ) {
        return article;
      }
    });
    return res.status(200).json(resultData);
  }
});

app.post("/api/articles", async (req, res) => {
  const tokenHeader = await req.header("auth");
  const userData = await req.body;
  const userInArticle = await arrayOfUserObjects.find((user) => {
    if (user.token === tokenHeader) return user;
  });
  if (Object.keys(userData).length === 0) {
    return res.status(400).json("body is empty");
  } else if (tokenHeader === "") {
    return res.status(401).json("token is invalid");
  } else {
    const newArticle = {
      articles_id: req.body.articles_id,
      title: req.body.title,
      content: req.body.content,
      visibility: req.body.visibility,
      user_id: userInArticle.user_id,
    };
    console.log("before:");
    console.log(arrayOfArticleObjects);
    arrayOfArticleObjects.push(newArticle);
    console.log("after:");
    console.log(arrayOfArticleObjects);
    return res.status(201).json("article created successfully");
  }
});
