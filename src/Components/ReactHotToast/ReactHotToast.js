import toast from "react-hot-toast";

export const ReactHotToast = (msg, variant) => {
  const options = {
    position: "top-center",
    duration: 2500,
  };

  switch (variant) {
    case "error":
      toast.error(msg, options);
      break;

    case "success":
      toast.success(msg, options);
      break;

    default:
      break;
  }
};
