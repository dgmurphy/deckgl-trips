/* global window */
import React, { Component } from 'react';
import DeckGL, { ArcLayer, IconLayer, LineLayer, PolygonLayer } from 'deck.gl';
import TripsLayer from './trips-layer';

const FIRE_ARC_DURATION = 20.0;   // minutes

const ICON_MAPPING = 
  {
    "marker-blank": {
      "x": 0,
      "y": 0,
      "width": 128,
      "height": 128,
      "anchorY": 128,
      "mask": true
    },
    "marker-green": {
      "x": 256,
      "y": 0,
      "width": 128,
      "height": 128,
      "anchorY": 128,
      "mask": false
    },
    "hit-clear": {
      "x": 0,
      "y": 256,
      "width": 128,
      "height": 128,
      "anchorY": 128,
      "mask": true
    },
    "hit-white": {
      "x": 128,
      "y": 256,
      "width": 128,
      "height": 128,
      "anchorY": 128,
      "mask": false
    },
    "hit-orange": {
      "x": 256,
      "y": 256,
      "width": 128,
      "height": 128,
      "anchorY": 128,
      "mask": false
    },
    "hit-red": {
      "x": 384,
      "y": 256,
      "width": 128,
      "height": 128,
      "anchorY": 128,
      "mask": false
    },
    "fire-yellow": {
      "x": 256,
      "y": 128,
      "width": 128,
      "height": 128,
      "anchorY": 128,
      "mask": false
    },
    "detonation-purple": {
      "x": 256,
      "y": 384,
      "width": 128,
      "height": 128,
      "anchorY": 128,
      "mask": false
    }
  } 


export default class DeckGLOverlay extends Component {
  static get defaultColorRange() {
    return colorRanges[0];
  }

  static get defaultViewport() {
    return {
      longitude: -116.67,
      latitude: 35.27,
      zoom: 12.7,
      minZoom: 1,
      maxZoom: 18,
      pitch: 79,
      bearing: 0
    };
  }

  constructor(props) {
    super(props);
    this.startAnimationTimer = null;
    this.intervalTimer = null;
  }


  handleLayerClick(info) {
    this.props.onLayerClick(info);
  }


  calcOpacity(mapObject, thisMinute, maxOpacity) {
    let opacity_min = 0;
    let myMinute = ((mapObject.actual_time_millis - this.props.startMillis)/1000.0)/60.0;
    let deltaT = thisMinute - myMinute;
    if ((deltaT < 0) || (deltaT > FIRE_ARC_DURATION)) {
      return opacity_min;
    } else {
      let opacity = 1.0 - deltaT/FIRE_ARC_DURATION;
      opacity = maxOpacity * opacity;
      if (opacity < opacity_min)
        opacity = opacity_min;

      let opint = Math.floor(opacity);
      return opint;
    }

  }


  calcEllipseLineColor(ellipseObject, currentMin, useTime) {
    let op = 128;
    if (useTime)
      op = this.calcOpacity(ellipseObject, currentMin, 128);
    return [80, 0, 80, op];
  } 


  calcEllipseFillColor(ellipseObject, currentMin, useTime) {
    let op = 32;
    if (useTime)
      op = this.calcOpacity(ellipseObject, currentMin, 64);
    return [80, 45, 90, op];
  } 

  calcImpactColor(impactObject, currentMin, useTime) {
    let op = 64;
    if (useTime)
      op = this.calcOpacity(impactObject, currentMin, 255);
    return [128,0,128,op];
  } 

  calcSrcColor(mapObject, currentMin, useTime) {
    let op = 128;
    if (useTime)
      op = this.calcOpacity(mapObject, currentMin, 255);
    return [0,0,0,op];
  } 

  calcTgtColor(arcObject, currentMin, useTime) {
    let op = 128;
    if (useTime)
      op = this.calcOpacity(arcObject, currentMin, 255);
    return [255,0,0,op];
  } 

