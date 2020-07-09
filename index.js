const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const pool = require('./server/db.js');
const path = require('path');

//middleware 
app.use(cors());
app.use(express.json()); //lets us access req.body

//needed for depoloying to provide the index.html as the source to build from
app.use(express.static(path.join(`${__dirname}/build/index.html`)));
app.get('/*', function (req, res) {
  res.sendFile(path.join(`${__dirname}/build/index.html`));
});

//routes//

//create todo
app.post('/todos', async (req, res) => {
  console.log('accessing todos post route')
  try {
    const { description } = req.body;
    const VALUES = [description]
    console.log("description: ", VALUES)
    const newTodo = await pool.query('INSERT INTO todos (description) VALUES($1) RETURNING *', VALUES);
    res.json(newTodo);
    console.log(req.body);

  } catch (err) {
    console.error(err.message);
  }
})
//get all todos 
app.get('/todos', async (req, res) => {
  try {
    const allTodos = await pool.query('SELECT * FROM todos');
    res.json(allTodos.rows);
  } catch (err) {
    console.log(err.message)
  }
})
//get a todo
app.get('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const VALUES = [id];
    const todo = await pool.query('SELECT * FROM todos WHERE todo_id = $1', VALUES);
    res.json(todo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
})
//update a todo 
app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const VALUES = [description, id];
    const updateTodo = await pool.query('UPDATE todos SET description = $1 WHERE todo_id = $2', VALUES);

    res.json('todo was updated');
  } catch (err) {
    console.error(err.message);
  }
});
//delete a todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const VALUES = [id]
    const deleteTodo = await pool.query('DELETE FROM todos WHERE todo_id = $1', VALUES);
    res.json('todo was deleted');
  } catch (err) {
    console.error(err.message);
  }
})

app.listen(PORT, () => {
  console.log(`server has started on port: ${PORT}`);
});
