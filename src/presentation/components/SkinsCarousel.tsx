import React, { useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Skin } from '@/domain/entities/summoner';
import './SkinsCarousel.css';

interface SkinsCarouselProps {
    skins: Skin[];
    onSkinSelect: (splashUrl: string) => void;
}

export function SkinsCarousel({ skins, onSkinSelect }: SkinsCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

    const handleSelect = useCallback(() => {
        if (!emblaApi) return;
        const selectedSkinIndex = emblaApi.selectedScrollSnap();
        onSkinSelect(skins[selectedSkinIndex].splashUrl);
    }, [emblaApi, onSkinSelect, skins]);

    useEffect(() => {
        if (emblaApi) {
            handleSelect();
            emblaApi.on('select', handleSelect);
            return () => {
                emblaApi.off('select', handleSelect);
            };
        }
    }, [emblaApi, handleSelect]);

    return (
        <div className="embla" ref={emblaRef}>
            <div className="embla__container">
                {skins.map((skin) => (
                    <div className="embla__slide" key={skin.id}>
                        <img src={skin.splashUrl} alt={`Splash art da skin ${skin.name}`} />
                        <p>{skin.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}