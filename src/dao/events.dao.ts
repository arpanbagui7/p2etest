import { IEvent } from "../interfaces/event.interface";
import prisma from "../services/prisma.service";

const EventDao = {
  getEvents: async (startDateTime: string, endDateTime: string) => {
    try {
      const events = await prisma.event.findMany({
        where: {
          AND: [
            {
              eventStartTime: {
                gte: startDateTime,
              },
            },
            {
              eventEndTime: {
                lte: endDateTime,
              },
            },
          ],
        },
        orderBy: {
          slotNumber: "asc",
        },
      });
      return events;
    } catch (error) {
      throw error;
    }
  },

  createEvent: async (data: IEvent) => {
    try {
      const event = await prisma.event.create({
        data: data,
      });
      return event;
    } catch (error) {
      throw error;
    }
  },
};

export default EventDao;
