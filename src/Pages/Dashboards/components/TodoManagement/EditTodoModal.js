import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import { EditSVG } from "../../../../utils/ImportingImages/ImportingImages";
import { ReactHotToast } from "../../../../Components/ReactHotToast/ReactHotToast";

const MyVerticallyCenteredModal = (props) => {
  const [todoName, setTodoName] = useState(props.todo.name);

  // Function for Creating a new Todo
  const editTodo = () => {
    const updatedTodoList = props.todos.map((todo) =>
      todo.id === props.todo.id ? { id: props.todo.id, name: todoName } : todo
    );
    localStorage.setItem("todosList", JSON.stringify([...updatedTodoList]));

    props.setTodos((prev) => ({
      ...prev,
      todosList: prev.todosList.map((todo) =>
        todo.id === props.todo.id ? { id: props.todo.id, name: todoName } : todo
      ),
      isUpdated: !prev.isUpdated,
    }));
    setTodoName(() => "");
    props.onHide();
  };

  const handleEditTodo = (e) => {
    e.preventDefault();
    if (todoName) {
      editTodo();
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
            <span className="modal-title">Edit Todo</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <form
          onSubmit={handleEditTodo}
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
            Update
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export const EditTodoModal = ({ setTodos, todo, todos }) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          setModalShow(true);
        }}
      >
        <EditSVG />
      </div>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        setTodos={setTodos}
        todo={todo}
        todos={todos}
      />
    </>
  );
};
