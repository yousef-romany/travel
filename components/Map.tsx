// components/MapComponent.js
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";

// Dynamically import the MapContainer and other Leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });


const MapComponent = ({
  title,
  lat,
  lng,
}: {
  title: string;
  lat: number;
  lng: number;
}) => {
  return (
    <MapContainer
      center={[Number(lat), Number(lng)]}
      zoom={13}
      scrollWheelZoom={false} 
      zoomControl={false}    
      touchZoom={false}      
      // style={{ height: "0px", width: "350px" }}
      className="rounded-lg z-[-1] w-full lg:h-[500px] md:h-[300px] sm:h-[450]" 
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[Number(lat), Number(lng)]}>
        <Popup>{title}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
