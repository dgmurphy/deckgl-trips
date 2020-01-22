/* global window,document */
import React, { Component } from 'react';
import { render } from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './components/deckgl-overlay.js';
import LayerControls from './components/layer-controls';
import autobind from 'react-autobind';
import { DataFiles, EntityFile, HitMessageFile, FiringMessageFile, 
         DetonationsMessageFile, ImpactsMessageFile, 
         EllipseMessageFile, TrackingMessageFile } from './components/data-files.js';
import { text as requestText } from 'd3-request';


let MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line
// If not using an environment var, Set your mapbox token here
if (!MAPBOX_TOKEN)
  MAPBOX_TOKEN = "put mapbox token here";

const NUM_DATASETS = 1;
const SATMAP =  'mapbox://styles/mapbox/satellite-streets-v10'
const DARKMAP = 'mapbox://styles/mapbox/navigation-preview-night-v4'


class Root extends Component {

  constructor(props) {

    super(props);
    autobind(this);

    this.state = {
      viewport: {
        ...DeckGLOverlay.defaultViewport,
        width: 500,
        height: 500
      },
      data: [],   // arc data
      entityData: [],  // stp entity locations
      hitData: [], // hit messages
      firingData: [], // multiple firing messages
      detonationsData: [], // multiple detonation messages
      impactsData: [], // multi detonation impacts (lines)
      ellipseData: [], // multi detonation impacts (ellipses)
      trackingData: [], //time stamped entity locations 
      eventInfo: 0,
      clickedInfo: null,
      useTime: false,
      minute: 0,
      showSTParcs: true,
      showSTPpins: true,
      showHits: true,
      showFires: true,
      showDetons: true,
      showImpacts: true,
      showTrips: true,
      allDataLoaded: false,
      mapStyle: 'satmap'
    };

    this.dataArr = [];
    this.dataSetsLoaded = 0;

    //the number of milliseconds since January 1, 1970
    this.DATA_START_MILLIS = 1541091559288;  
    //this.DATA_END_MILLIS =   1541096649113; 
     
  }


  updateBaseMap(bm) {
    this.setState({ mapStyle: bm });
  }


  processDataSet(idx, dataArr) { 

    console.log("Processing data set: #" + idx);
    let darr = dataArr[0];

    
    for (var i = 0; i < darr.length; i++) {
      //add milliseconds version of time
      let millis = Date.parse(darr[i].actual_time);
      darr[i].actual_time_millis = millis;
  
    }

    this.setState({ data: dataArr });
    ++this.dataSetsLoaded;

    if(this.dataSetsLoaded === NUM_DATASETS)
      this.setState({allDataLoaded: true});

   

  }

  
  loadTrackingData() {

    let trackingData;   // this is in the long, lat, millis-from-start format
    requestText(TrackingMessageFile, (error, response) => {
      if (!error) {
        trackingData = JSON.parse(response);
        this.setState({ trackingData: trackingData });
      } else {
        alert(error)
      }
    })
  }

  loadEllipseData() { 

    let ellipseData = [];
    requestText(EllipseMessageFile, (error, response) => {
      if (!error) {
        ellipseData = JSON.parse(response);
        for (var i = 0; i < ellipseData.length; i++) {
          //add milliseconds version of time
          let millis = Date.parse(ellipseData[i].actual_time);
          ellipseData[i].actual_time_millis = millis;
        }         
        this.setState({ ellipseData: ellipseData });
        
      } else {
        alert(error)
      }
    })      
  }


  loadImpactsData() {

    let impactsData = [];
    let linesData = [];
    requestText(ImpactsMessageFile, (error, response) => {
      if (!error) {
        impactsData = JSON.parse(response);

        for (var i = 0; i < impactsData.length; i++) {

          let millis = Date.parse(impactsData[i].actual_time);

          let line1 = {
            "from": impactsData[i].coordinates,
            "to": impactsData[i].major_axis_end,
            "actual_time": impactsData[i].actual_time,
            "message_id": impactsData[i].message_id,
            "actual_time_millis": millis
          }

          let line2 = {
            "from": impactsData[i].coordinates,
            "to": impactsData[i].minor_axis_end,
            "actual_time": impactsData[i].actual_time,
            "message_id": impactsData[i].message_id,
            "actual_time_millis": millis
          }
      
          linesData.push(line1);
          linesData.push(line2)
        }         

        this.setState({ impactsData: linesData });
        

      } else {
        alert(error)
      }
    })      
  }



  loadDetonationsData() {

    let detonationsData = [];
    requestText(DetonationsMessageFile, (error, response) => {
      if (!error) {
        detonationsData = JSON.parse(response);
        for (var i = 0; i < detonationsData.length; i++) {
          //add milliseconds version of time
          let millis = Date.parse(detonationsData[i].actual_time);
          detonationsData[i].actual_time_millis = millis;
        }         
        this.setState({ detonationsData: detonationsData });
      } else {
        alert(error)
      }
    })      
  }



  loadFiringData() {

    let firingData = [];
    requestText(FiringMessageFile, (error, response) => {
      if (!error) {
        firingData = JSON.parse(response);
        for (var i = 0; i < firingData.length; i++) {
          //add milliseconds version of time
          let millis = Date.parse(firingData[i].actual_time);
          firingData[i].actual_time_millis = millis;
        }         
        this.setState({ firingData: firingData });
      } else {
        alert(error)
      }
    })      
  }


