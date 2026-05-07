import type { RequestHandler } from 'express';
import { UnauthorizedError } from '../../errors/domainError';
import { Advert } from '../../models/Advert';
import { getAdvertsQueryValidator } from './AdvertInputValidator';
import { mapAdvertToResponse } from './advertResponseMapper';

export const getMyAdvertsController: RequestHandler = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new UnauthorizedError('Usuario no autenticado');
        }

        const { limit, page } = getAdvertsQueryValidator.parse(req.query);

        const skip = (page - 1) * limit;

        const searchQuery = {
            ownerId: req.user.id,
        };

        const [advertList, totalAdverts] = await Promise.all([
            Advert.find(searchQuery)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('ownerId', 'username'),
            Advert.countDocuments(searchQuery),
        ]);

        res.status(200).json({
            content: advertList.map((advert) => mapAdvertToResponse(advert)),
            total: totalAdverts,
            page,
            limit,
        });
    } catch (error) {
        next(error);
    }
};
