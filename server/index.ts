import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';

if (!Bun.env.RIOT_API_KEY) {
    console.error("ERRO: Variável de ambiente RIOT_API_KEY não definida!");
    process.exit(1);
}

const PORT = Bun.env.PORT || 3001;

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

    // GET /api/summoner/:platformRegion/by-name/:name
    // GET /api/mastery/:platformRegion/by-puuid/:puuid/top
    // ...

    .listen(PORT);

console.log(
    `Servidor proxy Cyber-Rift rodando em http://${app.server?.hostname}:${app.server?.port}`,
);