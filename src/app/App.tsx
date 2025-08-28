import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/presentation/pages/HomePage';
import { ShowcasePage } from '@/presentation/pages/ShowcasePage';

function App() {
    return (
        <BrowserRouter>
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    {}
                    <Route
                        path="/showcase/:platformRegion/:gameName/:tagLine"
                        element={<ShowcasePage />}
                    />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;