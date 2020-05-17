const functions = require("firebase-functions");
const app = require("express")();

const {
  getAllTodos,
  postOneTodo,
  deleteOneTodo,
  editTodo
} = require("./APIs/todos");

app.get("/todos", getAllTodos);
app.post("/todo", postOneTodo);
app.delete("/todo/:todoId", deleteOneTodo);
app.put("/todo/:todoId", editTodo);

exports.api = functions.https.onRequest(app);
