const functions = require("firebase-functions");
const app = require("express")();
const auth = require("./util/auth");
const {
  getAllTodos,
  getOneTodo,
  postOneTodo,
  deleteOneTodo,
  editTodo
} = require("./APIs/todos");
const {
  getUserDetails,
  loginUser,
  signUpUser,
  updateUserDetails,
  uploadProfilePhoto
} = require("./APIs/users");

app.post("/login", loginUser);
app.post("/signup", signUpUser);
app.post("/user/image", auth, uploadProfilePhoto);
app.get("/user", auth, getUserDetails);
app.post("/user", auth, updateUserDetails);

app.get("/todos", auth, getAllTodos);
app.post("/todo", auth, postOneTodo);
app.get("/todo/:todoId", auth, getOneTodo);
app.delete("/todo/:todoId", auth, deleteOneTodo);
app.put("/todo/:todoId", auth, editTodo);

exports.api = functions.https.onRequest(app);
