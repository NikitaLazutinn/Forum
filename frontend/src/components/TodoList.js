import React, { useEffect, useState } from 'react';
import { fetchTodos } from '../services/api';

export default function TodoList() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetchTodos(token)
      .then(res => setTodos(res.data))
      .catch(() => alert('Could not fetch todos'));
  }, []);

  return (
    <div>
      <h2>Your Todos</h2>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}