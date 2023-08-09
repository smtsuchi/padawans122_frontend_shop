import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCEF0V4P3Kvh9g5O9jfgN5p571w58Evft8",
  authDomain: "padawans122-shop-shoha.firebaseapp.com",
  projectId: "padawans122-shop-shoha",
  storageBucket: "padawans122-shop-shoha.appspot.com",
  messagingSenderId: "681954480584",
  appId: "1:681954480584:web:b9eefd6bf821fbeec930fd",
  databaseURL: 'https://padawans122-shop-shoha-default-rtdb.firebaseio.com'
};

initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
