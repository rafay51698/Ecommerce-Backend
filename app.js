const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

//
app.use(cors());
app.options("*", cors());
//env
const api = process.env.API_URL;

//middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));

//router
const productRouter = require("./router/products");
const categoryRouter = require("./router/categories");
const userRouter = require("./router/user");

//routers
app.use(`${api}/products`, productRouter);
app.use(`${api}/categories`, categoryRouter);
app.use(`${api}/users`, userRouter);

mongoose
  .connect(process.env.CONNECTION_STRING, { dbName: "eshop-db" })
  .then(() => {
    console.log("Database connection is ready");
  })
  .then((err) => {
    "Connection error" + err;
  });
app.listen(3000, () => {
  console.log("Server is started http://localhost:3000");
  console.log(api);
});
