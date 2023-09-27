import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Card.css';
import config from './config.json';

const Card = (props) => {
  const [text, setText] = useState("Kein Text geladen");
  const [useBtn, setUseBtn] = useState(null);
  const [type, setType] = useState('');

  useEffect(() => {
    // Diese Funktion wird immer dann aufgerufen, wenn eine der Abhängigkeiten (props) geändert wird.
    // Sie wird verwendet, um den Text und den Button zu rendern.
    setText(props.text);

    // Funktion zum Rendern des Buttons basierend auf den Bedingungen
    const renderButton = () => {
      if (props.showBtn) {
        if (props.btnboo) {
          return <button id='btn' onClick={useCard}>Use</button>;
        } else {
          return <button id='btn' onClick={voteCard}>Vote</button>;
        }
      }
      return null;
    };

    setUseBtn(renderButton());
    setType(props.type);
  }, [props.text, props.showBtn, props.btnboo, props.type]);

  // Funktion zum Verwenden der Karte
  function useCard() {
    props.offerCard(props.cId, props.text);
  }

  // Funktion zum Abstimmen für die Karte
  function voteCard() {
    props.voteCard(props.cId);

  }

  return (
    <div id='card'>
      <p>{type}</p>
      <p id='txt'>{text}</p>
      <div id="vertical-center">
        <div>{useBtn}</div>
      </div>
    </div>
  );
};

export default Card;
