const { Router } = require("express");
const path = require("path");
const multer = require("multer");
const passport = require("./config/passport");

const celebrate = require("./config/celebrate");
const multerConfig = require("./config/multer");

//Controllers
const AuthController = require("./controllers/AuthController");
const CategoryController = require("./controllers/CategoryController");
const TeamController = require("./controllers/TeamController");
const TeamMemberController = require("./controllers/TeamMemberController");
const UserController = require("./controllers/UserController");
const FriendController = require("./controllers/FriendController");
const PictureController = require("./controllers/PictureController");
const PostController = require("./controllers/PostController");
const PostCommentController = require("./controllers/PostCommentController");
const PostLikeController = require("./controllers/PostLikeController");

//Routes
const routes = Router();

routes.get("/signin", function (req, res) {
  return res.send("HELLO LOGIN");
});
routes.post("/signin", AuthController.signIn);
routes.post("/signout", AuthController.signOut);
routes.post("/register", AuthController.register);

routes.get("/categories", CategoryController.index);
routes.get("/categories/:categoryId", CategoryController.query);
routes.post("/categories", CategoryController.store);
routes.put("/categories/:categoryId", CategoryController.update);
routes.delete("/categories", CategoryController.destroy);

routes.get("/teams", TeamController.index);
routes.get("/teams/:teamId", TeamController.query);
routes.post("/teams", TeamController.store);
routes.put("/teams/:teamId", TeamController.update);
routes.delete("/teams/:teamId", TeamController.destroy);
routes.delete("/teams", TeamController.destroyAll);

// routes.get("/teams/:teamId/members", TeamMemberController.query);
routes.post("/teams/:teamId/members", TeamMemberController.store);
routes.put("/teams/:teamId/members", TeamMemberController.update);
routes.delete("/teams/:teamId/members", TeamMemberController.destroy);

// routes.get("/teams/:teamId/posts", PostController.query);
// routes.post("/teams/:teamId/posts", PostController.store);
// routes.put("/teams/:teamId/posts/:postId", PostController.update);
// routes.delete("/teams/:teamId/posts/:postId", PostController.destroy);
// routes.delete("/teams/:teamId/posts", PostController.destroyAll);

routes.get("/users", UserController.index);
routes.get("/users/:userId", UserController.query);
routes.put("/users/:userId", UserController.update);
routes.delete("/users/all", UserController.deleteAll);

routes.get("/posts", PostController.index);
routes.get("/posts/:postId", PostController.query);
routes.post("/posts", PostController.store);
// routes.post("/posts/:userId", PostController.store);
routes.put("/posts/:postId", PostController.update);
routes.delete("/posts/:postId", PostController.destroy);

routes.post("/posts/:postId/comments", PostCommentController.store);
routes.put("/posts/:postId/comments", PostCommentController.update);

routes.get("/posts/:postId/likes", PostLikeController.query);
routes.post("/posts/:postId/likes", PostLikeController.store);
routes.put("/posts/:postId/likes", PostLikeController.update);

routes.get("/uploads", PictureController.index);
routes.post(
  // "/users/:id/upload",
  "/uploads/:models/:id/",
  multer(multerConfig).single("file"),
  PictureController.store
);

routes.get("/home", function (req, res) {
  return res.send("HELLO PIG");
});

module.exports = routes;
