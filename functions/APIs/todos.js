exports.getAllTodos = (req, resp) => {
  todos = [
    {
      id: "1",
      title: "greeting",
      body: "Hello world from Doug Moraes"
    },
    {
      id: "2",
      title: "greeting2",
      body: "Hello2 world2 from Doug Moraes"
    }
  ];

  return resp.json(todos);
};