  getHitIcon(hit) {

    let iconName = "hit-clear"   
    switch(hit.hit_type) {
      case '0':
        iconName = "hit-clear"; //unk
        break;
      case '1':
        iconName = "hit-white"; //miss
        break;
      case '2':
        iconName = "hit-orange"; //near miss
        break;
      case '3':
        iconName = "hit-red";  //hit
        break;
    }
    return iconName;
  }


  buildTripsLayer() {

    let currentSeconds = this.props.minute * 60;
    let useTime = this.props.useTime;

    //console.log(this.props.trackingData[0]);
    //console.log(currentMillis)

    let layer = new TripsLayer({
      parameters: {
        depthTest: false
      },      
      id: 'trips',
      data: this.props.trackingData,
      getPath: d => d.segments,
      getColor: d => [100, 190, 100],
      opacity: 0.5,
      trailLength: 100,
      currentTime: currentSeconds
    });

    return layer
  }


  // Impact zone ellipses
  buildImpactEllipsesLayer() {

    let currentMin = this.props.minute;
    let useTime = this.props.useTime;

    let layer = new PolygonLayer({
      parameters: {
        depthTest: false
      },      
      id: 'impactellipses-layer',
      data: this.props.ellipseData,
      pickable: true,
      stroked: true,
      filled: true,
      wireframe: true,
      lineWidthMinPixels: 1,
      getPolygon: d => d.contour,
      getElevation: d => d.num_detonations * 5,  //use num dets here
      extruded: true,
      getFillColor: d => this.calcEllipseFillColor(d, currentMin, useTime),
      getLineColor: d => this.calcEllipseLineColor(d, currentMin, useTime),
      getLineWidth: 1,
      onHover: this.props.onHover,
      onClick: this.props.onClick,
      autoHighlight: false,
      updateTriggers: {
        getFillColor: {
          currentMin: currentMin,
          useTime: useTime
        },
        getLineColor: {
          currentMin: currentMin,
          useTime: useTime
        }       
      }
    });

    return layer
  }


  // Impact AXES (from multiple detonations tm)
  buildImpactsLayer() {

    let currentMin = this.props.minute;
    let useTime = this.props.useTime;

    let layer = new LineLayer({
      parameters: {
        depthTest: false
      },      
      id: 'impactlines-layer',
      data: this.props.impactsData,
      pickable: true,
      getStrokeWidth: 3,
      getSourcePosition: d => d.from,
      getTargetPosition: d => d.to,
      getColor: d => this.calcImpactColor(d, currentMin, useTime),
      updateTriggers: {
        getColor: {
          currentMin: currentMin,
          useTime: useTime
        }
      }
    });

    return layer  

  }


  // Multiple Detonations Layer
  buildDetonationsLayer() {
    let currentMin = this.props.minute;
    let useTime = this.props.useTime;

    let layer = new IconLayer({
      parameters: {
        depthTest: false
      },      
      id: 'detonations-layer',
      data: this.props.detonationsData,
      pickable: true,
      iconAtlas: 'images/engagements-icon-atlas.png',
      iconMapping: ICON_MAPPING,
      getPosition: d => d.coordinates,
      getIcon: d => 'detonation-purple',
      getSize: d => 45,
      getColor: d => this.calcSrcColor(d, currentMin, useTime),
      getAngle: d => 60,
      sizeScale: 1,
      onHover: this.props.onHover,
      onClick: this.props.onClick,
      updateTriggers: {
        getColor: {
          currentMin: currentMin,
          useTime: useTime
        }
      }
    });

    return layer       
  }

