
import axios from 'axios';
import { Request, Response } from 'express';
import APIGateway from '../utils/axios';
import { environment } from '../utils/config/environment';
import { STANDARD } from '../utils/constants';
import { ErrorsConstants } from '../utils/constants/errors';
import InternalServerError from '../utils/errors/internalServerError';
import logger from '../utils/logger';
import SuccessResponse from '../utils/response/successResponse';
import { ApiResponse } from '../utils/types';
import { LeagueResponse } from '../utils/types/sport.types';
import { addDays, formatDate } from '../utils/date';
import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(__dirname, 'leagues.json');
// import * as fixtures from "../static/fixtures.json"
// import { reqCaller } from '../utils/saveFIle';

interface IFixtures {
  league: number,
  matches: unknown[]
}


interface IFixturesRequest {
  country: string
  leagueId: number,
  name: string,
 }
 
 interface IFixtureRequest {
   data: IFixturesRequest []
 }

 interface ITeamsBody {
  fixtureId: string,
  league: string,
  contoury: string,
  teams: ITeam[]
 }

 interface ITeam {
  teamId: Number,
  teamName: string
 }

const { baseUrl, host, key } = environment.sportApi;

abstract class BaseSportApi extends APIGateway {
  constructor() {
    super(
      axios.create({
        baseURL: baseUrl,
        headers: {
          'x-rapidapi-host': host,
          'x-rapidapi-key': key,
        },
      }),
    );
  }
}



export class SportApiService extends BaseSportApi {
  constructor(){
    super()
  }
  public async getFixtures(): Promise<LeagueResponse> {
    const fileExists = await fs.stat(filePath).then(() => true).catch(() => false);
    
    if(fileExists) {
      const fileData = await fs.readFile(filePath, 'utf-8');
      console.log('Returning cached data');
      return JSON.parse(fileData) as LeagueResponse;
    } else {
      const route = 'leagues';
      const params = {
        current: true,
        season: new Date().getFullYear(),
      };

      const response = await this.request('GET', route, params);
      console.log(response);

      // Write the response data to a file
      await fs.writeFile(filePath, JSON.stringify(response.data), 'utf-8');
      // Return the data
      return response.data as LeagueResponse;
    }
  }

  public async getBetDexEvents(): Promise<{ eventCategories: Array<unknown> }> {
    const response = await fetch('https://prod.events.api.betdex.com/events', {
      method: 'GET',
    });

    const res = (await response.json()) as { eventCategories: Array<unknown> };

    return res;
  }

  public async getTeams(body: ITeamsBody): Promise<unknown> {
    const fixturePath = path.join(__dirname, `fixtures-${body.fixtureId}.json`);
    const route = 'teams/statistics';
    const date = new Date().getFullYear();
    
    // Create a helper function for fetching team statistics
    const fileExists = await fs.stat(fixturePath).then(() => true).catch(() => false);
    
    // If the file exists, read and parse its content
    if (fileExists) {
        const fileContent = await fs.readFile(fixturePath, 'utf-8');
        return JSON.parse(fileContent) as LeagueResponse; // Parse the file content
    }

    const fetchTeamStatistics = async (teamId: Number) => {
        const params = {
            league: body.league,
            season: date,
            team: teamId,
        };
        const teamsStats = await this.request('GET', route, params);
        return { teamsStats: teamsStats.data };
    };

    // Map all teams to their statistics in parallel using Promise.all
    const teamStaticsArray = await Promise.all(body.teams.map(team => fetchTeamStatistics(team.teamId)));

    // Fetch lineup data for the fixture
    const lineupFixtureRoute = 'fixtures/lineups';
    const lineUpParams = { 
        fixture: body.fixtureId
    };
    const teamLineUp = await this.request('GET', lineupFixtureRoute, lineUpParams);

    // Fetch head-to-head data between two teams
    const headToHeadRoute = 'fixtures/headtohead';
    const headToHeadParams = {
        h2h: `${body.teams[0].teamId}-${body.teams[1].teamId}`
    };
    const h2hResponse = await this.request('GET', headToHeadRoute, headToHeadParams);

    // Return the consolidated response
    const data = {
        statistics: teamStaticsArray,
        lineup: teamLineUp.data,
        head2head: h2hResponse.data,
    };

    // Save the data to the file
    await fs.writeFile(fixturePath, JSON.stringify(data), 'utf-8');

    return data;
}

