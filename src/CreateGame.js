import React, { useRef, useState } from 'react';
import axios from 'axios';
import config from './config.json';
import { Hilfe } from './Hilfe';
import Pack from './Pack';
import PacksView from './PacksView';

function CreateGame(props) {
  const goalInRef = useRef();
  const [goalPoints, setGoalPoints] = useState(10);
  const [packs, setPacks] = useState([]);
  const [currentPacks, setCurrentPacks] = useState([]);
  const [packDiv, setPackDiv] = useState();
  const [showPacks, setShowPacks] = useState(false);
  const [showPacksView, setShowPacksView] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Funktion zum Abrufen von Packs über die API und Anzeigen der ausgewählten Packs
  function getPacks(packsToFetch) {
    Promise.all(
      packsToFetch.map((packId) =>
        axios.get(config.preUrl + 'packs/' + packId)
      )
    )
      .then((responses) => {
        const packsObjects = responses.map((response) => response.data);
        setCurrentPacks(packsObjects);
        createPacks(currentPacks);
      })
      .catch((error) => {
        console.error('Fehler beim Abrufen von Packs:', error);
      });
  }

  // Funktion zum Hinzufügen einer Pack-ID zur ausgewählten Packliste
  function addId(id) {
    let arr = packs;
    arr.push(id);
    setPacks(arr);
    console.log(id);
  }

  // Funktion zum Entfernen einer Pack-ID aus der ausgewählten Packliste
  function removeId(id) {
    console.log(id);
    let arr = packs.filter((packId) => packId !== id);
    setPacks(arr);
  }

  // Funktion zum Erstellen von Pack-Komponenten für die Anzeige
  function createPacks(pArr) {
    let pList = pArr.map((eintrag) => (
      <div key={eintrag.id}>
        <p> </p>
        <Pack usePack={false} packName={eintrag.name} packId={eintrag.id} bcCount={eintrag.blackCardCount} wcCount={eintrag.whiteCardCount} />
      </div>
    ));
    setPackDiv(pList);
  }

  // Funktion zum Anzeigen/Verbergen der ausgewählten Packs
  function handleShowPacks() {
    if (!showPacks) {
      getPacks(packs);
      setShowPacks(true);
    } else {
      setPackDiv([]);
      setShowPacks(false);
    }
  }

  // Funktion zum Anzeigen/Verbergen der Packauswahlansicht
  function handleChoosePacks() {
    setShowPacksView(!showPacksView);
  }

  // Funktion zum Erstellen eines neuen Spiels und Weiterleiten zu diesem
  function handleCreateGame() {
    setErrorMsg('');
    if (goalPoints > 0 && goalPoints < 100) {
      if (packs.length > 0) {
        postGame(props.pData.id, packs, goalPoints);
      } else {
        setErrorMsg('Packs dürfen nicht leer sein.');
      }
    } else {
      setErrorMsg('Ungültige Punkte - Wert zwischen 0 und 100 erforderlich.');
    }
  }

  // Funktion zum Senden von Spielinformationen an die API
  function postGame(owner, packs, goal) {
    let gameData = {
      owner: owner,
      packs: packs,
      goal: goal
    };
    let Jstring = JSON.stringify(gameData);
    var msg = JSON.parse(Jstring);
    axios.post(config.preUrl + 'games/', msg)
      .then((response) => {
        props.changeUi(1, props.pData, response.data.id);
      })
      .catch((error) => {
        console.error('Fehler beim Erstellen des Spiels:', error);
      });
  }

  return (
    <div>
      <Hilfe></Hilfe>
      <div>
        <label>Punkte Ziel: </label>
        <input
          ref={goalInRef}
          type="text"
          value={goalPoints}
          onChange={(e) => setGoalPoints(e.target.value)}
        />
        <label style={{ color: 'red' }}>{errorMsg}</label>
      </div>
      <button onClick={handleShowPacks}>
        {showPacks ? 'Verwendete Packs ausblenden' : 'Verwendete Packs anzeigen'}
      </button>
      <div>{packDiv}</div>
      <div>
        <button onClick={handleChoosePacks}>
          {showPacksView ? 'Packauswahl ausblenden' : 'Packs für das Spiel auswählen'}
        </button>
      </div>
      <div>
        <button onClick={() => handleCreateGame(props.pData)}>Lobby starten</button>
      </div>
      {showPacksView && <PacksView addId={addId} removeId={removeId} usePack={true}></PacksView>}
    </div>
  );
}

export default CreateGame;
