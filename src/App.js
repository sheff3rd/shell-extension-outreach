import { useRef, useState } from 'react';
import extensibilitySdk from '@outreach/extensibility-sdk';

import logo from './logo.svg';
import './App.css';

const App = () => {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  const getClientToken = async () => {
    const clientId = 'EKFm2YBXTf5eRKfiogkupfgw4NOEcmnBUgthBD8luXLc';
    const clientSecret = ')e:DPqxvIr$K*520mS@P$g4VbzOYLMv8FViE3v(TMQa';
    const redirectUri = 'https://18d8-212-24-139-139.ngrok-free.app';

    const grantType = 'authorization_code';
    const code = 'read';

    try {
      const response = await fetch('https://api.outreach.io/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: grantType,
          code: code,
          state: 'dev',
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setToken(data.access_token); // or the correct property for the token
    } catch (error) {
      setError(error.message);
    }
  };

  async function fetchProspects() {
    const url = 'https://api.outreach.io/api/v2/prospects';
    const token = 'a0f67086-72d1-46b9-8d4c-94d5221dc369';

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Fetching data failed', error);
      throw error;
    }
  }

  const outreachContext = useRef(null);

  const handleClick = async () => {
    const ctx = await extensibilitySdk.init();

    console.log('ctx', ctx);
    outreachContext.current = ctx;
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <div>
          <button onClick={handleClick}>Initialize context</button>
          <button onClick={fetchProspects}>Fetch prospects</button>
        </div>

        <div>
          {token && <p>Token: {token}</p>}
          {error && <p>Error: {error}</p>}
        </div>
      </header>
    </div>
  );
};

export default App;
