import React, { Component } from 'react';
import './App.css';
import { Engine } from './Engine';
import { Keyboard } from './Keyboard';

class App extends Component {
  render() {
    return (
      <div className="App">
        ARPOCALYPSE
        ver 0.0.667
        <Engine>
          <Keyboard range={[24,95]} sequencer='step' />
        </Engine>
        
      </div>
    );
  }
}

export default App;
