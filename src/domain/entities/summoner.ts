export interface Skin {
    id: string;
    name: string;
    splashUrl: string;
    chromas: boolean;
}

export interface MainChampion {
    id: string;
    name: string;
    title: string;
    masteryLevel: number;
    masteryPoints: number;
    skins: Skin[];
}

export interface SummonerData {
    puuid: string;
    gameName: string;
    tagLine: string;
    profileIconId: number;
    summonerLevel: number;
    mainChampion: MainChampion | null;
}