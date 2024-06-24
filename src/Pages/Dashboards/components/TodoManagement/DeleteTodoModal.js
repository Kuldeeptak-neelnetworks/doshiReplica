import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import { TrashSVG } from "../../../../utils/ImportingImages/ImportingImages";
const MyVerticallyCenteredModal = (props) => {
  // Function for Deleting a todo
  const deleteTodo = () => {
    const updatedTodoList = props.todos.filter(
      (todo) => todo.id !== props.todo.id
    );
    localStorage.setItem("todosList", JSON.stringify([...updatedTodoList]));

    props.setTodos((prev) => ({
      ...prev,
      todosList: prev.todosList.filter((todo) => todo.id !== props.todo.id),
      isUpdated: !prev.isUpdated,
    }));
    props.onHide();
  };

  const handleDeleteTodo = (e) => {
    e.preventDefault();
    deleteTodo();
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
            <span className="modal-title">Delete Todo</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <form
          onSubmit={handleDeleteTodo}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <div className="form-group mt-2 w-100">
            <p className="text-center fs-5 w-100 m-auto">
              are you sure you want to delete {props?.todo?.name} todo?
            </p>
          </div>
          <button type="submit" className="custom-btn mt-4">
            Delete
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export const DeleteTodoModal = ({ todo, setTodos, todos }) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          setModalShow(true);
        }}
      >
        <TrashSVG />
      </div>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        todo={todo}
        setTodos={setTodos}
        todos={todos}
      />
    </>
  );
};
