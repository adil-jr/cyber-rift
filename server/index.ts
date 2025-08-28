import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';

if (!Bun.env.RIOT_API_KEY) {
    console.error('ERRO: Variável de ambiente RIOT_API_KEY não definida!');
    process.exit(1);
}
const PORT = Bun.env.PORT || 3001;
const RIOT_API_KEY = Bun.env.RIOT_API_KEY;


let ddragonVersion: string;
const championIdToKeyMap = new Map<string, string>();

async function initializeDDragonData() {
    try {
        console.log('Inicializando dados do Data Dragon...');
        const versionsResponse = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
        const versions: string[] = await versionsResponse.json();
        ddragonVersion = versions[0];
        console.log(`Versão do DDragon definida como: ${ddragonVersion}`);

        const championDataUrl = `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/data/en_US/champion.json`;
        const championResponse = await fetch(championDataUrl);
        const championData = await championResponse.json();

        for (const championKey in championData.data) {
            const champ = championData.data[championKey];
            championIdToKeyMap.set(champ.key, champ.id);
        }
        console.log(`Mapa de campeões criado com ${championIdToKeyMap.size} entradas.`);
    } catch (error) {
        console.error("Falha ao inicializar dados do DDragon. O servidor não pode continuar.", error);
        process.exit(1);
    }
}

const getRegionFromPlatform = (platform: string): string => {
    const americas = ['br1', 'la1', 'la2', 'na1', 'oc1'];
    if (americas.includes(platform)) return 'americas';
    return 'americas';
};

const app = new Elysia()
    .use(cors({ origin: 'http://localhost:5173', methods: ['GET'] }))
    .onBeforeHandle(({ request }) => console.log(`[${new Date().toLocaleTimeString('pt-BR')}] 📞 ${request.method} ${new URL(request.url).pathname}`))
    .get('/api/health', () => ({ status: 'ok', server: 'Elysia', timestamp: Date.now() }))

    .get(
        '/api/summoner/by-riot-id/:platformRegion/:gameName/:tagLine',
        async ({ params, set }) => {
            try {
                const region = getRegionFromPlatform(params.platformRegion);
                const accountApiUrl = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(params.gameName)}/${encodeURIComponent(params.tagLine)}`;
                const accountResponse = await fetch(accountApiUrl, { headers: { 'X-Riot-Token': RIOT_API_KEY } });
                if (!accountResponse.ok) { set.status = accountResponse.status; return { error: 'Riot ID não encontrado.'}; }
                const accountData = await accountResponse.json();
                const puuid = accountData.puuid;

                const summonerApiUrl = `https://${params.platformRegion}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
                const summonerResponse = await fetch(summonerApiUrl, { headers: { 'X-Riot-Token': RIOT_API_KEY } });
                if (!summonerResponse.ok) { set.status = summonerResponse.status; return { error: 'Dados do Summoner não encontrados.'}; }
                const summonerData = await summonerResponse.json();

                const masteryApiUrl = `https://${params.platformRegion}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top`;
                const masteryResponse = await fetch(masteryApiUrl, { headers: { 'X-Riot-Token': RIOT_API_KEY } });
                if (!masteryResponse.ok) { set.status = masteryResponse.status; return { error: 'Não foi possível buscar a maestria.'}; }
                const masteryData = await masteryResponse.json();

                if (masteryData.length === 0) {
                    return { mainChampion: null };
                }
                const topMastery = masteryData[0];

                const championKey = championIdToKeyMap.get(topMastery.championId.toString());
                if (!championKey) {
                    set.status = 404;
                    return { error: `Campeão com ID ${topMastery.championId} não encontrado no DDragon.`}
                }

                const championDetailsUrl = `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/data/en_US/champion/${championKey}.json`;
                const detailsResponse = await fetch(championDetailsUrl);
                const detailsData = await detailsResponse.json();
                const championDetails = detailsData.data[championKey];

                const skins = championDetails.skins.map((skin: any) => ({
                    id: skin.id,
                    name: skin.name === 'default' ? championDetails.name : skin.name,
                    splashUrl: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championKey}_${skin.num}.jpg`,
                    chromas: skin.chromas,
                }));

                return {
                    puuid: summonerData.puuid,
                    gameName: accountData.gameName,
                    tagLine: accountData.tagLine,
                    profileIconId: summonerData.profileIconId,
                    summonerLevel: summonerData.summonerLevel,
                    mainChampion: {
                        id: championDetails.id,
                        name: championDetails.name,
                        title: championDetails.title,
                        masteryLevel: topMastery.championLevel,
                        masteryPoints: topMastery.championPoints,
                        skins: skins,
                    },
                };

            } catch (error) {
                console.error("Erro interno no servidor:", error);
                set.status = 500;
                return { error: 'Ocorreu um erro inesperado no nosso servidor.' };
            }
        },
        { params: t.Object({ platformRegion: t.String(), gameName: t.String(), tagLine: t.String() }) }
    )
    .listen(PORT, async () => {
        await initializeDDragonData();
        console.log(`Servidor proxy Cyber-Rift rodando em http://localhost:${PORT}`);
    });