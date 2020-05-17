const { db } = require("../util/admin");

exports.getAllTodos = (req, resp) => {
  db.collection("todos")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let todos = [];
      data.forEach(doc => {
        todos.push({
          todoId: doc.id,
          title: doc.data().title,
          body: doc.data().body,
          createdAt: doc.data().createdAt
        });
      });

      return resp.json(todos);
    })
    .catch(err => {
      console.error(err);

      return resp.status(500).json({ error: err.code });
    });
};

exports.postOneTodo = (req, resp) => {
  if (req.body.body.trim() === "") {
    return resp.status(400).json({ body: "Must not be empty" });
  }

  if (req.body.title.trim() === "") {
    return resp.status(400).json({ title: "Must not be empty" });
  }

  const newTodoItem = {
    title: req.body.title,
    body: req.body.body,
    createdAt: new Date().toISOString()
  };

  db.collection("todos")
    .add(newTodoItem)
    .then(doc => {
      const createdItem = newTodoItem;
      createdItem.id = doc.id;
      return resp.json(createdItem);
    })
    .catch(err => {
      resp.status(500).json({ error: "Something went wrong" });
      console.log(err);
    });
};

exports.deleteOneTodo = (req, resp) => {
  const doc = db.doc(`/todos/${req.params.todoId}`);

  doc
    .get()
    .then(result => {
      return !result.exists
        ? resp.status(404).json({ error: "Todo not found" })
        : doc.delete();
    })
    .then(() => {
      resp.json({ message: "Delete successful!" });
    })
    .catch(err => {
      console.error(err);
      return resp.status(500).json({ error: err.code });
    });
};

exports.editTodo = (req, resp) => {
  if (req.body.todoId || req.body.createdAt) {
    resp.status(403).json({ message: "Invalid field to edit!" });
  }

  const doc = db.doc(`/todos/${req.params.todoId}`);

  doc
    .update(req.body)
    .then(() => {
      resp.json({ message: "Updated successfully" });
    })
    .catch(err => {
      console.error(err);
      return resp.status(500).json({
        error: err.code
      });
    });
};
