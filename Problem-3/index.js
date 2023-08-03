import express from "express";
const app = express();
app.use(express.json());
app.listen(8080, () => {
  console.log(`connected to port 8080`);
});

const userObjectArray = [
  {
    id: 1,
    name: "kalkesh",
  },
  {
    id: 2,
    name: "shardul",
  },
];

app.get("/", (req, res) => {
  return res.sendStatus(301);
});
app.get("/users", (req, res) => {
  return res.status(200).json(userObjectArray);
});

app.get("/new", (req, res) => {
  return res.status(200).json({ text: "welcome to the new page" });
});

app.get("/nonexisting", (req, res) => {
  return res.sendStatus(404);
});

app.get("/path", (req, res) => {
  return res.status(301).redirect("http://localhost:8080/");
});

app.post("/users", (req, res) => {
  const data = req.body;
  userObjectArray.push(data);
  return res.send(`user ${data.name} registered successfully`);
});

export default app;
