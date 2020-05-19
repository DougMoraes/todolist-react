const functions = require("firebase-functions");
const app = require("express")();
const {
  getAllTodos,
  postOneTodo,
  deleteOneTodo,
  editTodo
} = require("./APIs/todos");
const { loginUser } = require("./APIs/users");

app.post("/login", loginUser);

app.get("/todos", getAllTodos);
app.post("/todo", postOneTodo);
app.delete("/todo/:todoId", deleteOneTodo);
app.put("/todo/:todoId", editTodo);

exports.api = functions.https.onRequest(app);
