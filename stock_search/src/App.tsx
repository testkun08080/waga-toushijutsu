import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { SEOManager } from './components/SEOManager';
import { AboutPage, DataPage } from './pages';
import { NotFound } from './pages/NotFound';

function App() {
  const basename = import.meta.env.VITE_GITHUB_PAGES === 'true' ? '/waga-toushijutsu' : '';

  return (
    <Router basename={basename}>
      <SEOManager />
      <div className="min-h-screen bg-base-100 flex flex-col">
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DataPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
