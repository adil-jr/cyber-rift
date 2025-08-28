import React from 'react';

interface ErrorStateProps {
    message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
    return (
        <div>
            <h2>Erro de Conexão com o Servidor</h2>
            <p>{message}</p>
            <a href="/">Tentar Novamente</a>
        </div>
    );
}