  public async fetchHeadToHeadAnalysis(teamId1:string, teamId2:string):Promise<unknown>{
    const route = 'fixtures/headtohead'



    const params = {
      h2h: `${teamId1}-${teamId2}`,
      // last: 5,
      // season: date.getFullYear()
    }
    const response = await this.request('GET', route, params);
    return response.data
  }

  
  public async fetchOdd(req: Request):Promise<unknown>{
    const route = 'odds'

    
    const { fixtureId} = req.params;
    const params = {
      fixture: fixtureId,
      season: new Date().getFullYear()

    }
    const oddPath = path.join(__dirname, `odd-${fixtureId}.json`);

    const fileExists = await fs.stat(oddPath).then(() => true).catch(() => false);
    if (fileExists) {
      const fileContent = await fs.readFile(oddPath, 'utf-8');
      return JSON.parse(fileContent) as LeagueResponse; // Parse the file content
  } else {
   const response = await this.request('GET', route, params);
   await fs.writeFile(oddPath, JSON.stringify(response.data), 'utf-8');

    return response.data
  }
  }
  

  public async getTeamStatistics(team: string, league: string):Promise<unknown>{
    const route = 'teams/statistics'
    const date =  new Date()

    const params = {
      season: date.getFullYear(),
      team,
      league
    }

    const response = await this.request('GET', route, params)
    
    return response.data
  
  }

  public async fetchFixtures(body: any): Promise<unknown> {
    const route = 'fixtures';
    const newDate = new Date();
    const fromDate = formatDate(newDate);
    const toDate = addDays(newDate, 14);
    const datas: IFixturesRequest[] = body.data;
    const fixturePath = path.join(__dirname, `fixtures-${datas[0].country}.json`);

    const fileExists = await fs.stat(fixturePath).then(() => true).catch(() => false);

    if(fileExists) {
      const fileData = await fs.readFile(fixturePath, 'utf-8');
      console.log('Returning cached data');
      return JSON.parse(fileData) as LeagueResponse;
    } else {
    const fixturePromises = datas.map(async (data: IFixturesRequest) => {
      const params = {
        league: Number(data.leagueId),
        season: newDate.getFullYear(),
        from: fromDate,
        to: toDate,
        status: "NS",
        timezone: "Africa/Lagos"
      };
  
      const response = await this.request('GET', route, params);
  
      return {
        league: data.name,
        matches: response.data
      };
    });
  
    const fixturesResponse = await Promise.all(fixturePromises);
    await fs.writeFile(fixturePath, JSON.stringify(fixturesResponse), 'utf-8');
    return fixturesResponse;
    }

  }
  
  public async fetchSquad(team: string):Promise<unknown>{
    const route = 'players/squads'
    const params = {
      team
    }
    const response = await this.request('GET', route, params); 
    return response.data
  }

  public async fetchPlayer(playerId: string): Promise<unknown>{
    const route = 'players'

    const date =  new Date()

    const params = {
      id: playerId,
      season: date.getFullYear()
    }
    const response = await this.request('GET', route, params)
    return response.data
  }
}



export const sportApiService = new SportApiService();



export class SportController extends BaseSportApi{

  public async findSportLeagues(
    _req: Request,
    res: Response,
  ): Promise<ApiResponse<void>> {
    try {
      const fixtures = await sportApiService.getFixtures();
      const response = new SuccessResponse(
        'leagues fetched',
        STANDARD.SUCCESS,
        { data: fixtures },
      );
      return res.send(response);
    } catch (error) {
      logger.error(error);
      res
        .status(ErrorsConstants.internal_error_status)
        .send(new InternalServerError());
    }
  }

