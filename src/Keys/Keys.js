import React, { Component } from 'react'
import './Keys.css'
import { KeyboardState } from '../Keyboard/KeyboardState'
import { EngineContext } from '../Engine/EngineContext'


class Keys extends Component {
  constructor(props){
    super()
    this.state = {
      css: 'default',
      active: false
    }
    
    this.props = props;

    this.keyClick = (e) => {
      this.setState({active : !this.state.active})

      //this.setState({css: [this.props.arpActive ? 'arp-active' : this.props.stepActive ? 'step-active' : '']})
      /*switch (this.props.action ){
      case 'activate' :
        !this.props.arpActive ?
          this.props.activate(props.index)
          :
          this.props.deActivate(props.index)
        break;
      case 'store' :
        this.props.listener(this.props.index)
        //this.props.store([props.index, props.freq]);
        break;
      default:
        console.log(props.index);
      }*/
    }
    
    this.press = () => {
      this.setState({css: 'press'})
    }

    this.pressRelease = () => {
      this.props.listener(this.props.index)
      this.setState({css: 'default'})
    }

    this.getNode = node => {
      this.keyNode = node;
    }
  }
  componentDidUpdate(){
  }
  render(){
    var colorActive = this.state.active ? 'active' : 'default';
    var colorStep = this.props.stepActive ? 'step' : '';
    //+ ' ' + colorArp + ' ' + ' ' + colorStep
    return(
      <EngineContext.Consumer>
        {engine => (
          <KeyboardState.Consumer>
            {keyb => (
              <div className = {'key '+ this.props.type + ' ' + keyb.view  + ' ' + this.state.css + ' ' + this.props.classes[0] + ' ' + (engine.noteOn[0] === this.props.index ? engine.noteOn[1] : 'note-off') + ' ' + colorActive}
                   onMouseDown={this.press}
                   onMouseUp={this.pressRelease}
                   style = {keyb.view === 'logarithmic' ? {width : 11*1/Math.pow(2, (this.props.widget)/12)+'%'} : {}}>
                <div className='key-inner'>
                  <div className='key-text'>
                    <div>{Math.round(this.props.freq)}Hz<br/>
                      {this.props.index} <br />
                      {this.props.nom}  <br/>
                      {this.props.type ==='white-key' ? this.props.pos % 7 + 1 : null}</div>
                  </div>
                </div>
              </div>)}
          </KeyboardState.Consumer>)}
        </EngineContext.Consumer>
    )
  }
}
export default (Keys)


