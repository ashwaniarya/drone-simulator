import React, {
  ChangeEvent,
  FC,
  ReactElement,
  useEffect,
  useState,
} from "react";
import Debugger from "../../Debugger";
import { handleFileUpload } from "../../utils/index";
import { IDronLocation } from "../types";

interface DroneProps {
  image?: string;
  name: string;
  onChange?: (name: string, locations: IDronLocation[]) => any;
}

export default function Drone({
  image,
  name,
  onChange,
}: DroneProps): ReactElement {
  const [inputLongitude, setInputLongitude] = useState(0);
  const [inputLatitude, setInputLatitude] = useState(0);
  const [inputTimestamp, setInputTimestamp] = useState(0);
  const [modal, setModal] = useState(false);

  const [locations, setLocations] = useState<IDronLocation[]>([]);

  useEffect(() => {
    onChange && onChange(name, locations);
  }, [locations.length]);

  const clearInputState = () => {
    setInputLongitude(0);
    setInputLatitude(0);
    setInputTimestamp(0);
  };

  const handleOnChangeInputLongitude = (e: any) => {
    setInputLongitude(e.target.value);
  };

  const handleOnChangeInputLatitude = (e: any) => {
    setInputLatitude(e.target.value);
  };

  const handleOnChangeInputTimestamp = (e: any) => {
    setInputTimestamp(e.target.value);
  };

  const handleOnAddLocation = () => {
    setModal(false);
    const newLocation: IDronLocation = {
      longitude: parseInt(inputLongitude as any),
      latitude: parseInt(inputLatitude as any),
      timestamp: parseInt(inputTimestamp as any),
      droneName: name,
    };
    setLocations([...locations, newLocation]);
    clearInputState();
  };

  return (
    <div className="flex border border-gray-200 py-2 px-2 rounded-[8px]">
      {/* <Debugger values={locations}/> */}
      <div>
        <img src={image} style={{ width: "40px", height: "40px" }} />
      </div>
      <div className="flex-1 px-2 flex justify-between flex-col">
        <div className="text-xs text-gray-900 font-semibold">{name}</div>
        <div className="text-xs">
          <span className="text-gray-800">Paths</span> {locations.length}
        </div>
      </div>

      <div className="flex">
        <button
          data-modal-target="popup-modal"
          data-modal-toggle="popup-modal"
          className="bg-white hover:bg-blue-100 focus:ring-4 focus:outline-none border border-blue-300 focus:ring-blue-300 rounded-xl text-xs px-4 py-0 text-center text-gray-800 hover:text-gray-900"
          type="button"
          onClick={() => {
            setModal(!modal);
          }}
        >
          Add Path
        </button>
      </div>

      {modal && (
        <div
          className="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white text-gray-500">
                  <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Add Paths for {name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setModal(false);
                      }}
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      data-modal-hide="defaultModal"
                    >
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>
                  <div className="px-4 mt-4">
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                        Longitude
                      </span>
                      <input
                        value={inputLongitude}
                        onChange={handleOnChangeInputLongitude}
                        type="text"
                        id="website-admin"
                        className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 "
                        placeholder="eg -57"
                      />
                    </div>
                    <div className="flex mt-2">
                      <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                        Latitude
                      </span>
                      <input
                        value={inputLatitude}
                        onChange={handleOnChangeInputLatitude}
                        type="text"
                        id="website-admin"
                        className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 "
                        placeholder="eg -57"
                      />
                    </div>
                    <div className="flex mt-2">
                      <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                        Timestamp
                      </span>
                      <input
                        value={inputTimestamp}
                        onChange={handleOnChangeInputTimestamp}
                        type="text"
                        id="website-admin"
                        className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 "
                        placeholder="eg 1000"
                      />
                      
                    </div>
                    <div className="text-xs text-gray-600">Multiple of 1000 ms eg 2000, 4000, 6000</div>
                  </div>
                </div>
                <div className="px-4 mt-4">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 "
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          aria-hidden="true"
                          className="w-10 h-10 mb-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          ></path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          CSV (Max file size: 1MB)
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={(event) => {
                          async function loadFile() {
                            try {
                              const json = await handleFileUpload(event);
                              const newLocationsWithName = json.map(
                                (location: IDronLocation) => {
                                  return {
                                    longitude: parseFloat(location.longitude as any),
                                    latitude: parseFloat(location.latitude as any),
                                    timestamp: parseFloat(location.timestamp as any),
                                    droneName: name,
                                  };
                                }
                              );

                              setLocations((prevState) => [
                                ...prevState,
                                ...newLocationsWithName,
                              ]);
                              setModal(false);
                            } catch (e) {
                              alert("Error loading file");
                            }
                          }
                          loadFile();
                        }}
                      />
                    </label>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    onClick={handleOnAddLocation}
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 sm:ml-3 sm:w-auto"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setModal(false);
                    }}
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
