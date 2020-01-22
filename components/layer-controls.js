import React, { Component } from 'react'
import { Slider, Switch, Radio } from "@blueprintjs/core"
import InfoBox from './info-box'

class LayerControls extends Component {

  constructor(props) {

    super(props);

  }

  handleSwitch(e) {

    e.currentTarget.blur();  // fix for outline being drawn in chrome
    // tell the parent the new selector state
    this.props.updateSwitches(e.currentTarget.name, e.currentTarget.checked);
  }


  handleBaseMapChange(e) {

        e.currentTarget.blur();  // fix for outline being drawn in chrome
        var baseName = e.currentTarget.value;
        
        // tell the parent the new baseMap url
        this.props.updateBaseMap(baseName);
  }


  render() {

    return (
      <div>
        <div className="useTimeSwitch">
          <Switch checked={this.props.useTime}
            label="Time Control (minutes from start)"
            name="timecontrol"
            onChange={this.handleSwitch.bind(this)}
          />
        </div>

        <TimeSlider
          minute={this.props.minute}
          updateMinute={this.props.updateMinute}
          timeEnabled={this.props.useTime}
        />


      <div>
        <table style={{width:'100%', marginLeft:'26px', marginBottom:'14px'}}>
          <tbody>
          <tr>
            <td><Radio label="Sat map" 
                       value="satmap" 
                       checked={this.props.mapStyle === 'satmap'}
                       onChange={this.handleBaseMapChange.bind(this)}/>
            </td>
            <td><Radio label="Dark map" 
                       value="darkmap" 
                       checked={this.props.mapStyle === 'darkmap'}
                       onChange={this.handleBaseMapChange.bind(this)}/>
            </td>
          </tr>
          </tbody>
        </table>
      </div>




      <div>
        <table style={{width:'100%'}}>
          <tbody>
          <tr>
            <td>        
              <STPcontrols
                showSTParcs= {this.props.showSTParcs} 
                handleArcs = {()=>{console.log("arcs")}}
                handleSwitch = {this.handleSwitch.bind(this)}
              />
            </td>
            <td>
               <STTEntityControls
                showSTPentities= {this.props.showSTPpins}
                handleEntityIcons = {()=>{console.log("icons")}}
                handleSwitch = {this.handleSwitch.bind(this)}
              />
            </td> 
          </tr>
          <tr>
            <td>        
              <HitControls
                showHits= {this.props.showHits}
                handleSwitch = {this.handleSwitch.bind(this)}
              />
            </td>
            <td>
              <FireControls
                showFires={this.props.showFires}
                handleSwitch = {this.handleSwitch.bind(this)}
              />
            </td> 
          </tr>
          <tr>
            <td>        
              <DetonationControls
                showDetons={this.props.showDetons}
                handleSwitch={this.handleSwitch.bind(this)}
              />
            </td>
            <td>
              <ImpactControls
                showImpacts={this.props.showImpacts}
                handleSwitch = {this.handleSwitch.bind(this)}
              />
            </td> 
          </tr>
          <tr>
            <td>
              <TrackingControls
              showTrips={this.props.showTrips}
              handleSwitch={this.handleSwitch.bind(this)}
              />
            </td>
            <td></td>
          </tr>
          </tbody>
        </table>
      </div>

      
      
      <InfoBox
          eventInfo={this.props.eventInfo}
          clickedInfo={this.props.clickedInfo}
          layerYear={this.props.year}
          eventCount={this.props.eventCount}
          startMillis={this.props.startMillis}
        />
      </div>
    )
   }
  }    // end of class

function TrackingControls(props) {
  return (
    <div className="stp-controls">
      <div className="stp-switches">
         <Switch checked={props.showTrips}
          label="Tracking"
          name="trips"
          onChange={props.handleSwitch.bind(this)}
        />
      </div>
    </div>
  );
}


function FireControls(props) {
  return (
    <div className="stp-controls">
      <div className="stp-switches">
         <Switch checked={props.showFires}
          label="Firings"
          name="fire-pins"
          onChange={props.handleSwitch.bind(this)}
        />
      </div>
    </div>
  );  
}


function HitControls(props) {
  return (
    <div className="stp-controls">
      <div className="stp-switches">
         <Switch checked={props.showHits}
          label="Hits"
          name="hit-pins"
          onChange={props.handleSwitch.bind(this)}
        />
      </div>
    </div>
  );
}



function ImpactControls(props) {
  return (
    <div className="stp-controls">
      <div className="stp-switches">
         <Switch checked={props.showImpacts}
          label="Impacts"
          name="impacts"
          onChange={props.handleSwitch.bind(this)}
        />
      </div>
    </div>
  );
}



function DetonationControls(props) {
  return (
    <div className="stp-controls">
      <div className="stp-switches">
         <Switch checked={props.showDetons}
          label="Detonations"
          name="detonation-pins"
          onChange={props.handleSwitch.bind(this)}
        />
      </div>
    </div>
  );
}


function STTEntityControls(props)  {
  return (
    <div className="stp-controls">
      <div className="stp-switches">
        <Switch checked={props.showSTPentities}
          label="Pairing Pins"
          name="stp-pins"
          onChange={props.handleSwitch.bind(this)}
        />
      </div>
    </div>
  );
  
}


function STPcontrols(props) {

  return (
    <div className="stp-controls">
      <div className="stp-switches">
        <Switch checked={props.showSTParcs}
          label="Pairing Arcs"
          name="stp-arcs"
          onChange={props.handleSwitch.bind(this)}
        />
      </div>
    </div>
  );

}

function TimeSlider(props) {
  return (
    <div className="time-slider">
      <Slider
        min={0}
        max={85}
        stepSize={0.25}
        onChange={props.updateMinute}
        value={props.minute}
        labelRenderer={true}
        labelStepSize={15}
        vertical={false}
        showTrackFill={false}
        disabled={!(props.timeEnabled)}
      />
    </div>
    );
  }

export default LayerControls;
