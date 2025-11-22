type Player = {
  id: string;
  role: string;
};

type PlayerBase = {
  id: string;
  role: string | null;
  first_name: string | null;
  last_name: string | null;
  status: string | null;
  current_team_id: string | null;
  photo_url: string | null;
  in_game_name: string | null;
  current_team_name: string | null;
  current_team_acronym: string | null;
  current_league_id: string | null;
  current_league_name: string | null;
  region: string | null;
  game_records: GameRecord[];
  roles: string[];
  agent_statistics: {
    agent: string;
    acs: number;
    kills: number;
    deaths: number;
    assists: number;
    game_count: number;
  }[];
};

type GameRecord = {
  platform_game_id: string;
  game_time: string;
  map: string;
  agents: {
    agent_name: string;
  };
  kda: {
    kills: number;
    deaths: number;
    assists: number;
    combatScore: number;
  };
  round_count: number;
  gun_kills: {
    [key: string]: number;
  };
  round_records: any[];
};

type ChatMessage = {
  role: "user" | "agent";
  message: string;
};
