
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import HousePricePredictor from "./pages/HousePricePredictor";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/predict" element={<HousePricePredictor />} />
      </Routes>
    </Router>
  );
}

export default App;
