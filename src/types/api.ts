export type SummonerChampionMasteryInfo = {
  puuid: string;
  championLevel: number;
  championPoints: number;
  lastPlayTime: string;
};

export type BasicChampionMastery = {
  champion: {
    id: string;
    key: string;
    name: string;
    title: string;
    image: string;
  };
};

export type Summoner = {
  id: string;
  accountId: string;
  puuid: string;
  profileIconId: number;
  profileIconUrl: string;
  revisionDate: number;
  summonerLevel: number;
  gameName: string;
  tagLine: string;
};

export type MasteryResponse = {
  mastery: Array<ChampionMastery>;
  summoner: Summoner;
};

export type ChampionMastery = SummonerChampionMasteryInfo &
  BasicChampionMastery;

export type MultiMasteryInfo = {
  data: Array<SummonerChampionMasteryInfo>;
  totalChampionPoints: number;
} & BasicChampionMastery;

export type MultiSummonerMastery = {
  summoners: Array<Summoner>;
  mastery: Array<MultiMasteryInfo>;
};
