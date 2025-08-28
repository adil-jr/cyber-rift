import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

export function HomePage() {
    const navigate = useNavigate();
    const [gameName, setGameName] = useState('');
    const [tagLine, setTagLine] = useState('');
    const [platform, setPlatform] = useState('br1');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (gameName && tagLine) {
            const formattedGameName = gameName.replace(/\s+/g, '');
            const formattedTagLine = tagLine.replace(/\s+/g, '');
            navigate(`/showcase/${platform}/${encodeURIComponent(formattedGameName)}/${encodeURIComponent(formattedTagLine)}`);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.title}>Cyber-Rift</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <select value={platform} onChange={(e) => setPlatform(e.target.value)} className={styles.regionSelect}>
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
                        placeholder="Seu Nick"
                        required
                        className={styles.riotIdInput}
                    />
                    <span className={styles.taglineSeparator}>#</span>
                    <input
                        type="text"
                        value={tagLine}
                        onChange={(e) => setTagLine(e.target.value)}
                        placeholder="Tagline"
                        required
                        className={styles.riotIdInput}
                    />
                </div>
                <button type="submit" className={styles.submitButton}>Analisar Perfil</button>
            </form>
        </div>
    );
}