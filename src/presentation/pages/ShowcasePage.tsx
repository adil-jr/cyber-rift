import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Vibrant from 'node-vibrant';
import { Palette } from 'vibrant/lib/color';

import { useSummonerData } from '@/application/usecases/getSummonerData';
import { LoadingState } from '@/presentation/components/LoadingState';
import { ErrorState } from '@/presentation/components/ErrorState';
import { SkinsCarousel } from '@/presentation/components/SkinsCarousel';
import { InteractiveBackground } from '@/presentation/components/InteractiveBackground';
import styles from './ShowcasePage.module.css';

export function ShowcasePage() {
    const params = useParams<{ platformRegion: string; gameName: string; tagLine: string }>();
    const { data, isLoading, isError, error } = useSummonerData({
        platformRegion: params.platformRegion!,
        gameName: params.gameName!,
        tagLine: params.tagLine!,
    });

    const [selectedSkinUrl, setSelectedSkinUrl] = useState<string | null>(null);
    const [palette, setPalette] = useState<Palette | null>(null);

    useEffect(() => {
        if (selectedSkinUrl) {
            Vibrant.from(selectedSkinUrl).getPalette((err, palette) => {
                if (!err && palette) {
                    setPalette(palette);
                }
            });
        }
    }, [selectedSkinUrl]);


    if (isLoading) return <LoadingState />;
    if (isError) return <ErrorState message={error.message} />;
    if (!data?.mainChampion) { /* ... (código para sem maestria) ... */ }

    return (
        <div className={styles.container}>
            <InteractiveBackground palette={{
                DarkVibrant: palette?.DarkVibrant?.hex,
                Vibrant: palette?.Vibrant?.hex,
            }} />

            <header>
                <h2>Bem-vindo, {data.gameName} #{data.tagLine}</h2>
                <p>Nível de Invocador: {data.summonerLevel}</p>
            </header>

            <section>
                <h3>{data.mainChampion.name}</h3>
                <p><em>{data.mainChampion.title}</em></p>
            </section>

            <SkinsCarousel
                skins={data.mainChampion.skins}
                onSkinSelect={setSelectedSkinUrl}
            />
        </div>
    );
}