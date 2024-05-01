<template>
  <div
    v-if="!shouldBeHidden"
    class="flex rounded-md flex-col lg:flex-row gap-3"
  >
    <div class="flex">
      <img v-bind:src="mastery.champion.image" class="rounded-l-md" />
    </div>
    <div class="flex flex-1 flex-col">
      <h3 class="text-xl font-bold">
        <span v-if="filters.championName.value">
          <span class="bg-yellow-300">
            {{
              mastery.champion.name.slice(0, filters.championName.value.length)
            }}
          </span>
          <span>
            {{ mastery.champion.name.slice(filters.championName.value.length) }}
          </span>
        </span>
        <span v-else>
          {{ mastery.champion.name }}
        </span>
      </h3>
      <div>Pts: {{ formatter.format(mastery.totalChampionPoints) }}</div>
      <div>
        <span v-for="m in mastery.data" :key="m.puuid" class="flex">
          <span>
            <span
              class="mr-1"
              :class="{
                'bg-yellow-300': filters.summoners.value.includes(m.puuid),
              }"
              >{{ getSummonerFromPuuid(m.puuid).gameName }}</span
            >
            <span class="font-mono">{{
              m.championPoints.toLocaleString()
            }}</span>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import { MultiMasteryInfo } from "../../types/api";
import { FILTERS_KEY, MASTERY_KEY } from "./providers";

const { mastery } = defineProps<{
  mastery: MultiMasteryInfo;
}>();

const masteryInjected = inject(MASTERY_KEY)!;
const filters = inject(FILTERS_KEY)!;

const shouldBeHidden = computed(() => {
  const championIsFiltered = filters.championName.value
    ? mastery.champion.name
        .toUpperCase()
        .startsWith(filters.championName.value.toUpperCase())
    : true;

  return !championIsFiltered;
});

const getSummonerFromPuuid = (puuid: string) => {
  return masteryInjected.value.summoners.find((s) => s.puuid === puuid)!;
};

const formatter = Intl.NumberFormat("en", { notation: "compact" });
</script>
