<template>
  <div class="container flex flex-col gap-10">
    <div class="mt-10">
      <h1 class="text-3xl font-mono font-bold">
        Champion<span class="">Mastery</span>.lol
      </h1>
    </div>
    <div
      class="flex flex-col w-full lg:w-1/2 justify-center items-center mx-auto gap-3"
    >
      <div class="w-full">
        <Textarea
          v-model="summonerName"
          placeholder="Enter summoner names."
          class="h-24"
        />
      </div>
      <div class="ml-auto">
        <Button @click="handleMasteries">Search</Button>
      </div>
    </div>
    <div v-if="data.length" class="flex flex-col gap-5">
      <div class="flex flex-col gap-1.5">
        <div class="items-center">
          <h2 class="font-mono font-bold">Summoners</h2>
        </div>
        <div class="flex items-center gap-5">
          <div
            v-for="summoner in mergedData.summoners"
            :key="summoner.puuid"
            class="flex bg-gray-100 rounded-r-md justify-center items-center w-auto hover:bg-gray-200 cursor-pointer transition-all duration-200 ease-in-out"
            @click="handleSummonerFilter(summoner.puuid)"
          >
            <img
              :src="summoner.profileIconUrl"
              alt=""
              class="w-8 rounded-l-md"
            />
            <div class="pl-3">
              <span>{{ summoner.gameName }}</span
              ><span class="text-slate-600">#{{ summoner.tagLine }}</span>
            </div>
            <div class="px-3">
              <EyeOpenIcon v-if="summonersFilter.includes(summoner.puuid)" />
              <EyeClosedIcon v-else />
            </div>
            <div>
              <div
                class="w-4 h-8 rounded-r-md"
                :style="{ backgroundColor: `${summoner.hexColor}` }"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <div class="items-center flex justify-between">
          <div>
            <h2 class="font-mono font-bold">Filters</h2>
          </div>
          <div>
            <Button variant="ghost" @click="handleSortChange">
              <div v-if="sortBy == 'asc'" class="flex items-center">
                <ArrowDown01 class="w-4 mr-1" /> Ascending
              </div>
              <div class="flex items-center" v-else>
                <ArrowUp10Icon class="w-4 mr-1" /> Descending
              </div>
            </Button>
          </div>
        </div>
        <div>
          <Input
            type="text"
            v-model="championName"
            placeholder="Enter a champion name"
          />
        </div>
      </div>
      <div
        class="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-rows-12"
      >
        <Mastery
          v-for="mastery in fileredData"
          :key="mastery.champion.id"
          :mastery="mastery"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref } from "vue";
import Button from "../ui/button/Button.vue";
import Input from "../ui/input/Input.vue";
import Textarea from "../ui/textarea/Textarea.vue";
import Mastery from "./Mastery.vue";
import {
  MasteryResponse,
  MultiMasteryInfo,
  MultiSummonerMastery,
} from "../../types/api";
import { FILTERS_KEY, Filters, MASTERY_KEY } from "./providers";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-icons/vue";
import { apiClient } from "../../main";
import { ArrowDown01, ArrowUp10Icon } from "lucide-vue-next";

const summonerName = ref("OlivierDeschênes#1234\nopaxx#1234\nodeschenes4#1234");
const championName = ref("");
const sortBy = ref<"asc" | "desc">("desc");

const selectedChampion = ref<string | null>(null);

const handleChampionClick = (championId: string) => {
  return;

  selectedChampion.value =
    selectedChampion.value === championId ? null : championId;
};

const handleSortChange = () => {
  console.log("handleSortChange");
  sortBy.value = sortBy.value === "asc" ? "desc" : "asc";
};

const data = ref<MasteryResponse[]>([]);
const summonersFilter = ref<Filters["summoners"]>([]);

const handleSummonerFilter = (puuid: string) => {
  if (summonersFilter.value.includes(puuid)) {
    summonersFilter.value = summonersFilter.value.filter((s) => s !== puuid);
  } else {
    summonersFilter.value.push(puuid);
  }
};

function generateBrightColor() {
  let color = "#";
  for (let i = 0; i < 3; i++) {
    color += Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");
  }
  // Ensure brightness by setting the minimum value of the red component to 128
  if (parseInt(color.substring(1, 3), 16) < 128) {
    color = "#80" + color.substring(3);
  }
  return color;
}

// Merge all the data into a single array
const mergedData = computed<MultiSummonerMastery>(() => {
  const summoners = data.value.map((m) => m.summoner);
  const mastery = data.value.map((m) => m.mastery).flat();

  const masteryMap = new Map<string, MultiMasteryInfo>();

  mastery.forEach((m) => {
    if (!summonersFilter.value.includes(m.puuid)) {
      return;
    }

    const key = m.champion.id;

    if (!masteryMap.has(key)) {
      masteryMap.set(key, {
        champion: m.champion,
        data: [
          {
            championLevel: m.championLevel,
            championPoints: m.championPoints,
            lastPlayTime: m.lastPlayTime,
            puuid: m.puuid,
          },
        ],
        totalChampionPoints: m.championPoints,
      });
    } else {
      const current = masteryMap.get(key)!;

      current.data.push({
        championLevel: m.championLevel,
        championPoints: m.championPoints,
        lastPlayTime: m.lastPlayTime,
        puuid: m.puuid,
      });

      current.totalChampionPoints += m.championPoints;

      masteryMap.set(key, current);
    }
  });

  return {
    summoners,
    mastery: Array.from(masteryMap.values()).sort(
      (a, b) =>
        (sortBy.value === "asc" ? 1 : -1) *
        (a.totalChampionPoints - b.totalChampionPoints)
    ),
  };
});

provide(MASTERY_KEY, mergedData);
provide(FILTERS_KEY, {
  summoners: summonersFilter,
  championName: championName,
  handleChampionSelect: handleChampionClick,
  selectedChampion: selectedChampion,
});

const fetchMastery = async (name: string) => {
  const response = await apiClient.get(`mastery`, {
    retry: 0,
    searchParams: {
      summonerName: name,
    },
  });

  let responseData = (await response.json()) as MasteryResponse;
  responseData.summoner.hexColor = generateBrightColor();

  summonersFilter.value.push(responseData.summoner.puuid);

  data.value.push(responseData);
};

const fileredData = computed(() =>
  mergedData.value.mastery.filter((m) =>
    m.champion.name.toUpperCase().startsWith(championName.value.toUpperCase())
  )
);

const handleMasteries = async () => {
  await Promise.all(summonerName.value.split("\n").map(fetchMastery));

  summonerName.value = "";
};
</script>
