import { useEffect, useState } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { PinDropSharp, Room, Star } from '@material-ui/icons';
import axios from "axios"
import { format } from "timeago.js";
import Register from './components/Register.js';
import Login from './components/Login.js';
import "./app.css";

function App() {
  const myStorage = window.localStorage;
  const [locations, setLocations] = useState([]);
  const [userName, setCurrentUsername] = useState(myStorage.getItem("user"));
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDesc] = useState(null);
  const [star, setStar] = useState(1);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 45.436831586,
    longitude: 25.4453,
    zoom: 10
  });

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const handleAddClick = (e) => {
    const [longitude, latitude] = e.lngLat;
    console.log(e.lngLat)
    setNewPlace({
      lat: latitude,
      long: longitude,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newLocation = {
      username: userName,
      title,
      description,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post("/locations", newLocation);

      setLocations([...locations, res.data]);
      setNewPlace(null)
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const getLocations = async () => {
      try {
        const allLocations = await axios.get("/locations");
        setLocations(allLocations.data);
        console.log(allLocations.data)
      } catch (err) {
        console.log(err);
      }
    };
    getLocations();
  }, [])

  const handleLogout = () => {
    setCurrentUsername(null);
    myStorage.removeItem("user");
  };

  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={nextViewport => setViewport(nextViewport)}
        mapStyle="mapbox://styles/dinualin99/ckyaudnlhcl3b14ruokrg4ml0"
        onDblClick={userName && handleAddClick}

      >
        {locations.map((l) => (
          <>
            <Marker
              latitude={l.lat}
              longitude={l.long}
              offsetLeft={-3.5 * viewport.zoom}
              offsetTop={-7 * viewport.zoom}
            >
              <Room
                style={{
                  fontSize: 7 * viewport.zoom,
                  color:
                    userName === l.username ? "tomato" : "slategray",
                  cursor: "pointer"
                }}
                onClick={() => handleMarkerClick(l._id, l.lat, l.long)}
              />
            </Marker>
            {l._id === currentPlaceId && (
              <Popup
                key={l._id}
                latitude={l.lat}
                longitude={l.long}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
                anchor="left"
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{l.title}</h4>
                  <label>Review</label>
                  <p className="desc">{l.description}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(l.rating).fill(<Star className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{l.username}</b>
                  </span>
                  <span className="date">{format(l.createdAt)}</span>
                </div>
              </Popup>
            )}
          </>
        ))}
        {newPlace && (
          <>
            <Marker
              latitude={newPlace.lat}
              longitude={newPlace.long}
              offsetLeft={-3.5 * viewport.zoom}
              offsetTop={-7 * viewport.zoom}
            >
              <Room
                style={{
                  fontSize: 7 * viewport.zoom,
                  color: "ivory",
                  cursor: "pointer",
                }}
              />
            </Marker>
            <Popup
              latitude={newPlace.lat}
              longitude={newPlace.long}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setNewPlace(null)}
              anchor="left"
            >
              <div>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input
                    placeholder="Enter a title"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label>Description</label>
                  <textarea
                    placeholder="Say us something about this place."
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <label>Rating</label>
                  <select onChange={(e) => 
                      {setStar(e.target.value);
                      console.log(e.target.value);
                  }}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button type="submit" className="submitButton">
                    Add Pin
                  </button>
                </form>
              </div>
            </Popup>
          </>
        )}
        {userName ? (
          <button className="button logout"
          onClick={handleLogout}
          >Log out</button>
        ) : (
          <div className="buttons">
            <button className="button login"
              onClick={() => setShowLogin(true)}
            >Login</button>
            <button className="button register"
              onClick={() => setShowRegister(true)}
            >Register</button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister}>

        </Register>}
        {showLogin && <Login
          setShowLogin={setShowLogin}
          setCurrentUsername={setCurrentUsername}
          myStorage={myStorage}
        >

        </Login>}

      </ReactMapGL>
    </div>
  );
}

export default App;
