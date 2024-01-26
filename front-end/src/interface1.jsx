import React, { useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import './interface.css';
import "font-awesome/css/font-awesome.css";
import SearchBar from './Search';
import img from './conseils.png'


const Interface = ({selectedSymptoms, setSelectedSymptoms, setDeseases}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const symptomse = ['itching', 'skin_rash', 'nodal_skin_eruptions', 'dischromic _patches', 'continuous_sneezing', 'shivering', 'chills', 'watering_from_eyes', 'stomach_pain', 'acidity', 'ulcers_on_tongue', 'vomiting', 'cough', 'chest_pain', 'yellowish_skin', 'nausea', 'loss_of_appetite', 'abdominal_pain', 'yellowing_of_eyes', 'burning_micturition', 'spotting_ urination', 'passage_of_gases', 'internal_itching', 'indigestion', 'muscle_wasting', 'patches_in_throat', 'high_fever', 'extra_marital_contacts', 'fatigue', 'weight_loss', 'restlessness', 'lethargy', 'irregular_sugar_level', 'blurred_and_distorted_vision', 'obesity', 'excessive_hunger', 'increased_appetite', 'polyuria', 'sunken_eyes', 'dehydration', 'diarrhoea', 'breathlessness', 'family_history', 'mucoid_sputum', 'headache', 'dizziness', 'loss_of_balance', 'lack_of_concentration', 'stiff_neck', 'depression', 'irritability', 'visual_disturbances', 'back_pain', 'weakness_in_limbs', 'neck_pain', 'weakness_of_one_body_side', 'altered_sensorium', 'dark_urine', 'sweating', 'muscle_pain', 'mild_fever', 'swelled_lymph_nodes', 'malaise', 'red_spots_over_body', 'joint_pain', 'pain_behind_the_eyes', 'constipation', 'toxic_look_(typhos)', 'belly_pain', 'yellow_urine', 'receiving_blood_transfusion', 'receiving_unsterile_injections', 'coma', 'stomach_bleeding', 'acute_liver_failure', 'swelling_of_stomach', 'distention_of_abdomen', 'history_of_alcohol_consumption', 'fluid_overload', 'phlegm', 'blood_in_sputum', 'throat_irritation', 'redness_of_eyes', 'sinus_pressure', 'runny_nose', 'congestion', 'loss_of_smell', 'fast_heart_rate', 'rusty_sputum', 'pain_during_bowel_movements', 'pain_in_anal_region', 'bloody_stool', 'irritation_in_anus', 'cramps', 'bruising', 'swollen_legs', 'swollen_blood_vessels', 'prominent_veins_on_calf', 'weight_gain', 'cold_hands_and_feets', 'mood_swings', 'puffy_face_and_eyes', 'enlarged_thyroid', 'brittle_nails', 'swollen_extremeties', 'abnormal_menstruation', 'muscle_weakness', 'anxiety', 'slurred_speech', 'palpitations', 'drying_and_tingling_lips', 'knee_pain', 'hip_joint_pain', 'swelling_joints', 'painful_walking', 'movement_stiffness', 'spinning_movements', 'unsteadiness', 'pus_filled_pimples', 'blackheads', 'scurring', 'bladder_discomfort', 'foul_smell_of urine', 'continuous_feel_of_urine', 'skin_peeling', 'silver_like_dusting', 'small_dents_in_nails', 'inflammatory_nails', 'blister', 'red_sore_around_nose', 'yellow_crust_ooze'];

  const handleCheckboxChange = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const envoyerDonnees = ()=> {
    setIsLoading(true);

    // Envoyer les données à l'API Flask
    console.log('isloading',isLoading)
    fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptomes: selectedSymptoms }),
    })
    .then(response => response.json())
    .then(data => {
        setDeseases(data['data_received'])
        console.log('Réponse de l\'API Flask:', data['data_received']);
        setIsLoading(false)
        navigate('/prediction')
    })
    .catch((error) => {
        console.error('Erreur lors de l\'envoi des données:', error);
    });
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
              Selectionner les symptomes
            </div>
            <SearchBar filterField={(item) => item.toString()} list={symptomse} setList={setData} />
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Symptomes</th>
                    <th>Choisir</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((symptom, index) => (
                    <tr key={index}>
                      <td>{symptom}</td>
                      <td >
                        <input
                          type="checkbox"
                          onChange={() => handleCheckboxChange(symptom)}
                          checked={selectedSymptoms.includes(symptom)}
                          className="custom-checkbox"
                        />
                      </td>
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
            <div className="selected-symptoms">
              {selectedSymptoms.map((symptom, index) => (
                <div key={index} className="selected-symptom">
                  {symptom} 
                </div>
              ))}
            </div>
            <button className='buttone'  >
              {isLoading ? 
              (<div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '15px'
                }}
              >
                <BeatLoader loading={isLoading} size={5} color='#fff' />
              </div>
              )
            :(
                <span onClick={() => envoyerDonnees()}>Predict</span> 
              
            )}
            </button>
          </div>
        </div>
    </div>
  );
};

export default Interface;
