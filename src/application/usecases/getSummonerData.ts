import { useQuery } from '@tanstack/react-query';
import { SummonerData } from '@/domain/entities/summoner';

interface GetSummonerDataParams {
    platformRegion: string;
    gameName: string;
    tagLine: string;
}

const fetchSummonerData = async ({
                                     platformRegion,
                                     gameName,
                                     tagLine,
                                 }: GetSummonerDataParams): Promise<SummonerData> => {
    const response = await fetch(
        `http://localhost:3001/api/summoner/by-riot-id/${platformRegion}/${gameName}/${tagLine}`,
    );

    if (!response.ok) {
        throw new Error('Não foi possível buscar os dados do invocador. Verifique o Riot ID e a região.');
    }

    return response.json();
};

export const useSummonerData = (params: GetSummonerDataParams) => {
    return useQuery<SummonerData, Error>({
        queryKey: ['summoner', params],
        queryFn: () => fetchSummonerData(params),
        enabled: !!params.gameName && !!params.tagLine,
        retry: false,
    });
};