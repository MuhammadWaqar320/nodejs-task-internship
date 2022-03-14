import express, { application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import actor_router from "./Routes/actors_routes.js";
import user_router from "./Routes/user_routes.js";
import movie_router from "./Routes/movies_routes.js";
import director_router from "./Routes/director_routes.js";
import { engine } from "express-handlebars";
import path from "path";
import { auth } from "express-openid-connect";
import { getAllMovies } from "./Controllers/movies_controllers.js";
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};

const myapp = express();
const _cors = cors();
myapp.use(bodyParser.json({ limit: "20mb", extended: true }));
myapp.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));
myapp.use(_cors);
myapp.use("/profile", express.static("Upload/actorsProfile"));
myapp.use("/poster", express.static("Upload/posters"));
myapp.use(cookieParser());
myapp.use(auth(config));
// myapp.set('views', path.join(__dirname, 'views/'));
myapp.engine("handlebars", engine({ defaultLayout: "index" }));
myapp.set("view engine", "handlebars");
// actor's routes are here
myapp.use("/actor", actor_router);
// movies's routes are here
myapp.use("/movie", movie_router);
// user's routes are here
myapp.use("/user", user_router);
// director's routes are here
myapp.use("/director", director_router);
myapp.get("/", (req, res) => {
  let isLoggedin = false;
  if (req.oidc.isAuthenticated()) {
    isLoggedin = true;
  }
  res.render("main", { isLogin: isLoggedin });
});

export default myapp;
