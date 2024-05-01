<template>
  <span
    class="hidden group-hover:block absolute text-xs p-1.5 rounded-md text-nowrap font-bold text-white bg-black bottom-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >{{ summoner.gameName }} :
    {{ formatter.format(mastery.championPoints) }}
  </span>
</template>

<script setup lang="ts">
import { Summoner, SummonerChampionMasteryInfo } from "../../types/api";

const formatter = Intl.NumberFormat("en", { notation: "compact" });

defineProps<{
  mastery: SummonerChampionMasteryInfo;
  summoner: Summoner;
}>();
</script>
