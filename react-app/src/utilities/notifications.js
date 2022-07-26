import { notification } from "antd";

const showNotification = (
  message,
  type = "info",
  description = "",
  duration = 5,
  placement = "top"
) =>
  notification[type]({
    message,
    description,
    placement,
    duration,
  });

export default showNotification;
