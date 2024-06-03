import React, { useState } from 'react';
// import './CreateQuizPage.css';
import DynamicFormModal from '../components/DynamicFormModal';

const App = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleSubmit = (data) => {
    console.log('Form Data:', data);
    // Here you would post the data to the API
    // fetch('your-api-endpoint', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // })
    //   .then(response => response.json())
    //   .then(data => console.log(data))
    //   .catch(error => console.error('Error:', error));
  };

  return (
    <div className="App">
      <button onClick={handleShow}>
        Open Modal
      </button>

      <DynamicFormModal show={showModal} handleClose={handleClose} handleSubmit={handleSubmit} />
    </div>
  );
};

export default App;
