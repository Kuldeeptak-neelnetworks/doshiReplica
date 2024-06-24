import React, { useState, useRef } from "react";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";

const PageSizePopover = ({ tableInstance }) => {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);

  const { setPageSize } = tableInstance;

  const handleClick = (event) => {
    setShow(!show);
    setTarget(event.target);
  };
  return (
    <div ref={ref} className="header-popover">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <path
          fill="currentColor"
          d="M10 6L8.59 7.41L13.17 12l-4.58 4.59L10 18l6-6z"
        />
      </svg>

      <Overlay
        show={show}
        target={target}
        placement="top"
        container={ref}
        containerPadding={20}
        rootClose={true}
        rootCloseEvent={"click"}
        onHide={() => setShow(!show)}
        bsPrefix="header-popover width-100"
      >
        <Popover id="popover-contained">
          <Popover.Header className="border-none" as="h3">
            <div className="d-flex flex-column justify-content-start align-items-center gap-1 cursor-pointer">
              {/* <span
                onClick={() => {
                  setShow(!show);
                  setPageSize(5);
                }}
                className="header-text bottom-border"
              >
                5 rows
              </span> */}
              <span
                onClick={() => {
                  setShow(!show);
                  setPageSize(10);
                }}
                className="header-text bottom-border"
              >
                10 rows
              </span>
              <span
                onClick={() => {
                  setShow(!show);
                  setPageSize(50);
                }}
                className="header-text bottom-border"
              >
                50 rows
              </span>
              <span
                onClick={() => {
                  setShow(!show);
                  setPageSize(100);
                }}
                className="header-text bottom-border"
              >
                100 rows
              </span>
            </div>
          </Popover.Header>
        </Popover>
      </Overlay>
    </div>
  );
};

export default PageSizePopover;
