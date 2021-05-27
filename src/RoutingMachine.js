import L from "leaflet";
import "leaflet-routing-machine";
import { withLeaflet } from "react-leaflet";
import { MapLayer } from "react-leaflet";
    
class Routing extends MapLayer {
  constructor(props){
    super(props);
    let leafletElement=null;
  }
  createLeafletElement() {
    this.props.setCenter([this.props.lat,this.props.long]);
    const { map } = this.props;
    var greenIcon = new L.Icon({
        iconUrl: 'https://firebasestorage.googleapis.com/v0/b/corona-tracker-4c067.appspot.com/o/icons8_marker_80px.png?alt=media&token=a03e4693-0fae-434f-8046-07e64fbfe8b0',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });  
      var redIcon = new L.Icon({
        iconUrl: 'https://firebasestorage.googleapis.com/v0/b/corona-tracker-4c067.appspot.com/o/icons8_marker_96px.png?alt=media&token=d22dac13-5919-401a-bc8a-f213675dca6f',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
     this.leafletElement= L.Routing.control({
        waypoints: [
        L.latLng(this.props.lat,this.props.long),
      ],createMarker: function(i, wp, nWps) {
        if (i === 0) {
          return L.marker(wp.latLng, {
            icon: greenIcon // here pass the custom marker icon instance
          });
        } else if(i === nWps - 1){
          // here change all the others
          return L.marker(wp.latLng, {
            icon: redIcon
          });
        }
      },
      lineOptions: {
        styles: [
          {
            color: "blue",
            opacity: 0.6,
            weight: 4
          }
        ]
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: false,
      showAlternatives: false
    }).addTo(map.leafletElement);
    return this.leafletElement.getPlan();
  }
  updateLeafletElement(props){
    this.leafletElement.spliceWaypoints(1,1,L.latLng(this.props.destLat,this.props.destLong));
  }
}
export default withLeaflet(Routing);
