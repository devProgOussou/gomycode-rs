const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");
const { checkUser, requireAuth } = require("./middleware/auth.midleware");
const app = express();
//process.setMaxListeners(0);

//middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//jsonwebtoken
app.get("*", checkUser);
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});

//routes
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

//server
app.listen(process.env.PORT, () => {
  console.log("====================================");
  console.log(`Listening on PORT ${process.env.PORT}`);
  console.log("------------------------------------");
});
