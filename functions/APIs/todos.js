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
