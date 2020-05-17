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