  // Multiple Fire Messages
  buildFiresLayer() {

    let currentMin = this.props.minute;
    let useTime = this.props.useTime;

    let layer = new IconLayer({
      parameters: {
        depthTest: false
      },      
      id: 'fires-layer',
      data: this.props.firingData,
      pickable: true,
      iconAtlas: 'images/engagements-icon-atlas.png',
      iconMapping: ICON_MAPPING,
      getPosition: d => d.coordinates,
      getIcon: d => 'fire-yellow',
      getSize: d => 45,
      getColor: d => this.calcSrcColor(d, currentMin, useTime),
      getAngle: d => 20,
      sizeScale: 1,
      onHover: this.props.onHover,
      onClick: this.props.onClick,
      updateTriggers: {
        getColor: {
          currentMin: currentMin,
          useTime: useTime
        }
      }
    });

    return layer   
  }



  // Hit Message Icons
  buildHitLayer() {

    let currentMin = this.props.minute;
    let useTime = this.props.useTime;

    let layer = new IconLayer({
      parameters: {
        depthTest: false
      },      
      id: 'hit-layer',
      data: this.props.hitData,
      pickable: true,
      iconAtlas: 'images/engagements-icon-atlas.png',
      iconMapping: ICON_MAPPING,
      getPosition: d => d.target.coordinates,
      getIcon: d => this.getHitIcon(d),
      getSize: d => 45,
      getColor: d => this.calcSrcColor(d, currentMin, useTime),
      getAngle: d => -20,
      sizeScale: 1,
      onHover: this.props.onHover,
      onClick: this.props.onClick,
      updateTriggers: {
        getColor: {
          currentMin: currentMin,
          useTime: useTime
        }
      }
    });

    return layer   
  }

  // STP Entity Icon Layer
  buildIconLayer() {

    let layer = new IconLayer({
      parameters: {
        depthTest: false
      },      
      id: 'icon-layer',
      data: this.props.entityData,
      pickable: true,
      iconAtlas: 'images/engagements-icon-atlas.png',
      iconMapping: ICON_MAPPING,
      getPosition: d => d.coordinates,
      getIcon: d => (d.name === 'NONE' ? 'marker-blank' : 'marker-green'),
      getSize: d => 45,
      getColor: d => [0, 0, 0, 140],
      getAngle: d => -60,
      sizeScale: 1,
      onHover: this.props.onHover,
      onClick: this.props.onClick,
    });
    return layer
  }

  buildArcLayer() {
    
    let currentMin = this.props.minute;
    let useTime = this.props.useTime;

    let layer = new ArcLayer({
      parameters: {
        depthTest: false
      },      
      id: 'arc-layer', 
      data: this.props.data[0],
      pickable: true,
      getStrokeWidth: 5,
      getSourcePosition: d => d.from.coordinates,
      getTargetPosition: d => d.to.coordinates,
      getSourceColor:   d => this.calcSrcColor(d, currentMin, useTime),
      getTargetColor: d => this.calcTgtColor(d, currentMin, useTime),
      onHover: this.props.onHover,
      onClick: this.props.onClick,
      autoHighlight: false,
      updateTriggers: {
        getTargetColor: {
          currentMin: currentMin,
          useTime: useTime
        },
        getSourceColor: {
          currentMin: currentMin,
          useTime: useTime
        }
      }

    });  
    return layer;
  }


  render() {
    const { viewport, data } = this.props;

    if (!data) {
      return null;
    }

    let layers = [];

    if (this.props.showHits)
      layers.push(this.buildHitLayer());
    if (this.props.showSTParcs)
      layers.push(this.buildArcLayer());
    if (this.props.showSTPpins)
      layers.push(this.buildIconLayer());
    if (this.props.showFires)
      layers.push(this.buildFiresLayer());
    if (this.props.showDetons)
      layers.push(this.buildDetonationsLayer());
    if (this.props.showImpacts) {
      layers.push(this.buildImpactEllipsesLayer());
    }
    if (this.props.showTrips) {
      layers.push(this.buildTripsLayer());
    }
     // layers.push(this.buildImpactsLayer());  // SHOW ELLIPSE AXES

    


    return <DeckGL {...viewport} layers={layers} onLayerClick={this.handleLayerClick.bind(this)} />;
  }
}

DeckGLOverlay.displayName = 'DeckGLOverlay';
