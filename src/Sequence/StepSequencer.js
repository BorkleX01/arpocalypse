import React,  { Component } from 'react'
class Transport extends Component{
  constructor(props){
    super();
    this.state = {
      timer: 0,
      isPlaying: false,
      timers : 0,
      autoStart: false,
    }

    var seqTimerBuffer = [];
    var startTime = 0;

    this.startSequencer = () => {
      let seqTimer = setInterval(() => {
        if(seqTimerBuffer.indexOf(seqTimer) === -1)seqTimerBuffer.push(seqTimer);
        procNotes();
        this.setState({timers : seqTimerBuffer.length, timer: startTime, isPlaying: true})
      }, 60000/this.props.tempo)
      
    }

    var procNotes= () => {
      if (startTime >= this.props.seq.length ){startTime = 0}
      this.setState({timer: startTime})
      if(this.props.seq[startTime] != undefined){
        this.props.play(this.props.seq[startTime])
        startTime = startTime+1;
      }
    }

    this.stopSequencer = () => {
      while(seqTimerBuffer.length > 0){clearInterval(seqTimerBuffer.pop(seqTimerBuffer))}
      this.setState({isPlaying: false, timers : seqTimerBuffer.length})
    }
    

    this.doToNote = (e ,o) => {
      props.delete(o.value)
    }
  }
  render(){
    return(<div className='panel '>
           <button onClick={this.startSequencer}>START SEQ</button>
           <button onClick={this.stopSequencer}>STOP SEQ</button>
           Tempo: {this.props.tempo}
           Timers: {this.state.timers}
           Step: {this.state.timer}
           </div>)
  }
}

export {Transport}
