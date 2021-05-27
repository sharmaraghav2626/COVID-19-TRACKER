import React from "react";
import {Map, TileLayer} from "react-leaflet";
import "./Map.css";
import { showDataOnMap} from "./util";
import Routing from "./RoutingMachine";

class MapJs extends React.Component {
  constructor() {
    super();
    this.state = {
      isMapInit: false
    };
  }
  saveMap = map => {
    this.map = map;
    this.setState({
      isMapInit: true
    });
  };
  render() {
    return (
      <div className="map">
        
      <Map center={this.props.center} zoom={this.props.zoom} ref={this.saveMap}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        { this.state.isMapInit && showDataOnMap(this.props.countries,this.props.casesType)}
        { this.props.findRoute===true && this.props.long!=='' && this.props.lat!=='' && <Routing map={this.map} lat={this.props.lat} long={this.props.long} destLat={this.props.destLat} destLong={this.props.destLong} setCenter={this.props.setCenter}/>} 
      </Map>
      </div>
    );
  }
}
export default MapJs;
