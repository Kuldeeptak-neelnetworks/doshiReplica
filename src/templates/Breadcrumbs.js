import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useNavigate } from "react-router-dom";

function Breadcrumbs({ crumbs }) {
  const navigate = useNavigate();
  return (
    <Breadcrumb>
      {crumbs?.map((crumb, index) => (
        <Breadcrumb.Item
          key={index}
          onClick={() =>
            crumbs.length - 1 === index ? "" : navigate(crumb.pageURL)
          }
          active={crumbs.length - 1 === index ? true : false}
        >
          {crumb.pageName}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}

export default Breadcrumbs;
