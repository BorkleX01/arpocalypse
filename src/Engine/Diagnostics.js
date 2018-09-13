import React, { Component } from 'react'
import './Engine.css'
class Diagnostics extends Component {
  constructor(props){
    super()
    this.state = {
      gain : 0.10,
      freqDefault: 440,
      part: 1000,
      logSlider : 0,
      floor: 16.35,
      ceil: /*7902*/ 1200,
      engineOn: false,
      osc: ''
    }
    var audioCtx = props.ctx
    var gainNode = props.gain
    var oscillator
    console.log(audioCtx.state === 'running');
    this.state.engineOn = (audioCtx.state === 'running' ?  true : false);

    this.startTestEngine = () => {
      console.log('start engine');
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.setState({engineOn: true})
      
    }

    this.pauseEngine = () => {
      audioCtx.suspend();
      this.setState({engineOn: false})
    }

    this.closeEngine = () => {
      this.setState({engineOn: false})
      audioCtx.close()
    }

    this.resumeEngine = () => {
      this.setState({engineOn: true})
      audioCtx.resume()
    }

    this.createOsc = () => {
      oscillator = audioCtx.createOscillator();
      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(this.state.gain, audioCtx.currentTime);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      this.setState({osc : 'create'})
    }

    this.connectOsc = () => {
      oscillator.connect(gainNode);
      this.setState({osc : 'connect'})
    }

    this.startOsc = () => {
      oscillator.start();
      this.setState({osc : 'start'})
    }
    
    this.stopOsc = () => {
      oscillator.stop();
      gainNode.disconnect();
      this.setState({osc : 'stop'})
    }

    this.slideCeiling = (e) => {
      this.setState({ceil : e.target.value})
      if(oscillator){
        oscillator.frequency.setValueAtTime(e.target.value, audioCtx.currentTime);
      }
    }

    this.slideFloor = (e) => {
      this.setState({floor : e.target.value})
      if(oscillator){
        oscillator.frequency.setValueAtTime(e.target.value, audioCtx.currentTime);
      }
      
    }

    this.slidePart = (e) => {
      this.setState({part : e.target.value})
      //oscillator.frequency.setValueAtTime(e.target.value, audioCtx.currentTime);
    }
  }
  render(){
    return(
      <div>
        <div>
          <div>Audio Context Test</div>
          <button onClick={this.startTestEngine}>START</button>
          <button onClick={this.closeEngine}>CLOSE</button>
          <button onClick={this.pauseEngine}>SUSPEND</button>
          <button onClick={this.resumeEngine}>RESUME</button>
        </div>
        <br/>
        {this.state.engineOn ? 
          (<div>
            <div>Oscillator Node</div>
            <button onClick={this.createOsc}>CREATE</button>
              <button onClick={this.connectOsc}>CONNECT</button>
                {this.state.osc !== 'stop' ?  
                 <div>{this.state.osc === 'start' ? <button onClick={this.stopOsc}>STOP</button> : <button onClick={this.startOsc}>START</button> }</div> : null}
          </div>)
          : 
         <div>Diagnostic Audio Context Off</div>}
        <div> Freq range </div>
        <div>{this.state.toneInterval}</div>
        <div>{this.state.floor}</div> Floor
        <input type="range" min="0" value={this.state.floor} max={this.state.part}  className="slider" onChange={this.slideFloor} />

        <div>{this.state.part}</div> Partition
        <input type="range" min='30' max="3999" value={this.state.part} className="slider" onChange={this.slidePart}  />

        
        <div>{this.state.ceil}</div> Ceiling
        <input type="range" min={this.state.part} value={this.state.ceil} max='4000'  className="slider" onChange={this.slideCeiling} />
        
      </div>

    )
  }
}
export default (Diagnostics)
