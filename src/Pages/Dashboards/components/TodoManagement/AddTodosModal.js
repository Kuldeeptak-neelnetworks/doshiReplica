import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import { ReactHotToast } from "../../../../Components/ReactHotToast/ReactHotToast";

const MyVerticallyCenteredModal = (props) => {
  const [todoName, setTodoName] = useState("");

  // Function for Creating a new Todo
  const addNewTodo = () => {
    const newTodo = { id: Date.now(), name: todoName };
    localStorage.setItem(
      "todosList",
      JSON.stringify([...props.todos, newTodo])
    );
    props.setTodos((prev) => ({
      ...prev,
      todosList: [...prev.todosList, newTodo],
      isUpdated: !prev.isUpdated,
    }));
    setTodoName(() => "");
    props.onHide();
  };

  const handleAddNewTodo = (e) => {
    e.preventDefault();
    if (todoName) {
      addNewTodo();
    } else {
      ReactHotToast("Please enter Todo name!", "error");
    }
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="pt-3 pb-1" closeButton>
        <Modal.Title className="w-100" id="contained-modal-title-vcenter">
          <div className="d-flex justify-content-center align-items-center gap-3">
            <span className="modal-title">Add New Todo</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <form
          onSubmit={handleAddNewTodo}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <div className="form-group mt-2 w-100">
            <label htmlFor="todoName">Todo Name:</label>
            <input
              id="todoName"
              name="todoName"
              placeholder="Eg: Create Taxation Reports"
              type="text"
              required
              value={todoName}
              onChange={(e) => setTodoName(e.target.value)}
            />
          </div>

          <button type="submit" className="custom-btn mt-4">
            Add Todo
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export const AddTodosModal = ({ setTodos, todos }) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          setModalShow(true);
        }}
      >
        <button className="custom-btn d-flex justify-content-center align-items-center gap-2">
          Add <span className="fw-light fs-4">+</span>
        </button>
      </div>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        setTodos={setTodos}
        todos={todos}
      />
    </>
  );
};