  public async fetchBetDexEvents(
    _req: Request,
    res: Response,
  ): Promise<ApiResponse<void>> {
    try {
      const events = await sportApiService.getBetDexEvents();
      const response = new SuccessResponse(
        'events fetched',
        STANDARD.SUCCESS,
        events.eventCategories,
      );
      return res.send(response);
    } catch (error) {
      logger.error(error);
      res
        .status(ErrorsConstants.internal_error_status)
        .send(new InternalServerError());
    }
  }
  
  public async fetchTeams(
    req: Request,
    res: Response, 
  ): Promise<unknown>{
    try {
      const teamId = req.params.id
      const body = req.body
      const league = req.query.league as string
      const team = await sportApiService.getTeams(body)
       const response = new SuccessResponse(
        'team fetched',
        STANDARD.SUCCESS,
        team
      );
      return res.send(response);
    } catch (error) {
        logger.error(error);
        res
          .status(ErrorsConstants.internal_error_status)
          .send(new InternalServerError());
    }
  }

  public async fetchHeadToHead(
    req: Request,
    res: Response, 
  ): Promise<unknown>{
    try {
      const {team1, team2} = req.query  as {team1: string, team2: string}

      const h2h = await sportApiService.fetchHeadToHeadAnalysis(team1, team2)
       const response = new SuccessResponse(
        'team fetched',
        STANDARD.SUCCESS,
        h2h
      );
      return res.send(response);
    } catch (error) {
        logger.error(error);
        res
          .status(ErrorsConstants.internal_error_status)
          .send(new InternalServerError());
    }
  }

  public async fetchFixtures(
    _req: Request,
    res: Response, 
  ): Promise<unknown>{
    try {
      const fixtures = await sportApiService.fetchFixtures(_req.body)
       const response = new SuccessResponse(
        'fixtures fetched',
        STANDARD.SUCCESS,
        fixtures
      );
      return res.send(response);
    } catch (error) {
        logger.error(error);
        res
          .status(ErrorsConstants.internal_error_status)
          .send(new InternalServerError());
    }
  }

  public async fetchTeamStats(
    req: Request,
    res: Response,  
  ):Promise<ApiResponse<void>>{
    try {
      const teamId = req.params.id
      const league  = req.query.league as string

      const stats = await sportApiService.getTeamStatistics(teamId, league)

      const response = new SuccessResponse(
        'team stats fetched',
        STANDARD.SUCCESS,
        stats
      );

      return res.send(response);

    } catch (error) {
      logger.error(error);
      res
        .status(ErrorsConstants.internal_error_status)
        .send(new InternalServerError()); 
    }
  }

  public async fetchSquad(
    req: Request,
    res: Response,   
  ):Promise<ApiResponse<void>>{
    try {
      const teamId = req.params.id

      const players = await sportApiService.fetchSquad(teamId)

      const response = new SuccessResponse(
        'players fetched',
        STANDARD.SUCCESS,
        players
      );

      return res.send(response);
    } catch (error) {
      logger.error(error);
      res
        .status(ErrorsConstants.internal_error_status)
        .send(new InternalServerError());  
    }
  }

  public async fetchPlayer(
    req: Request,
    res: Response,   
  ):Promise<ApiResponse<void>>{
    try {
      const playerId = req.params.id

      const player = await sportApiService.fetchPlayer(playerId)

      const response = new SuccessResponse(
        'players fetched',
        STANDARD.SUCCESS,
        player
      );

      return res.send(response);
    } catch (error) {
      logger.error(error);
      res
        .status(ErrorsConstants.internal_error_status)
        .send(new InternalServerError());  
    }
  }

  public async fetchOdd(
    req: Request,
    res: Response,   
  ):Promise<ApiResponse<void>>{
    try {
      const playerId = req.params.id

      const player = await sportApiService.fetchOdd(req)

      const response = new SuccessResponse(
        'players fetched',
        STANDARD.SUCCESS,
        player
      );

      return res.send(response);
    } catch (error) {
      logger.error(error);
      res
        .status(ErrorsConstants.internal_error_status)
        .send(new InternalServerError());  
    }
  }

}
