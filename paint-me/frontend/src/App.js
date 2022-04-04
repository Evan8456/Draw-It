import React, { useEffect } from "react";
import { Route, BrowserRouter, Routes} from 'react-router-dom';
import "./App.css";
import Dashboard from "./components/Dashboard/Dashboard";
import { Draw } from "./components/Draw/Draw";
import { SoloDraw } from "./components/SoloDraw/SoloDraw";
import  Login  from "./components/Login/Login";
import Credits from "./components/Credits/Credits";

function App() {

  useEffect(() => {
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/credits" element={<Credits/>}/>
        <Route path="/draw" element={
            <Draw/>
        }/>
        <Route path="/SoloDraw" element={
            <SoloDraw/>
        }/>
        <Route path="/dashboard" element={
            <Dashboard/>
        }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
