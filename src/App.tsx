import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { I18nProvider } from './contexts/I18nContext';
import { HomePage } from './pages/HomePage';
import { RecipePage } from './pages/RecipePage';
import { SearchPage } from './pages/SearchPage';

function App() {
  return (
    <I18nProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/recipe/:id" element={<RecipePage />} />
              <Route path="/search" element={<SearchPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </I18nProvider>
  );
}

export default App;
