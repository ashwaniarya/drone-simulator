

// export const DRON_LOCATIONS: IDronLocation[] = [
//   {
//     longitude: -77.03238901390978 ,
//     latitude: 38.913188059745586,
//     locationName: '1',
//     timestamp: 
//   },
//   {
//     longitude: -122.414 ,
//     latitude: 37.776,
//     locationName: '1'
//   },
//   {
//     longitude: -100.414,
//     latitude: 45.776,
//     locationName: '1'
//   },

import { IDronLocation } from "./types";

  
// ]



const initialLongitude = -77.03238901390978;
const initialLatitude = 38.913188059745586;
const a = 50; // Adjust this value to control the size of the infinity shape
const numLocations = 100;
const timeIncrement = (2 * Math.PI) / numLocations;

export const DRONE_LOCATIONS: IDronLocation[] = Array.from({ length: numLocations }, (_, i) => {
  const t = i * timeIncrement;
  const x = (a * Math.cos(t)) / (1 + Math.sin(t) ** 2);
  const y = (a * Math.cos(t) * Math.sin(t)) / (1 + Math.sin(t) ** 2);

  return {
    longitude: initialLongitude + x,
    latitude: initialLatitude + y,
    locationName: (i + 1).toString(),
    timestamp: 2342423 + i * 1000,
  };
});

console.log(DRONE_LOCATIONS)