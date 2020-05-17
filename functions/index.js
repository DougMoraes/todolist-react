const functions = require("firebase-functions");
const app = require("express")();

const { getAllTodos, postOneTodo, deleteOneTodo } = require("./APIs/todos");

app.get("/todos", getAllTodos);
app.post("/todo", postOneTodo);
app.delete("/todo/:todoId", deleteOneTodo);

exports.api = functions.https.onRequest(app);
