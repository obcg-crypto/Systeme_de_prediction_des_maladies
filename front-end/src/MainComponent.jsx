import React, {  useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Predict from './Predict';
import Interface1 from './interface1';

const MainComponent = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [deseases, setDeseases] = useState([]);

  return (
    <div >
      <Router>
    
        <Routes>
          <Route path="/" element={<Interface1 selectedSymptoms={selectedSymptoms} setSelectedSymptoms={setSelectedSymptoms} setDeseases={setDeseases}/>} />
          <Route path="/prediction" element={<Predict selectedSymptoms={selectedSymptoms} deseases={deseases} setSelectedSymptoms={setSelectedSymptoms}/>} />
        </Routes>
      
     </Router>
    </div>
  );
}

export default MainComponent;
