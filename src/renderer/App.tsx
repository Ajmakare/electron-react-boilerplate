import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Controls from '../components/controls';

function Main() {
  return (
    <div>
      <Controls name={''}/>
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
