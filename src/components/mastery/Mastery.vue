<template>
  <div
    v-if="!shouldBeHidden"
    class="flex flex-col gap-1.5 cursor-pointer hover:bg-gray-100 rounded-md"
    @click="filters.handleChampionSelect(mastery.champion.id)"
    :class="{
      'col-span-full row-span-4':
        filters.selectedChampion.value === mastery.champion.id,
    }"
  >
    <div class="flex rounded-md flex-col lg:flex-row gap-3">
      <div class="flex">
        <img v-bind:src="mastery.champion.image" class="rounded-md" />
      </div>
      <div class="flex flex-1 flex-col justify-between">
        <div>
          <h3 class="text-xl font-bold">
            <span v-if="filters.championName.value">
              <span class="bg-yellow-300">
                {{
                  mastery.champion.name.slice(
                    0,
                    filters.championName.value.length
                  )
                }}
              </span>
              <span>
                {{
                  mastery.champion.name.slice(filters.championName.value.length)
                }}
              </span>
            </span>
            <span v-else>
              {{ mastery.champion.name }}
            </span>
          </h3>
          <div>{{ formatter.format(mastery.totalChampionPoints) }}</div>
        </div>
        <div class="bg-gray-100 rounded-md h-6 flex">
          <div
            v-for="m in mastery.data"
            :style="{
              width: `${
                (m.championPoints / mastery.totalChampionPoints) * 100
              }%`,
              backgroundColor: `${getSummonerFromPuuid(m.puuid).hexColor}`,
            }"
            class="first:rounded-l-md last:rounded-r-md relative group"
          >
            <Tooltip :mastery="m" :summoner="getSummonerFromPuuid(m.puuid)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import { MultiMasteryInfo } from "../../types/api";
import { FILTERS_KEY, MASTERY_KEY } from "./providers";
import Tooltip from "./Tooltip.vue";
import { Maximize2 } from "lucide-vue-next";

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
