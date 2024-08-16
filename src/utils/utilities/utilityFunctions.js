import { ReactHotToast } from "../../Components/ReactHotToast/ReactHotToast";
import { nnAPIKey } from "../../Context/ApiContext/ApiContext";

// token
const getToken = () => {
  const token = localStorage.getItem("token");
  const bearer = "Bearer " + token;
  const newBearer = bearer.replace(/['"]+/g, "");
  return newBearer;
};

// api headers
export const headerOptions = () => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  NN_Api_key: nnAPIKey,
  Authorization: getToken(),
});

// error handling in api's
export const handleAPIError = (e, logoutCB) =>
  Array.isArray(e?.response?.data?.message)
    ? e?.response?.data?.message
        ?.map((e) => Object.values(e))
        .flatMap((e) => {
          if (Array.isArray(e)) {
            e.map((error) => ReactHotToast(error, "error"));
          } else {
            ReactHotToast(e, "error");
          }
        })
    : e?.response?.data?.status === 403
    ? logoutCB()
    : ReactHotToast(e?.response?.data?.message, "error");

// Only users with members role with status Active & not in any team
export const onlyActiveMembersNotInATeam = (membersList) => {
  return membersList
    ?.filter(
      (member) =>
        member.member_role === "members" && member.is_added_in_team !== "1"
    )
    .map((member) => ({
      label: member.member_name,
      value: member.member_id,
    }));
};

// Checking if num is above 10 or not, if not then making it as string and adding 0 ahead.
export const isGreaterThan10 = (input) => (input >= 10 ? input : `0${input}`);

// helper function for Formatting a Date into yyyy-mm-dd format
export const formatDateToYYYYMMDD = (inputDate) => {
  const date = new Date(inputDate);
  const dd = isGreaterThan10(date.getDate());
  const mm = isGreaterThan10(date.getMonth() + 1);
  const yyyy = date.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

// helper function for calculating percentage
export const percentageCalculator = (percentage, totalValue) =>
  (percentage * totalValue) / 100;

// calculate discount applied
export const calculateDiscountApplied = (invoiceDetails) => {
  const result =
    invoiceDetails?.discountAs === "flat_rate"
      ? invoiceDetails?.discount === ""
        ? 0
        : invoiceDetails?.discount
      : percentageCalculator(
          +invoiceDetails?.discount,
          +invoiceDetails?.totalCost
        );

  return isNaN(result) ? 0 : result;
};

// helper function for Formatting a Date => eg: 23rd Sept 2023
export function formatDate(inputDate) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const [year, month, day] = inputDate.split("-");
  const monthName = months[parseInt(month, 10) - 1];

  // Add suffix to the day
  let daySuffix = "th";
  if (day === "01" || day === "21" || day === "31") {
    daySuffix = "st";
  } else if (day === "02" || day === "22") {
    daySuffix = "nd";
  } else if (day === "03" || day === "23") {
    daySuffix = "rd";
  }

  const formattedDate = `${parseInt(day, 10)}${daySuffix} ${monthName} ${year}`;
  return formattedDate;
}

export const presentDate = () => {
  const presentDate = new Date();
  const date = presentDate.getDate();
  const month = presentDate.getMonth() + 1;
  const year = presentDate.getFullYear();
  return new Date(`${year}-${month}-${date}`);
};

