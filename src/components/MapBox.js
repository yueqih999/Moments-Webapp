import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containStyle = {
    width: '400px',
    height: '200px'
};

const center = {
    lat: 40.45,
    lng: -73.58
};

const MapBox = ({ location }) => {
    return (
        <LoadScript
            googleMapsApiKey="AIzaSyDbkN1jo0QsuDYJBW88gPhB7HGmpK4_V9c"
        >
            <GoogleMap
                mapContainerStyle={containStyle}
                center={location || center}
                zoom={10}
            >
                {location && <Marker position={{lat: location.lat, lng: location.lng}} />}
            </GoogleMap>
        </LoadScript>
    )
}

export default MapBox;