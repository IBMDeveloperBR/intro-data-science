import React, { useState } from 'react';
import { Modal } from 'carbon-components-react';
import Header from './components/AppHeader';
import Form from './components/AppForm/AppForm';
import Loading from './components/Loading';
import './App.css';

const App = () => {
  
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState({ show: false, value: '' });

  const formSubmitHandler = async (data) => {
    setLoading(true);
    const rawResponse = await fetch('/predicao', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const res = await rawResponse.json();
    console.log(res);
    setLoading(false);
    if (res.err === true)
      setApiResponse({ show: true, value: res.msg });
    else
      setApiResponse({ show: true, value: res.value + " habitantes." });
  };

  let app = <Form onSubmit={formSubmitHandler} />;
  if (loading === true) {
    app = <Loading />;
  }

  return (
    <div className="App">
      <Header />
      <div className="screen">
        <h1>Introdução a Data Science - Predição de número de habitantes</h1>
        {app}
        <Modal
          open={apiResponse.show} passiveModal={true}
          modalHeading="Predição"
          modalAriaLabel="Resultado da chamada API"
          onRequestClose={() => setApiResponse({ show: false, value: '' })} >
          <p>{apiResponse.value}</p>
        </Modal>
      </div>
    </div >
  );
}

export default App;
