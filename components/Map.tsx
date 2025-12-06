// components/MapComponent.js
"use client";

import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import Leaflet with no SSR
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Fix Leaflet default marker icon issue with Next.js - only run on client
    if (typeof window !== 'undefined') {
      const L = require('leaflet');
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });
    }
  }, []);

  // Don't render map on server
  if (!isClient) {
    return (
      <div className="rounded-lg w-full lg:h-[500px] md:h-[300px] sm:h-[450px] bg-muted animate-pulse flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={[Number(lat), Number(lng)]}
      zoom={13}
      scrollWheelZoom={false}
      zoomControl={false}
      touchZoom={false}
      className="rounded-lg z-[-1] w-full lg:h-[500px] md:h-[300px] sm:h-[450px]"
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
