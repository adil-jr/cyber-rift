import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Skin } from '@/domain/entities/summoner';
import './SkinsCarousel.css'; // Importa nosso CSS

interface SkinsCarouselProps {
    skins: Skin[];
    championName: string;
}

export function SkinsCarousel({ skins, championName }: SkinsCarouselProps) {
    const [emblaRef] = useEmblaCarousel();

    return (
        <div className="embla" ref={emblaRef}>
            <div className="embla__container">
                {skins.map((skin) => (
                    <div className="embla__slide" key={skin.id}>
                        <img src={skin.splashUrl} alt={`Splash art da skin ${skin.name}`} />
                        {}
                        <p>{skin.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}