  loadHitData() {

    let hitData = [];
    requestText(HitMessageFile, (error, response) => {
        if (!error) {
          hitData = JSON.parse(response);
          for (var i = 0; i < hitData.length; i++) {
            //add milliseconds version of time
            let millis = Date.parse(hitData[i].actual_time);
            hitData[i].actual_time_millis = millis;
          }         
          this.setState({ hitData: hitData });
        } else {
          alert(error)
        }
    })    
  }

  loadEntityData() {

    let entityData = [];
    requestText(EntityFile, (error, response) => {
        if (!error) {
          entityData = JSON.parse(response);
          this.setState({ entityData: entityData });
        } else {
          alert(error)
        }
    })
  }
      

  componentWillMount() {

    this.loadEntityData()
    this.loadHitData()
    this.loadFiringData()
    this.loadDetonationsData()
    this.loadImpactsData()
    this.loadEllipseData()
    this.loadTrackingData()

    let dataArr = []; // stp data
    let i;
    let appThis = this;
    // anonymous self-invoking function in a loop
    //  required because csv loader is async 
    for (i = 0; i < 1; i++) (function (i, appThis) {   // fix iterations

      requestText(DataFiles[i], (error, response) => {
        if (!error) {
          dataArr[i] = JSON.parse(response);
          appThis.processDataSet(i, dataArr);
        } else {
          alert(error)
        }
      });

    })(i, this);

  }

  componentDidMount() {

    window.addEventListener('resize', this._resize.bind(this));
    this._resize();

    // Drop loading graphics
    const lg = document.getElementById('loading-graphics');
    if(lg){
      setTimeout(() => {
        // remove from DOM
        lg.outerHTML = ''
      }, 4000)
    }

  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  }


  handleUpdateMinute(value) {
    this.setState({ minute: value });
  }

  handleUpdateSwitches(whichMarker, value) {
    switch (whichMarker) {
      case 'timecontrol':
        this.setState({ useTime: value });
        //console.log(whichMarker + " : " + value)
        break;

      case 'stp-arcs':
        this.setState({ showSTParcs: value });
        break;

      case 'stp-pins':
        this.setState({ showSTPpins: value });
        break;

      case 'hit-pins':
        this.setState({ showHits: value });
        break;

      case 'fire-pins':
        this.setState({ showFires: value });
        break;

      case 'detonation-pins':
        this.setState({ showDetons: value });
        break;

      case 'impacts':
        this.setState({ showImpacts: value });
        break;

      case 'trips':
        this.setState({ showTrips: value});
        break;

      default:
        console.log("Error in marker display toggle");
        break;
    }
  }

  handleOnHover(info) {
    this.setState({ eventInfo: info });
  }

  handleOnClick(info) {
    this.setState({ clickedInfo: info });
    console.log(info)
  }

  // Fires when blank area is clicked
  handleLayerClick(info) {
    if (info == null)
      this.setState({ clickedInfo: null });
  }


  render() {

    let renderControls = true;
    let ctrlpanel;

    let mapUrl = this.state.mapStyle == 'satmap' ? SATMAP : DARKMAP

    // remove the control panel if desired
    if (renderControls) {
      ctrlpanel =  <LayerControls
            minute={this.state.minute}
            useTime={this.state.useTime}
            startMillis = {this.DATA_START_MILLIS}
            updateMinute={this.handleUpdateMinute.bind(this)}
            eventInfo={this.state.eventInfo}
            clickedInfo={this.state.clickedInfo}
            updateSwitches={this.handleUpdateSwitches.bind(this)}
            showSTParcs = {this.state.showSTParcs}
            showSTPpins = {this.state.showSTPpins}
            showHits = {this.state.showHits}
            showFires = {this.state.showFires}
            showDetons = {this.state.showDetons}
            showImpacts = {this.state.showImpacts}
            showTrips = {this.state.showTrips}
            mapStyle={this.state.mapStyle}
            updateBaseMap={this.updateBaseMap}
          />
    } else {
        ctrlpanel = <br/>
    }

    const { viewport, data } = this.state;

    
    return (
      <div>
        <div id="control-panel">
          <div className="app-title">
            <h3 title="v11.26">NTC-IS Vis</h3>
          </div>
          
          {ctrlpanel}

        </div>
        <MapGL
          {...viewport}
          mapStyle={mapUrl}
          onViewportChange={this._onViewportChange.bind(this)}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        >
          <DeckGLOverlay viewport={viewport} data={data || []}
            onHover={this.handleOnHover}
            onClick={this.handleOnClick}
            onLayerClick={this.handleLayerClick}
            entityData={this.state.entityData}
            hitData={this.state.hitData}
            firingData={this.state.firingData}
            detonationsData={this.state.detonationsData}
            impactsData={this.state.impactsData}
            ellipseData={this.state.ellipseData}
            trackingData={this.state.trackingData}
            useTime={this.state.useTime}
            minute={this.state.minute}
            startMillis={this.DATA_START_MILLIS}
            showSTParcs = {this.state.showSTParcs}
            showSTPpins = {this.state.showSTPpins}
            showHits = {this.state.showHits}
            showFires = {this.state.showFires}
            showDetons = {this.state.showDetons}
            showImpacts = {this.state.showImpacts}
            showTrips = {this.state.showTrips}
          />
        </MapGL>
      </div>
    );
  }
}

render(<Root />, document.body.appendChild(document.createElement('div')));
