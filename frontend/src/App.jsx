import React, { useState } from 'react';
import Register from './Register';
import Login from './Login';


export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <div>
      <button onClick={() => setShowLogin(false)}>Kayıt Ol</button>
      <button onClick={() => setShowLogin(true)}>Giriş Yap</button>
      {showLogin ? <Login /> : <Register />}
    </div>
  );
}
