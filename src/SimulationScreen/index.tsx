import { SyntheticEvent, useCallback, useEffect, useRef, useState } from "react";
import { IDronLocation } from "./types";
import Drone from "./components/Drone";
import AddDrone from "./components/AddDrone";
import { getRandomColor } from "../utils";
import DroneImg from './../assets/drone.png';
interface IDrones {
  [key: string]: IDronLocation[];
}

interface ILocations {
  [key: string]: IDronLocation[];
}

function App() {
  const [currentFrame, setCurrentFrame] = useState("0");
  const [drones, setDrones] = useState<IDrones>({});
  const [dronesValuesChanged, setDronesValuesChanged] = useState(false);
  const [droneLocationTimestampMap, setDroneLocationTimestampMap] =
    useState<ILocations>({});
  const [isSimultionRunning, setIsSimulationRunning] = useState(false);
  const currentFrameRef = useRef(currentFrame);
  currentFrameRef.current = currentFrame;
  const timeIntervalRef = useRef<number>();
  const lineFeatures = useRef<any>({});
  const features = useRef<any>([]);
  const mapRef = useRef<any>();

  const droneCount = Object.keys(drones).length;
  const droneLocationTimestampMapCount = Object.keys(
    droneLocationTimestampMap
  ).length;

  const handleOnChangeDroneLocations = useCallback(
    (name: string, locations: IDronLocation[]) => {
      setDrones((prevDrones) => ({
        ...prevDrones,
        [name]: locations,
      }));
      setDronesValuesChanged((prevState) => {
        return !prevState;
      });
    },
    []
  );

  useEffect(() => {
    updateLocationTimestamp();
  }, [dronesValuesChanged]);

  useEffect(() => {
    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, []);

  const updateLocationTimestamp = () => {
    const loc = getReducedDroneLocations(drones);
    setDroneLocationTimestampMap(loc);
  };
  const getReducedDroneLocations = (drones: IDrones) => {
    const locations: ILocations = {};
    Object.keys(drones).forEach((droneName) => {
      const droneLocations = drones[droneName];
      droneLocations.forEach((location, index) => {
        if (!locations[location.timestamp]) {
          locations[location.timestamp] = [location];
        } else {
          locations[location.timestamp].push(location);
        }
      });
    });

    return locations;
  };

  const getLocationsByTimestamp = (timestamp: number) => {
    return droneLocationTimestampMap[timestamp.toString()];
  };

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYXNod2FuaWFyeWEiLCJhIjoiY2xnc3dkcmc2MWVmODNobXJvaHduejdmdCJ9.Msi4SnSVPR4OUNMObxkVrQ";
    const map = new mapboxgl.Map({
      container: "map", // container ID
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: "mapbox://styles/mapbox/streets-v12", // style URL
      center: [73.851393,18.518177], // starting position
      zoom: 13, // starting zoom
    });
    mapRef.current = map;
    map.on("load", () => {
      // Add an image to use as a custom marker
      map.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        (error:any, image:any) => {
          if (error) throw error;
          map.addImage("custom-marker", image);
          // Add a GeoJSON source with 2 points
          map.addSource("points", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [],
            },
          });

          map.addSource("drons", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [],
            },
          });

          map.addLayer({
            id: "abcdd",
            type: "circle",
            source: "points",
            paint: {
              "circle-radius": 5,
              "circle-color": "#007cbf",
            }
          });


          // Add a symbol layer
          // map.addLayer({
          //   id: "abcdd",
          //   type: "symbol",
          //   source: "points",
          //   layout: {
          //     "icon-image": "custom-marker",
          //     // get the title name from the source's "title" property
          //     "text-field": ["get", "title"],
          //     "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          //     "text-offset": [0, 1.25],
          //     "text-anchor": "top",
          //   },
          // });

          // map.addLayer({
          //   id: "abcd",
          //   type: "line",
          //   source: "points",
          //   layout: {
          //     "line-join": "round",
          //     "line-cap": "round",
          //   },
          //   paint: {
          //     "line-color": "#888",
          //     "line-width": 8,
          //   },
          // });
        }
      );
    });
  }, []);

  const resetConnectorForDrone = (name: string) => {
    lineFeatures.current[name].geometry.coordinates = [];
  };
  const resetAllConnectorForDrone = () => {
    Object.keys(lineFeatures.current).forEach((name) => {
      resetConnectorForDrone(name);
    });
  };
  const getDroneValues = () => {
    return Object.values(lineFeatures.current);
  };

  const resetFeature = () => {
    features.current = [];
  };
  const addConnectorForDrone = (
    name: string,
    longitude: number,
    latitude: number
  ) => {
    lineFeatures.current[name].geometry.coordinates.push([longitude, latitude]);
    return Object.keys(lineFeatures.current).indexOf(name);
  };

  const addLocationOnMap = (location: IDronLocation, withDrone: boolean) => {
    const longitude = location.longitude;
    const latitude = location.latitude;
    const name = location?.droneName || '';

    const title = `[${longitude}, ${latitude}]`;
    features.current.push({
      // feature for Mapbox DC
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      properties: {
        title: title,
      },
    });
    const lineFeatureToChange = addConnectorForDrone(name as string, longitude, latitude);
    features.current[lineFeatureToChange] = lineFeatures.current[name];

    mapRef.current &&
      mapRef.current.getSource("points").setData({
        type: "FeatureCollection",
        features: features.current,
      });

    if(withDrone) {
      const droneFeature = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        properties: {
          title: name,
        },
      }
      mapRef.current &&
      mapRef.current.getSource("drons").setData({
        type: "FeatureCollection",
        features: [droneFeature],
      });
    }
  };

  const changeMapDroneStateByFrame = (frame: number) => {
    if (frame !== undefined) {
      resetAllConnectorForDrone();
      resetFeature();
      features.current = [...getDroneValues()];
      if (frame === 0) {
        mapRef.current.getSource("points").setData({
          type: "FeatureCollection",
          features: features.current,
        });
      }
      for (let i = 1; i <= frame; i++) {
        const timestamp = i * 1000;
        const locationsOnTimestamp = getLocationsByTimestamp(timestamp);
        locationsOnTimestamp.forEach((location) => {
          if(i === frame){
            addLocationOnMap(location, true);
          }
          else {
            addLocationOnMap(location, false);
          }
        });
      }
    }
  };

  const handleOnAddDrone = (name: string) => {
    lineFeatures.current[name] = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [],
      },
    };
    mapRef.current.addLayer({
      id: name,
      type: "line",
      source: "points",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": 'blue',
        "line-width": 6,
      },
    });

    mapRef.current.loadImage('/src/assets/drone_35.png', (error:any, image:any) => {
      
      if(error) throw error;

      mapRef.current.addImage("image-"+name, image);
      mapRef.current.addLayer({
        id: name+"-image",
        type: "symbol",
        source: "drons",
        layout: {
          "icon-image": "image-"+name,
          // get the title name from the source's "title" property
          "icon-size": 1,
          "text-field": ["get", "title"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-offset": [0, 1.25],
          "text-anchor": "top",
        },
      });

    });




    setDrones((prevDrones) => ({
      ...prevDrones,
      [name]: [],
    }));
  };

  return (
    <>
      <div
        id="map"
        style={{ width: "100vw", height: "calc(100vh - 80px)" }}
      ></div>

      <div className="absolute bottom-2 flex w-screen justify-center">
        <div className="border border-gray-300 px-4 py-2 rounded-xl  bg-white flex w-2/3 shadow-xl">
          <div className="w-32">
            {!isSimultionRunning && 
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={() => {
                setIsSimulationRunning(true);
                timeIntervalRef.current = setInterval(() => {
                  const currentFameInINT = parseInt(currentFrameRef.current);
                  if (currentFameInINT < droneLocationTimestampMapCount) {
                    const newFrame = currentFameInINT + 1;
                    setCurrentFrame(newFrame.toString());
                    changeMapDroneStateByFrame(newFrame);
                  } else {
                    clearInterval(timeIntervalRef.current);
                  }
                }, 1000);
              }}
            >
              Simulate
            </button>}
            { isSimultionRunning && 
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={() => {
                setIsSimulationRunning(false);
                timeIntervalRef.current && clearInterval(timeIntervalRef.current);
              }}
            >
              Stop
            </button>}
          </div>
          <div className="flex-1 ml-4 flex items-center">
            <input
              type="range"
              min="0"
              max={droneLocationTimestampMapCount}
              value={currentFrame}
              id="myRange"
              step="1"
              className="w-full"
              onInput={(e:SyntheticEvent) => {
                const newFrame = e.target.value;
                if (currentFrame !== newFrame) {
                  const intNewFrame = parseInt(newFrame);
                  setCurrentFrame(newFrame);
                  changeMapDroneStateByFrame(intNewFrame);
                }
                //
              }}
            />
          </div>
        </div>
      </div>
      <div className="border border-gray-300 px-2 py-2 rounded-xl absolute right-2 top-2 bg-white">
        <AddDrone
          onAdd={(name) => {
            handleOnAddDrone(name);
          }}
        />
        <div className="mt-2">
          {Object.keys(drones).map((droneName, index) => {
            return (
              <div className={index === 0 ? "mt-0" : "mb-2"}>
                <Drone
                  name={droneName}
                  onChange={handleOnChangeDroneLocations}
                  key={index}
                />
              </div>
            );
          })}
        </div>

        {/* <button onClick={()=>{
          const loc = getReducedDroneLocations(drones);
          setDroneLocationTimestampMap(loc);
        }}>Get</button> */}
      </div>
    </>
  );
}

export default App;

// {
//   // feature for Mapbox DC
//   type: "Feature",
//   geometry: {
//     type: "Point",
//     coordinates: [-77.03238901390978, 38.913188059745586],
//   },
//   properties: {
//     title: "Mapbox DC",
//   },
// },
// {
//   // feature for Mapbox SF
//   type: "Feature",
//   geometry: {
//     type: "Point",
//     coordinates: [-122.414, 37.776],
//   },
//   properties: {
//     title: "Mapbox SF",
//   },
// },
// {
//   type: "Feature",
//   geometry: {
//     type: "LineString",
//     coordinates: [
//       [-77.03238901390978, 38.913188059745586],
//       [-122.414, 37.776],
//     ],
//   },
// },
