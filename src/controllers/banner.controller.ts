import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import { FilterQuery } from "mongoose";
import BannerModel, { bannerDAO, TypeBanner } from "../models/banner.model";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      await bannerDAO.validate(req.body);
      const result = await BannerModel.create(req.body);
      response.success(res, result, "success create a banner");
    } catch (error) {
      response.error(res, error, "failed create banner");
    }
  },
  async findAll(req: IReqUser, res: Response) {
    const {
      limit = 10,
      page = 1,
      search,
    } = req.query as unknown as IPaginationQuery;

    const query: FilterQuery<TypeBanner> = {};

    if (search) {
      Object.assign(query, {
        ...query,
        $text: {
          $search: search,
        },
      });
    }

    const result = await BannerModel.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .exec();

    const count = await BannerModel.countDocuments(query);

    response.pagination(
      res,
      result,
      {
        total: count,
        current: page,
        totalPages: Math.ceil(count / limit),
      },
      "success find all banners"
    );

    try {
    } catch (error) {
      response.error(res, error, "failed find all banners");
    }
  },
  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await BannerModel.findById(id);
      response.success(res, result, "success find one banner");
    } catch (error) {
      response.error(res, error, "failed find banner");
    }
  },
  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await BannerModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      response.success(res, result, "success find one banner");
    } catch (error) {
      response.error(res, error, "failed update banner");
    }
  },
  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await BannerModel.findByIdAndDelete(id, {
        new: true,
      });
      response.success(res, result, "success remove one banner");
    } catch (error) {
      response.error(res, error, "failed remove banner");
    }
  },
};
