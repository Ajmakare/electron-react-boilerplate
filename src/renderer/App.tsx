import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Controls from '../components/controls';
import {SpotifyUserAuth} from '../components/SpotifyUserAuth';

function Main() {
  return (
    <div>
      <SpotifyUserAuth/>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}
