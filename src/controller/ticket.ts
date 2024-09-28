import { Request, Response } from 'express';
import { ErrorsConstants } from '../utils/constants/errors';
import InternalServerError from '../utils/errors/internalServerError';
import logger from '../utils/logger';
import SuccessResponse from '../utils/response/successResponse';
import { prisma } from '../utils/prisma';
import BaseResponse, { ErrorResponse, Message } from '../utils/response';
import { ApiResponse } from '../utils/types';
import { STANDARD } from '../utils/constants';
import AuthorizationError from '../utils/errors/authorizationError';

enum PaymentOption {
  YES = 'YES',
  NO = 'NO',
}

interface MatchBet {
  firstTeam: string;
  secondTeam: string;
  matchDate: string;
  option: string;
}

interface BetTicket {
  paid: PaymentOption;
  amount: number;
  bets: MatchBet[];
}

interface ITicketPay {
  ticketId: string;
  amount: number;
  hash: string;
}

interface TicketResponses {
  id: string;
  address: string;
  rating: number;
  totalMatch: number;
  activeMatch: number;
  paid: string;
  price: number;
}

export class TicketApiController {
  public async createOrFetchUser(
    req: Request | any,
    res: Response,
  ): Promise<ApiResponse<void>> {
    try {
      const body: BetTicket = req.body;

      const ticket = await prisma.betTicket.create({
        data: {
          userPublicKey: req.id,
          paid: body.paid,
          price: body.amount,
          bets: {
            create: body.bets,
          },
        },
      });
      if (!ticket) throw new Error(Message.INTERNAL_ERROR);

      const response = new SuccessResponse('Ticked created', STANDARD.CREATED);

      return res.send(response);
    } catch (error) {
      logger.error(error);
      res
        .status(ErrorsConstants.internal_error_status)
        .send(new InternalServerError());
    }
  }

  public async fetchAllTickets(
    req: Request | any,
    res: Response,
  ): Promise<ApiResponse<void>> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const offset = (page - 1) * limit;

      const tickets = await prisma.betTicket.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          rating: 'desc',
        },
      });

      if (!tickets) {
        throw new Error(Message.INTERNAL_ERROR);
      }

      const totalTickets = await prisma.betTicket.count();
      const ticketResponses: Array<TicketResponses> = [];
      const now = new Date();

      for (const ticket of tickets) {
        console.log(ticket);
        const bets = await prisma.matchBet.findMany({
          where: { ticketId: ticket.id },
        });

        if (!bets || bets.length === 0) continue;

        const activeMatches = bets.filter(
          (bet) => now <= new Date(bet.matchDate),
        ).length;

        if (activeMatches < 1) continue;

        const ticketResponse: TicketResponses = {
          id: ticket.id,
          rating: ticket.rating,
          address: ticket.userPublicKey,
          totalMatch: bets.length,
          activeMatch: activeMatches,
          paid: ticket.paid,
          price: ticket.price,
        };

        ticketResponses.push(ticketResponse);
      }

      const responseData = {
        page,
        totalPages: Math.ceil(totalTickets / limit),
        totalTickets,
        tickets: ticketResponses,
      };

      const response = new SuccessResponse(
        'Tickets fetched successfully',
        STANDARD.SUCCESS,
        responseData,
      );
      return res.send(response);
    } catch (error) {
      logger.error(error);

      if (!res.headersSent) {
        return res
          .status(ErrorsConstants.internal_error_status)
          .send(new InternalServerError());
      }
    }
  }

  public async FetchTicket(
    req: Request | any,
    res: Response,
  ): Promise<ApiResponse<void>> {
    try {
      const currentUser = req.id;
      const ticketId = req.params.ticketId;
      console.log(ticketId);
      const checkPayedUser = await prisma.ticketPay.findFirst({
        where: { ticketId: ticketId, userPublicKey: currentUser },
      });
      if (!checkPayedUser) {
        return res
          .status(ErrorsConstants.internal_error_status)
          .send(new AuthorizationError(Message.UNATHOURISED));
      }
      const fetchTicket = await prisma.betTicket.findFirst({
        where: { id: checkPayedUser.ticketId },
        include: { bets: true },
      });
      if (!fetchTicket) throw new Error(Message.INTERNAL_ERROR);
      return res.send(fetchTicket);
    } catch (error) {
      logger.error(error);

      if (!res.headersSent) {
        return res
          .status(ErrorsConstants.internal_error_status)
          .send(new InternalServerError());
      }
    }
  }

  public async ticketPay(
    req: Request | any,
    res: Response,
  ): Promise<ApiResponse<void>> {
    try {
      const currentUser = req.id;
      const body: ITicketPay = req.body;

      const findTicktet = await prisma.betTicket.findFirst({
        where: { id: body.ticketId },
      });
      if (!findTicktet) throw new Error(Message.TICKET_NOT_FOUND);

      if (Number(body.amount) < findTicktet.price) {
        return res
          .status(ErrorsConstants.internal_error_status)
          .send(new ErrorResponse(Message.INVALID_AMOUNT, 409, 'error'));
      }

      const createPayment = await prisma.ticketPay.create({
        data: {
          userPublicKey: currentUser,
          ticketId: body.ticketId,
          payedToAddress: findTicktet.userPublicKey,
          amount: Number(body.amount),
          hash: body.hash,
        },
      });

      if (!createPayment) throw new Error(Message.INTERNAL_ERROR);
      const response = new SuccessResponse(
        'payment successfull',
        STANDARD.CREATED,
      );
      return res.send(response);
    } catch (error) {
      if (!res.headersSent) {
        return res
          .status(ErrorsConstants.internal_error_status)
          .send(new InternalServerError());
      }
    }
  }
}