export function formatDateTime(input) {
  const date = new Date(input);

  // Format the date
  const day = date.getDate();
  const monthAbbreviation = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  const formattedDate = `${day}${getDaySuffix(
    day
  )} ${monthAbbreviation} ${year}`;

  // Format the time
  const formattedTime = date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${formattedDate}, ${formattedTime}`;
}

export function getDaySuffix(day) {
  if (day >= 11 && day <= 13) {
    return "th";
  }

  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export function formatTime(input) {
  // Parse the input string
  const [hours, minutes, seconds] = input.split(":").map(Number);

  // Format the output
  let formattedTime = "";
  if (hours > 0 && minutes > 0) {
    formattedTime = `${hours} hours & ${minutes} mins`;
  } else if (hours > 0) {
    formattedTime = `${hours} hours`;
  } else if (minutes > 0) {
    formattedTime = `${minutes} mins`;
  } else {
    formattedTime = "";
  }

  return formattedTime;
}

export const timeOptions = [
  { label: "12:00 AM", value: "00:00:00" },
  { label: "12:15 AM", value: "00:15:00" },
  { label: "12:30 AM", value: "00:30:00" },
  { label: "12:45 AM", value: "00:45:00" },
  { label: "01:00 AM", value: "01:00:00" },
  { label: "01:15 AM", value: "01:15:00" },
  { label: "01:30 AM", value: "01:30:00" },
  { label: "01:45 AM", value: "01:45:00" },
  { label: "02:00 AM", value: "02:00:00" },
  { label: "02:15 AM", value: "02:15:00" },
  { label: "02:30 AM", value: "02:30:00" },
  { label: "02:45 AM", value: "02:45:00" },
  { label: "03:00 AM", value: "03:00:00" },
  { label: "03:15 AM", value: "03:15:00" },
  { label: "03:30 AM", value: "03:30:00" },
  { label: "03:45 AM", value: "03:45:00" },
  { label: "04:00 AM", value: "04:00:00" },
  { label: "04:15 AM", value: "04:15:00" },
  { label: "04:30 AM", value: "04:30:00" },
  { label: "04:45 AM", value: "04:45:00" },
  { label: "05:00 AM", value: "05:00:00" },
  { label: "05:15 AM", value: "05:15:00" },
  { label: "05:30 AM", value: "05:30:00" },
  { label: "05:45 AM", value: "05:45:00" },
  { label: "06:00 AM", value: "06:00:00" },
  { label: "06:15 AM", value: "06:15:00" },
  { label: "06:30 AM", value: "06:30:00" },
  { label: "06:45 AM", value: "06:45:00" },
  { label: "07:00 AM", value: "07:00:00" },
  { label: "07:15 AM", value: "07:15:00" },
  { label: "07:30 AM", value: "07:30:00" },
  { label: "07:45 AM", value: "07:45:00" },
  { label: "08:00 AM", value: "08:00:00" },
  { label: "08:15 AM", value: "08:15:00" },
  { label: "08:30 AM", value: "08:30:00" },
  { label: "08:45 AM", value: "08:45:00" },
  { label: "09:00 AM", value: "09:00:00" },
  { label: "09:15 AM", value: "09:15:00" },
  { label: "09:30 AM", value: "09:30:00" },
  { label: "09:45 AM", value: "09:45:00" },
  { label: "10:00 AM", value: "10:00:00" },
  { label: "10:15 AM", value: "10:15:00" },
  { label: "10:30 AM", value: "10:30:00" },
  { label: "10:45 AM", value: "10:45:00" },
  { label: "11:00 AM", value: "11:00:00" },
  { label: "11:15 AM", value: "11:15:00" },
  { label: "11:30 AM", value: "11:30:00" },
  { label: "11:45 AM", value: "11:45:00" },
  { label: "12:00 PM", value: "12:00:00" },
  { label: "12:15 PM", value: "12:15:00" },
  { label: "12:30 PM", value: "12:30:00" },
  { label: "12:45 PM", value: "12:45:00" },
  { label: "01:00 PM", value: "13:00:00" },
  { label: "01:15 PM", value: "13:15:00" },
  { label: "01:30 PM", value: "13:30:00" },
  { label: "01:45 PM", value: "13:45:00" },
  { label: "02:00 PM", value: "14:00:00" },
  { label: "02:15 PM", value: "14:15:00" },
  { label: "02:30 PM", value: "14:30:00" },
  { label: "02:45 PM", value: "14:45:00" },
  { label: "03:00 PM", value: "15:00:00" },
  { label: "03:15 PM", value: "15:15:00" },
  { label: "03:30 PM", value: "15:30:00" },
  { label: "03:45 PM", value: "15:45:00" },
  { label: "04:00 PM", value: "16:00:00" },
  { label: "04:15 PM", value: "16:15:00" },
  { label: "04:30 PM", value: "16:30:00" },
  { label: "04:45 PM", value: "16:45:00" },
  { label: "05:00 PM", value: "17:00:00" },
  { label: "05:15 PM", value: "17:15:00" },
  { label: "05:30 PM", value: "17:30:00" },
  { label: "05:45 PM", value: "17:45:00" },
  { label: "06:00 PM", value: "18:00:00" },
  { label: "06:15 PM", value: "18:15:00" },
  { label: "06:30 PM", value: "18:30:00" },
  { label: "06:45 PM", value: "18:45:00" },
  { label: "07:00 PM", value: "19:00:00" },
  { label: "07:15 PM", value: "19:15:00" },
  { label: "07:30 PM", value: "19:30:00" },
  { label: "07:45 PM", value: "19:45:00" },
  { label: "08:00 PM", value: "20:00:00" },
  { label: "08:15 PM", value: "20:15:00" },
  { label: "08:30 PM", value: "20:30:00" },
  { label: "08:45 PM", value: "20:45:00" },
  { label: "09:00 PM", value: "21:00:00" },
  { label: "09:15 PM", value: "21:15:00" },
  { label: "09:30 PM", value: "21:30:00" },
  { label: "09:45 PM", value: "21:45:00" },
  { label: "10:00 PM", value: "22:00:00" },
  { label: "10:15 PM", value: "22:15:00" },
  { label: "10:30 PM", value: "22:30:00" },
  { label: "10:45 PM", value: "22:45:00" },
  { label: "11:00 PM", value: "23:00:00" },
  { label: "11:15 PM", value: "23:15:00" },
  { label: "11:30 PM", value: "23:30:00" },
  { label: "11:45 PM", value: "23:45:00" },
];
export const getTime = (time) => {
  const result = timeOptions.find(({ value }) => value === time);
  return result?.label;
};

export const getTwelveHoursTime = (time) => {
  // Convert 24-hour time to 12-hour format
  const [hours, minutes] = time?.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = (hours % 12 || 12).toString().padStart(2, "0");

  return `${hours12}:${minutes.toString().padStart(2, "0")}${period}`;
};


export const isTrue = (input) => {
  return Boolean(input?.trim());
};

export const userRole = (role) => {
  switch (role) {
    case "team_leaders,members":
      return "Team Leader";
    case "it_member":
      return "IT Member";
    case "operation_member":
      return "Operation Member";
      case "members,team_sub_leader":
        return "Sub Team Leader"
    default:
      return "Member";
  }
};
