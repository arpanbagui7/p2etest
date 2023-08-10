import dayjs from "dayjs";
import { body, query } from "express-validator";

const EventValidation = {
  createEventValidation: [
    body("eventStartDateTime")
      .notEmpty()
      .withMessage("eventStartDateTime is required")
      .isISO8601()
      .withMessage("expected eventStartDateTime format YYYY-MM-DDTHH:mm:ssZ"),
  ],
  getSlotsValidation: [
    query("date")
      .notEmpty()
      .withMessage("date is required")
      .isDate({ format: "YYYY-MM-DD" })
      .withMessage("expected date format YYYY-MM-DD"),
    query("timeZone")
      .optional()
      .isString()
      .withMessage("timeZone should be string"),
  ],
  getEventsValidation: [
    query("startDate")
      .notEmpty()
      .withMessage("startDate is required")
      .isDate({ format: "YYYY-MM-DD" })
      .withMessage("expected startDate format YYYY-MM-DD"),
    query("endDate")
      .notEmpty()
      .withMessage("endDate is required")
      .isDate({ format: "YYYY-MM-DD" })
      .withMessage("expected endDate format YYYY-MM-DD"),
  ],
};

export default EventValidation;
