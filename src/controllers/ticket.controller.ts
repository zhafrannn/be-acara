import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import TicketModel, { ticketDAO, TypeTicket } from "../models/ticket.model";
import { FilterQuery, isValidObjectId } from "mongoose";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      await ticketDAO.validate(req.body);
      const result = await TicketModel.create(req.body);
      response.success(res, result, "success create a ticket");
    } catch (error) {
      response.error(res, error, "failed create ticket");
    }
  },
  async findAll(req: IReqUser, res: Response) {
    const {
      limit = 10,
      page = 1,
      search,
    } = req.query as unknown as IPaginationQuery;

    const query: FilterQuery<TypeTicket> = {};

    if (search) {
      Object.assign(query, {
        ...query,
        $text: {
          $search: search,
        },
      });
    }

    const result = await TicketModel.find(query)
      .populate("events")
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .exec();

    const count = await TicketModel.countDocuments(query);

    response.pagination(
      res,
      result,
      {
        total: count,
        current: page,
        totalPages: Math.ceil(count / limit),
      },
      "success find all tickets"
    );

    try {
    } catch (error) {
      response.error(res, error, "failed find all tickets");
    }
  },
  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await TicketModel.findById(id);
      response.success(res, result, "success find one ticket");
    } catch (error) {
      response.error(res, error, "failed find ticket");
    }
  },
  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await TicketModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      response.success(res, result, "success find one ticket");
    } catch (error) {
      response.error(res, error, "failed update ticket");
    }
  },
  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await TicketModel.findByIdAndDelete(id, {
        new: true,
      });
      response.success(res, result, "success remove one ticket");
    } catch (error) {
      response.error(res, error, "failed remove ticket");
    }
  },
  async findAllByEvent(req: IReqUser, res: Response) {
    try {
      const { eventId } = req.params;

      // function mongoose untuk cek apakah id valid
      if (!isValidObjectId(eventId)) {
        return response.error(res, null, "invalid event id");
      }

      const result = await TicketModel.find({ events: eventId }).exec();
      response.success(res, result, "success find all tickets by event");
    } catch (error) {
      response.error(res, error, "failed find all tickets by event");
    }
  },
};
