const ACTION_DB = {
  NO_ACTION: 0,
  UPDATE_TEMPERATURE_THRESHOLD: 1, // Control by web
  UPDATE_HUMIDITY_THRESHOLD: 2, // Control by web
  OPEN_GATE: 3, // Control by check-in gate
  CLOSE_GATE: 4, // Control by check-out gate
  WIFI_SETUP: 5, //wifi setup
  RESET_HARDWARE: 11, // Reset hardware
};

const STATUS_UPDATE_THRESHOLD = {
  NO_UPDATE: 0,
  WAITTING: 1,
  UPDATED: 0,
};

const UNCHECKED_QR = 255;

const COLUMS_TABLE_AT_HOME = [
  {
    title: "Key",
    dataIndex: "key",
    rowScope: "row",
  },
  {
    title: "Value",
    dataIndex: "value",
  },
];

const TIME_SEND_MAIL_MS = 5 * 60 * 1000;

const formatTime = (time) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const date = new Date(time);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${day} ${month} ${year} ${hour}:${minute}`;
};

export {
  ACTION_DB,
  UNCHECKED_QR,
  COLUMS_TABLE_AT_HOME,
  STATUS_UPDATE_THRESHOLD,
  TIME_SEND_MAIL_MS,
};
export { formatTime };
