import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
    const navigate = useNavigate();
    const [gameName, setGameName] = useState('');
    const [tagLine, setTagLine] = useState('');
    const [platform, setPlatform] = useState('br1');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (gameName && tagLine) {
            navigate(`/showcase/${platform}/${gameName}/${tagLine}`);
        }
    };

    return (
        <div>
            <h1>Cyber-Rift Showcase</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                        {/* Adicione outras regiões se desejar */}
                        <option value="br1">BR</option>
                        <option value="na1">NA</option>
                        <option value="euw1">EUW</option>
                        <option value="eun1">EUNE</option>
                        <option value="kr">KR</option>
                    </select>
                    <input
                        type="text"
                        value={gameName}
                        onChange={(e) => setGameName(e.target.value)}
                        placeholder="Game Name"
                        required
                    />
                    <span>#</span>
                    <input
                        type="text"
                        value={tagLine}
                        onChange={(e) => setTagLine(e.target.value)}
                        placeholder="Tagline"
                        required
                    />
                </div>
                <button type="submit">Analisar Perfil</button>
            </form>
        </div>
    );
}