import express from "express";
import EventService from "../services/event.service";
import EventValidation from "../validators/event.validator";

const router = express.Router();

router
  .route("/")
  .get(EventValidation.getEventsValidation, EventService.getEvents)
  .post(EventValidation.createEventValidation, EventService.createEvent);
router.route("/slots").get(EventValidation.getSlotsValidation, EventService.getSlots);

export default router;
