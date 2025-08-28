import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';

if (!Bun.env.RIOT_API_KEY) {
    console.error('ERRO: Variável de ambiente RIOT_API_KEY não definida!');
    process.exit(1);
}

const PORT = Bun.env.PORT || 3001;
const RIOT_API_KEY = Bun.env.RIOT_API_KEY;

const getRegionFromPlatform = (platform: string): string => {
    const americas = ['br1', 'la1', 'la2', 'na1', 'oc1'];
    const asia = ['jp1', 'kr1'];
    const europe = ['eun1', 'euw1', 'ru', 'tr1'];

    if (americas.includes(platform)) return 'americas';
    if (asia.includes(platform)) return 'asia';
    if (europe.includes(platform)) return 'europe';

    return 'americas';
};

const app = new Elysia()
    .use(
        cors({
            origin: 'http://localhost:5173',
            methods: ['GET'],
        }),
    )
    .onBeforeHandle(({ request }) => {
        console.log(
            `[${new Date().toLocaleTimeString('pt-BR')}] 📞 ${request.method} ${
                new URL(request.url).pathname
            }`,
        );
    })
    .get('/api/health', () => {
        return { status: 'ok', server: 'Elysia', timestamp: Date.now() };
    })

    .get(
        '/api/summoner/by-riot-id/:platformRegion/:gameName/:tagLine',
        async ({ params, set }) => {
            try {
                const region = getRegionFromPlatform(params.platformRegion);
                const encodedGameName = encodeURIComponent(params.gameName);
                const encodedTagLine = encodeURIComponent(params.tagLine);

                const accountApiUrl = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodedGameName}/${encodedTagLine}`;
                console.log(`Buscando PUUID em: ${accountApiUrl}`);

                const accountResponse = await fetch(accountApiUrl, {
                    headers: { 'X-Riot-Token': RIOT_API_KEY },
                });

                if (!accountResponse.ok) {
                    set.status = accountResponse.status;
                    return { error: 'Riot ID não encontrado.', details: await accountResponse.json() };
                }
                const accountData = await accountResponse.json();
                const puuid = accountData.puuid;

                const summonerApiUrl = `https://${params.platformRegion}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
                console.log(`Buscando dados do Summoner em: ${summonerApiUrl}`);

                const summonerResponse = await fetch(summonerApiUrl, {
                    headers: { 'X-Riot-Token': RIOT_API_KEY },
                });

                if (!summonerResponse.ok) {
                    set.status = summonerResponse.status;
                    return { error: 'Dados do Summoner não encontrados para o PUUID.', details: await summonerResponse.json() };
                }
                const summonerData = await summonerResponse.json();

                return {
                    puuid: summonerData.puuid,
                    gameName: accountData.gameName,
                    tagLine: accountData.tagLine,
                    profileIconId: summonerData.profileIconId,
                    summonerLevel: summonerData.summonerLevel,
                };

            } catch (error) {
                console.error("Erro interno no servidor:", error);
                set.status = 500;
                return { error: 'Ocorreu um erro inesperado no nosso servidor.' };
            }
        },
        {
            params: t.Object({
                platformRegion: t.String(),
                gameName: t.String(),
                tagLine: t.String(),
            }),
        },
    )
    .listen(PORT);

console.log(
    `Servidor proxy Cyber-Rift rodando em http://${app.server?.hostname}:${app.server?.port}`,
);