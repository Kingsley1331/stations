(function(){
  let alphabet = 'abcdefghijklmnopqrstuvwxyz';
  let listOfStations = [];
  let stationLetters = {};

  function letterFrequencies(stationData) {
    let stationCount = Object.keys(stationData).length;
    let letters = {};
    let alphaArray = alphabet.split('');
    for(let letter of alphaArray) {
      let letterCount = counter(letter, stationData);
      if(letterCount === 0){
        alphabet = alphabet.replace(letter, '');
      } else {
        let frequencyRatio = letterCount/stationCount; // frequencyRatio represents the probability of a a letter appearing in a randomly chosen station
        letters[letter] = {points: 1/frequencyRatio, frequency: letterCount, selected: false};
      }
    }
    stationLetters = letters;
    assignPoints(stationData, letters);
    return letters;
  }

  function counter(letter, stationData) {
    let count = 0;
    for(let station in stationData) {
      if(stationData[station].set.has(letter)) {
        count++;
      }
    }
    return count;
  }

  function createStationData(stations, alphabet) {
    if(alphabet.length > 0) {
      let stationData = {};
      for(let station in stations) {
        let nameCharSet = new Set(stations[station].toLowerCase().replace(/ /g, '').replace(/'/g, '').replace(/-/g, '').replace(/\./g, '').replace(/[0-9]/g, ''));
        let data = {name: stations[station], points: 0, set: nameCharSet};
        stationData[station] = data;
      }
      letterFrequencies(stationData);
    } else {
      renderStationList(listOfStations);
    }
  }

  function assignPoints(stationData, stationLetters) {
    for(station in stationData) {
      let set = stationData[station]['set'];
      let stationPoints = addLetterPoints(set, stationLetters);
      stationData[station]['points'] = stationPoints;
    }
    selectStation(stationData);
    return stationData;
  }

  function addLetterPoints(set, stationLetters) {
    let stationPoints = 0;
    for(let letter of set) {
      if(stationLetters[letter]){
        stationPoints += stationLetters[letter]['points'];
      }
    }
    return stationPoints;
  }

  function selectStation(stationData) {
    let selectedStation = {};
    let highestPoint = 0;
    for(station in stationData) {
      let points = stationData[station]['points'];
      let stationName = stationData[station]['name'];
      let set = new Set(stationData[station]['set']);
      if(highestPoint < points) {
        highestPoint = points;
        selectedStation = {key: station, name: stationName, set: set};
      }
    }
    updateData(stationData, selectedStation, stationLetters, listOfStations);
    return selectedStation;
  }

  function updateData(stationData, selectedStation, stationLetters, listOfStations) {
    'use strict';
    listOfStations.push(selectedStation);
    delete stationData[selectedStation.key];
    delete stations[selectedStation.key];
    for(let letter of selectedStation.set) {
      alphabet = alphabet.replace(letter, '');
      delete stationLetters[letter];
    }
    return createStationData(stations, alphabet);
  }

  function renderStationList(list) {
    let stationsList = document.getElementById('selectedStation');
    const length = list.length;
    for(let i = 0; i < length; i++) {
      let li = document.createElement('li');
      li.innerHTML = list[i].name;
      stationsList.appendChild(li);
    }
  }
  createStationData(stations, alphabet);
}());
