import React,  { Component } from 'react'
import { Keys } from '../Keys'
import './Keyboard.css'
import { keys } from '../Scale/Diatonic'
import { Role }  from '../Role'
import { EngineContext } from '../Engine/EngineContext'
import { KeyboardState } from '../Keyboard/KeyboardState'

class Keyboard extends Component {
  constructor(props){
    super()
    this.props = props
    this.state = {
      range : props.range,
      active : false,
      view : 'piano',
      mode : props.sequencer,
      notes: [],
      freq: [],
      intervals: [],
      keyArr: [],
      seqArr: [],
      arpArr: []
    }

    var data = keys(8)
    this.state.notes = data.note
    this.state.freq = data.freq
    this.state.int = data.intervals
    
    var pos = 0;
    var keyObj = this.state.notes.map((o, i, arr) => { return {int:o, pos: (o === 1 ? pos : pos++) , freq : this.state.freq[i], type: (o === 0.5 ? 'white-key' : 'black-key')}  })
    var genKeys = (keys) => {
      console.log('genKeys');
      return keys.length > 0 ?
        keys.reduce((acc = [] , o , i) =>
                    {if(i>=props.range[0] && i<=props.range[1]){
                      acc.push( <Keys
                                key={acc.length}
                                widget={acc.length}
                                index={i}
                                pos={o.pos}
                                type={o.type}
                                classes={['created']}
                                freq={o.freq}
                                nom={data.nomenclature[o.pos]}
                                action={props.sequencer === 'step' ? 'store': 'activate'}
                                listener={keyListener}>
                                </Keys> )}
                     return acc
                    }, [])
        : 'No Data'
    }

    this.renderKeys = (keys) => {
      console.log('renderKeys');
      return keys.length > 0 ?
        keys.map((key) => key)
        : 'No Keys'
    }

    var keyListener = (key) => {
      if(this.state.mode === 'step'){
        this.setState({seqArr: [...this.state.seqArr, key]})
      }
      if(this.state.mode === 'arp'){
        this.setState({arpArr: [...this.state.arpArr, key]})
      }
    }

    this.clearSeq = () => {
      this.setState({seqArr: []})
    }

    this.roleListener = (e) => {
      let newArr = this.state.seqArr;
      newArr.splice(+e[0], 1);
      this.setState({seqArr: newArr})
    }
    
    this.state.keyArr = genKeys(keyObj);
    
    this.modeClick = (e) => {
      this.setState({mode: e.target.name})
      
    }
    this.viewClick = (e) => {
      this.setState({view: e.target.name})
    }
  }
  
  render() {
    
    return(
      <EngineContext.Consumer>
        {engine =>(
          <div className='keyboard-outer'>
            <div  className='lhs-tabs'>
              <button onClick={this.viewClick} name='piano'>Piano</button>
              <button onClick={this.viewClick} name='squares'>Grid</button>
              <button onClick={this.viewClick} name='squares octave'>Octave</button>
              <button onClick={this.viewClick} name='logarithmic'>Logarithmic</button>
            </div>
            <div className='rhs-tabs'>
              <button onClick={this.modeClick} name='step'>Step Seq</button>
              <button onClick={this.modeClick} name='arp'>Arpeggiator</button>
            </div>
            <div className='keyboard'>
              <KeyboardState.Provider value={this.state}>
                {this.renderKeys(this.state.keyArr)}
              </KeyboardState.Provider>
              <br/>
              <div className='instruments'>
              {this.state.mode === 'step' ?
                <Role module={this.state.mode} clear={this.clearSeq} freq={this.state.freq} playNote={engine.playNote} seq={this.state.seqArr} listener={this.roleListener} tempo={engine.tempo} />
                  :
                null }
                {this.state.mode === 'arp' ?
                  <Role module={this.state.mode} clear={this.clearSeq} freq={this.state.freq} playNote={engine.playNote} seq={this.state.arpArr} listener={this.roleListener} tempo={engine.tempo} />
                    :
                  null }
              </div>
            </div>
            <br/>
          </div>)}
        </EngineContext.Consumer>
     )}
}

export default Keyboard
