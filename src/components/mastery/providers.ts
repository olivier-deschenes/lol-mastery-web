import { InjectionKey, ComputedRef, Ref } from "vue";
import { MultiSummonerMastery, Summoner } from "../../types/api";

export const MASTERY_KEY = Symbol() as InjectionKey<
  ComputedRef<MultiSummonerMastery>
>;

export type Filters = {
  summoners: Summoner["puuid"][];
  championName: string | null;
};

export const FILTERS_KEY = Symbol() as InjectionKey<{
  summoners: Ref<Filters["summoners"]>;
  championName: Ref<Filters["championName"]>;
}>;
