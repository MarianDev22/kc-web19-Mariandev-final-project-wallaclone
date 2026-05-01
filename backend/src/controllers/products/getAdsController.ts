import { Request, Response, NextFunction } from 'express';
import { QueryFilter } from 'mongoose';
import { Advert } from '../../models/Advert';
import { escapeRegex } from '../../utils/stringUtils';
import { getAdvertsQueryValidator } from './AdvertInputValidator';

export const getAdsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, minPrice, maxPrice, tag, limit, page } = getAdvertsQueryValidator.parse(
      req.query
    );

    const skip = (page - 1) * limit;

    const searchQuery: QueryFilter<Advert> = {
      status: { $in: ['AVAILABLE', 'RESERVED', 'SOLD'] },
    };

    if (name) {
      searchQuery.name = { $regex: escapeRegex(name), $options: 'i' };
    }

    if (tag) {
      searchQuery.tags = tag;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      searchQuery.price = {};
      if (minPrice !== undefined) searchQuery.price.$gte = minPrice;
      if (maxPrice !== undefined) searchQuery.price.$lte = maxPrice;
    }

    const advertList = await Advert.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('ownerId', 'username');

    const totalAdverts = await Advert.countDocuments(searchQuery);

    res.status(200).json({
      content: advertList,
      total: totalAdverts,
      page,
      limit,
    });
  } catch (error) {
    next(error);
  }
};
