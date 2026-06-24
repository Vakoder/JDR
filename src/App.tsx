import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import StatsPage from './pages/StatsPage';
import MonetarySystemPage from './pages/MonetarySystemPage';
import CharactersPage from './pages/CharactersPage';
import RacesPage from './pages/RacesPage';
import ClassesPage from './pages/ClassesPage';
import ItemsPage from './pages/ItemsPage';
import SkillsPage from './pages/SkillsPage';
import DiceSystemPage from './pages/DiceSystemPage';
import ExportPage from './pages/ExportPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/monetary" element={<MonetarySystemPage />} />
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/races" element={<RacesPage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/dice" element={<DiceSystemPage />} />
          <Route path="/export" element={<ExportPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
