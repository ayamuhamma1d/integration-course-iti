import React, { useEffect, useRef, useState } from "react";
import { server } from "../assets/config/axios.config";
import "../App.css";
const Todolist = () => {
  const [todos, setTodos] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef();
  const searchFn = (e) => {
    e.preventDefault();
    setSearchTerm(inputRef.current.value.trim());
  };
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      server.get(`/todos/?q=${searchTerm}`).then((res) => {
        setTodos(res.data);
      });
    }, 2000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);
  const handleChange = (e) => {
    setTaskName(e.target.value);
  };

  const handleDelete = (id) => {
    server.delete(`/todos/${id}`).then(() => {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    });
  };
  const handleEdit = (todo) => {
    setEditingTodoId(todo.id);
    setTaskName(todo.taskName);
  };

  const handleDone = (todo) => {
    server.put(`/todos/${todo.id}`, { ...todo, isCompleted: true }).then(() => {
      setTodos((prevTodos) =>
        prevTodos.map((item) =>
          item.id === todo.id ? { ...item, isCompleted: true } : item
        )
      );
    });
  };

  const addTask = async (e) => {
    e.preventDefault();

    if (editingTodoId) {
      server.patch(`/todos/${editingTodoId}`, { taskName }).then((response) => {
        if (response.status === 200) {
          setEditingTodoId(null);
          setTaskName("");
          todolist();
        }
      });
    } else {
      server
        .post("/todos", {
          taskName,
          isCompleted: false,
        })
        .then((response) => {
          if (response.status === 201) {
            setTaskName("");
            todolist();
          }
        });
    }
  };
  const todolist = () => {
    server.get("/todos").then((data) => {
      setTodos(data.data);
    });
  };
  useEffect(() => {
    todolist();
  }, []);
  return (
    <div className="todolist">
      <div className="search">
        <input
          type="text"
          placeholder="Search ex: todo 1"
          ref={inputRef}
          onChange={searchFn}
        />
      </div>
      <form className="addTask" onSubmit={addTask}>
        <input
          id="taskInput"
          type="text"
          value={taskName}
          onChange={handleChange}
          placeholder="Add a task........"
        />
        <button className="addtask-btn" type="submit">
          {editingTodoId ? "Update Task" : "Add Task"}
        </button>
      </form>
      <div className="lists">
        {todos?.map((todo) => (
          <div
            key={todo.id}
            className={`list ${todo.isCompleted ? "completed" : ""}`}
          >
            <p>{todo.taskName}</p>
            <div className="span-btns">
              {!todo.isCompleted && (
                <span onClick={() => handleDone(todo)} title="completed">
                  ✓
                </span>
              )}
              <span
                className="delete-btn"
                onClick={() => handleDelete(todo.id)}
                title="delete"
              >
                x
              </span>
              <span
                className="edit-btn"
                onClick={() => handleEdit(todo)}
                title="edit"
              >
                ↻
              </span>
            </div>
          </div>
        ))}
        {!todos?.length && <h1>No Records</h1>}
      </div>
    </div>
  );
};

export default Todolist;

