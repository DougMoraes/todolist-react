const functions = require("firebase-functions");
const app = require("express")();
const auth = require("./util/auth");
const {
  getAllTodos,
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

app.get("/todos", getAllTodos);
app.post("/todo", postOneTodo);
app.delete("/todo/:todoId", deleteOneTodo);
app.put("/todo/:todoId", editTodo);

exports.api = functions.https.onRequest(app);
