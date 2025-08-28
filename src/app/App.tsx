import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/presentation/pages/HomePage';

function App() {
    return (
        <BrowserRouter>
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    {/* A rota do showcase será criada no próximo passo */}
                    {/* <Route path="/showcase/:platformRegion/:gameName/:tagLine" element={<ShowcasePage />} /> */}
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;