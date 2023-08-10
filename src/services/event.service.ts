import { NextFunction, Request, Response } from "express";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { DateTime } from "luxon";
import { validationResult } from "express-validator";
import EventDao from "../dao/events.dao";
import eventConstant from "../constants/event.constant";
import { ResponseError, ResponseHandler } from "../utils/response";
import ValidationErrorHandler from "../utils/validationErrorHandler";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(eventConstant.defaultTimezone);

const EventService = {
  getSlots: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = validationResult(req).array({ onlyFirstError: true });
      if (result.length) {
        const error = ValidationErrorHandler(req, result[0]);
        throw error;
      }
      const { date, timeZone } = req.query as {
        date: string;
        timeZone: string;
      };
      let selectedTimeZone = eventConstant.defaultTimezone;
      switch (timeZone) {
        case "India":
          selectedTimeZone = "Asia/Kolkata";
          break;
        case "London":
          selectedTimeZone = "Europe/London";
          break;
        case "California":
          selectedTimeZone = "America/Los_Angeles";
          break;
        default:
          selectedTimeZone = eventConstant.defaultTimezone;
      }
      const startDateTime = dayjs
        .tz(date)
        .format(`YYYY-MM-DDT${eventConstant.startHour}Z`);
      const endDateTime = dayjs
        .tz(date)
        .format(`YYYY-MM-DDT${eventConstant.endHour}Z`);
      const events = await EventDao.getEvents(startDateTime, endDateTime);
      const bookedSlots = new Set(events.map((event) => event.slotNumber));
      const availableSlots = [];
      let slotTime = startDateTime;

      const totalSlots = Math.floor(
        dayjs.tz(endDateTime).diff(startDateTime, "minutes") /
          eventConstant.duration
      );
      for (let slot = 0; slot < totalSlots; slot++) {
        if (!bookedSlots.has(slot)) {
          availableSlots.push(
            DateTime.fromISO(slotTime, { zone: eventConstant.defaultTimezone })
              .setZone("Asia/Kolkata")
              .toISO()
          );
        }
        slotTime = dayjs
          .tz(slotTime)
          .add(eventConstant.duration, "minutes")
          .format("YYYY-MM-DDTHH:mm:ss");
      }
      res.json(ResponseHandler(200, null, { availableSlots }));
      next();
    } catch (error) {
      next(error);
    }
  },

  getEvents: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = validationResult(req).array({ onlyFirstError: true });
      if (result.length) {
        const error = ValidationErrorHandler(req, result[0]);
        throw error;
      }
      const { startDate, endDate } = req.query as {
        startDate: string;
        endDate: string;
      };
      if (dayjs.tz(startDate).isAfter(dayjs.tz(endDate))) {
        const error = ResponseError(
          400,
          "Bad Request",
          "startDate can not be greater than endDate"
        );
        throw error;
      }

      const events = await EventDao.getEvents(
        dayjs.tz(startDate).format(),
        dayjs.tz(endDate).endOf("day").format()
      );
      res.json(ResponseHandler(200, null, { events }));
      next();
    } catch (error) {
      next(error);
    }
  },

  createEvent: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = validationResult(req).array({ onlyFirstError: true });
      if (result.length) {
        const error = ValidationErrorHandler(req, result[0]);
        throw error;
      }
      const { eventStartDateTime } = req.body as { eventStartDateTime: string };
      const eventEndDateTime = dayjs
        .tz(eventStartDateTime)
        .add(eventConstant.duration, "minutes")
        .format("YYYY-MM-DDTHH:mm:ssZ");
      const startDateTime = dayjs
        .tz(eventStartDateTime)
        .format(`YYYY-MM-DDT${eventConstant.startHour}Z`);
      const endDateTime = dayjs
        .tz(eventEndDateTime)
        .format(`YYYY-MM-DDT${eventConstant.endHour}Z`);
      if (
        dayjs.tz(eventStartDateTime).isBefore(startDateTime, "minutes") ||
        dayjs.tz(eventEndDateTime).isAfter(endDateTime, "minutes")
      ) {
        const error = ResponseError(
          400,
          "Event can not be created",
          "Invalid event datetime selected"
        );
        throw error;
      }
      const existingEvents = await EventDao.getEvents(
        eventStartDateTime,
        eventEndDateTime
      );
      if (existingEvents.length) {
        const error = ResponseError(
          422,
          "Event can not be created",
          "Already event exists"
        );
        throw error;
      }

      const minsDiffFromStartHour = dayjs
        .tz(eventStartDateTime)
        .diff(startDateTime, "minutes");

      const slotNumber = Math.floor(
        minsDiffFromStartHour / eventConstant.duration
      );

      const event = await EventDao.createEvent({
        eventStartTime: eventStartDateTime,
        eventEndTime: eventEndDateTime,
        slotNumber,
      });
      res.json(ResponseHandler(200, null, { event }));
    } catch (error) {
      next(error);
    }
  },
};

export default EventService;
