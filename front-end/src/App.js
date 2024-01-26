import React, {  useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import MainComponent from './MainComponent';
import Interface from './interface1';
import Predict from './Predict';


function App() {

  return (
    <div className="App">
      <MainComponent/>
    </div>
  );
}

export default App;
