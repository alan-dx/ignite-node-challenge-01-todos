const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find(user => user.username == username);

  if (!user) {
    return response.status(404).json({error: "User not found"})
  }

  request.user = user;

  return next();


}

function checksIfUserNameAlreadyInUse(username) {
  return users.some(user => user.username == username)
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  if (checksIfUserNameAlreadyInUse(username)) {
    return response.status(400).json({error: "Username already in use"});
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  };

  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const user = request.user;

  return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const user = request.user;
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo)

  return response.status(201).json(todo);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { id } = request.params;
  const user = request.user;

  const todo = user.todos.find(todo => todo.id == id)

  if (!todo) {
    return response.status(404).json({error: "non-existing todo"})
  }

  todo.title = title;
  todo.deadline = deadline;

  return response.status(200).json(todo);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const user = request.user;

  const todo = user.todos.find(todo => todo.id == id)

  if (!todo) {
    return response.status(404).json({error: "non-existing todo"})
  }

  todo.done = true

  return response.status(200).json(todo);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const user = request.user;
  const {id} = request.params;

  const todo = user.todos.some(todo => todo.id == id);
  
  if (!todo) {
    return response.status(404).json({error: "non-existing todo"})
  }
  
  const todos = user.todos.filter(todo => todo.id != id);
  user.todos = todos;

  return response.status(204).send();
});

module.exports = app;