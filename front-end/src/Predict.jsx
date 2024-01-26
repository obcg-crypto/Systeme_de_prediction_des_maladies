import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import './Predict.css';
import "font-awesome/css/font-awesome.css";
import SearchBar from './Search';
import img from './conseils.png'


const Predict = ({ selectedSymptoms, deseases, setSelectedSymptoms}) => {
  const [data, setData] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  
  const handleSelectedSymptoms = () => {
    setSelectedSymptoms([])
  }

  return (
    <div>
        <div className='main-container'>
          <div className="left-container">
            <div className='left-title'>
              Bienvenu dans le  <p className='para'>module expert</p>
            </div>
            <img src={img} alt="" />
          </div>
          <div className="right-container">
            <div className="title">
              Voici vos resultats
            </div>
            <div className="selected-symptomsee">
              {selectedSymptoms.map((symptom, index) => (
                <div key={index} className="selected-symptomm">
                  {symptom} 
                </div>
              ))}
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Maladies</th>
                    <th>Probabilité</th>
                  </tr>
                </thead>
                <tbody>
                  {deseases.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((symptom, index) => (
                    <tr key={index}>
                      <td>{symptom.maladie}</td>
                      <td>{symptom.proba_1.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                {currentPage === 1 ? null: <i class="fa fa-backward" aria-hidden="true"></i> }
              </button>
              <span>{currentPage}</span>
              <button
                disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                {currentPage === Math.ceil(data.length / itemsPerPage) ? null: <i class="fa fa-forward" aria-hidden="true"></i> }
              </button>
            </div>
            
            <NavLink to = '/' className="navlink" onClick={() => handleSelectedSymptoms()}>
                <i class="fa fa-arrow-left" aria-hidden="true"></i>
                <span>Nouvelle prediction</span> 
            </NavLink>
          </div>
        </div>
    </div>
  );
};

export default Predict;