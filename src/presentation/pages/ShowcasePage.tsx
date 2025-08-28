import React from 'react';
import { useParams } from 'react-router-dom';
import { useSummonerData } from '@/application/usecases/getSummonerData';
import { LoadingState } from '@/presentation/components/LoadingState';
import { ErrorState } from '@/presentation/components/ErrorState';
import { SkinsCarousel } from '@/presentation/components/SkinsCarousel';

export function ShowcasePage() {
    const params = useParams<{
        platformRegion: string;
        gameName: string;
        tagLine: string;
    }>();

    const { data, isLoading, isError, error } = useSummonerData({
        platformRegion: params.platformRegion!,
        gameName: params.gameName!,
        tagLine: params.tagLine!,
    });

    if (isLoading) {
        return <LoadingState />;
    }

    if (isError) {
        return <ErrorState message={error.message} />;
    }

    if (!data?.mainChampion) {
        return (
            <div>
                <h2>Bem-vindo, {data?.gameName} #{data?.tagLine}</h2>
                <p>Nível de Invocador: {data?.summonerLevel}</p>
                <p>Nenhum campeão com maestria encontrado para este jogador.</p>
            </div>
        )
    }

    return (
        <div>
            {}
            <h2>Bem-vindo, {data.gameName} #{data.tagLine}</h2>
            <p>Nível de Invocador: {data.summonerLevel}</p>

            <hr />

            {}
            <h3>{data.mainChampion.name}</h3>
            <p><em>{data.mainChampion.title}</em></p>
            <p>Maestria {data.mainChampion.masteryLevel} com {data.mainChampion.masteryPoints.toLocaleString('pt-BR')} pontos</p>

            <SkinsCarousel
                skins={data.mainChampion.skins}
                championName={data.mainChampion.name}
            />
        </div>
    );
}