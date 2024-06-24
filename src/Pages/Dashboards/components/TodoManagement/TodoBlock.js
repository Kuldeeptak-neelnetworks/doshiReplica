import React, { useEffect, useState } from "react";
import { AddTodosModal } from "./AddTodosModal";
import { Tooltip } from "react-tooltip";
import { DeleteTodoModal } from "./DeleteTodoModal";
import { EditTodoModal } from "./EditTodoModal";

const TodoBlock = () => {
  const [todos, setTodos] = useState({
    todosList: [],
    isUpdated: false,
  });

  if (!localStorage.getItem("todosList")) {
    localStorage.setItem("todosList", JSON.stringify(todos.todosList));
  }

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("todosList"));
    if (todos.length > 0) {
      setTodos((prev) => ({ ...prev, todosList: [...todos] }));
    }
  }, [todos.isUpdated]);

  const returnNum = (num) => (num > 10 ? num : `0${num}`);

  return (
    <div className="dashboard-block d-flex flex-1 flex-column  align-items-center gap-1">
      <div className="block-header d-flex justify-content-between align-items-center w-100">
        <p className="block-title m-0">To Do List</p>
        <AddTodosModal setTodos={setTodos} todos={todos.todosList} />
      </div>
      <div className="block-content w-100 mt-1">
        {todos.todosList.length > 0 ? (
          todos.todosList.map((todo, index) => (
            <div
              key={index}
              className="content-wrapper d-flex justify-content-between align-items-center w-100 px-4"
            >
              <div className="flex-1 content">{returnNum(index + 1)}</div>
              <div className="flex-2 justify-self-start content">
                {todo.name}
              </div>
              <div className="flex-1 d-flex justify-content-end content gap-2">
                <Tooltip
                  id="edit-todo-tooltip"
                  style={{
                    background: "#000",
                    color: "#fff",
                  }}
                  opacity={0.9}
                />
                <div
                  data-tooltip-id="edit-todo-tooltip"
                  data-tooltip-content="Edit Todo"
                  data-tooltip-place="top"
                >
                  <EditTodoModal
                    setTodos={setTodos}
                    todo={todo}
                    todos={todos.todosList}
                  />
                </div>
                <Tooltip
                  id="delete-todo-tooltip"
                  style={{
                    background: "#000",
                    color: "#fff",
                  }}
                  opacity={0.9}
                />
                <div
                  data-tooltip-id="delete-todo-tooltip"
                  data-tooltip-content="Delete todo"
                  data-tooltip-place="top"
                >
                  <DeleteTodoModal
                    todo={todo}
                    setTodos={setTodos}
                    todos={todos.todosList}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="content m-0 py-1">No Todos found</p>
        )}
      </div>
    </div>
  );
};

export default TodoBlock;
