import React, { useEffect, useState } from "react";
import { Route, BrowserRouter, Navigate, Routes} from 'react-router-dom';
import "./App.css";
import Dashboard from "./components/Dashboard/Dashboard";
import { Draw } from "./components/Draw/Draw";
import  Login  from "./components/Login/Login";

const ProtectedRoute = ({ auth, children }) => {
  if (!auth) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const [auth, setAuth] = useState(true);

  useEffect(() => {
    console.log("check authentication here");
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/draw" element={
          <ProtectedRoute auth={auth}>
            <Draw/>
          </ProtectedRoute>
        }/>
        <Route path="/dashboard" element={
          <ProtectedRoute auth={auth}>
            <Dashboard/>
          </ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
