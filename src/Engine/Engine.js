import React, { Component } from 'react'
import './Engine.css'
import Diagnostics from './Diagnostics'
import { EngineContext } from './EngineContext'
import { Keyboard } from '../Keyboard';

class Engine extends Component {
  constructor(props) {
    super()
    this.state = {
      bogus: 'bogusY',
      gain : 0.10,
      freqDefault: 440,
      part: 1000,
      logSlider : 0,
      toneInterval : 0.38,
      tempo: 135,
      timer: 0,
      floor: 16.35,
      ceil: /*7902*/ 1200,
      engineOn: false,
      osc: [],
      diag: false,
      isPlaying: false,
      sustain: 3,
      autoStart: false,
      arpTimer: [],
      trigTimer: [],
      trigger: true,
      arpFreq: 4,
      arpRepeats: 1,
      arpExpand: 2,
      arpContract: 1,
      playNote: '',
      noteOn: []
    }
    
    this.audioCtx = false
    this.gainNode = false

    this.startEngine = () => {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.setState({engineOn: true})
    }
    
    this.createOsc = (id, hz) => {
      if(!isNaN(hz) ){
        !isNaN(id) ? this.setState({noteOn: [id, 'note-on']}) : console.log(id);
        let gainNode = this.audioCtx.createGain();
        gainNode.connect(this.audioCtx.destination, 0);
        let osc = this.audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.linearRampToValueAtTime(hz, this.audioCtx.currentTime);
        osc.connect(gainNode);
        osc.start();
        gainNode.gain.exponentialRampToValueAtTime(Number(this.state.gain), this.audioCtx.currentTime);
        let sus =  Number(this.state.sustain);
        gainNode.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + Number(sus));
        osc.stop(this.audioCtx.currentTime + sus);
        osc.onended = () => {!isNaN(id) ? this.setState({noteOn: [id, 'note-off']}) : console.log(id)}
      }
    }

    this.state.playNote = this.createOsc

    this.slideTempo = (e, o) => {
      let val = e.target.value;
      this.setState({tempo : val})
    }
    
    this.slideGain = (e, o) => {
      let val = e.target.value;
      this.setState({gain : val})
    }
    this.slideSustain = (e, o) => {
      let val = e.target.value;
      this.setState({sustain : val})
    }
    this.diag = () => {
      this.setState({diag : this.state.diag ? false : true})
    }
  }
  componentDidMount(){
    this.startEngine()
  }
  render() {
            return (
              <EngineContext.Provider value={this.state}>
                {this.props.children}
                <div className='engine'>
                  <div className='panel' >
                    <div className='control'>
                      <button onClick={this.startEngine}>Engine {this.state.engineOn ? 'On' : 'Off' }</button>
                    </div>
                    <div className='control'>
                      Tempo:
                      <input type="number" min='0' max="400" value={this.state.tempo} className="input" onChange={this.slideTempo} step='1' />
                      <input type="range" min='0' max="400" value={this.state.tempo} className="slider" onChange={this.slideTempo} step='1' />
                    </div>
                    <div className='control'>
                      Gain: {this.state.gain}
                      <input type="range" min="0.01" max="1" value={this.state.gain} className="slider" onChange={this.slideGain}  step='0.01'/>
                    </div>
                    <div className='control'>
                      Sustain: {this.state.sustain}
                      <input type="range" min="0.01" max="1" value={this.state.sustain} className="slider" onChange={this.slideSustain}  step='0.01'/>
                    </div>
                  </div>
                  <div className='panel'>
                    <button className='button' key={0} onClick={this.diag} >Edit Osc</button>
                    {this.state.diag ?
                      <Diagnostics ctx={this.audioCtx} gain={this.state.gain}/>
                        :
                      null}
                  </div>
                </div>
              </EngineContext.Provider>
      
    )
  }
}
export default Engine
