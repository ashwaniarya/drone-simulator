import React, { FC, ReactElement, useEffect, useState } from "react";
import Debugger from "../../Debugger";
import { IDronLocation } from "../types";

interface AddDroneProps {
  onAdd?: (name: string) => any;
}


export default function AddDrone( { onAdd } : AddDroneProps ) : ReactElement {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const [locations, setLocations] = useState<IDronLocation[]>([]);

  const clearInputState = () => {
    setName('');
  }

  const handleOnChangeName = (e: any) => {
    setError('');
    setName(e.target.value);
  }

  const handleAddLocation = (e: any) => {
    if(name.length < 1){
      setError('Name is required');
      return;
    }

    const formattedName = name.trim().toLowerCase().split(' ').join('-');
    onAdd && onAdd(formattedName);
    clearInputState();
  }

  return (
    <div>
      <div className="flex">
        <div>
            <input onChange={handleOnChangeName} type="text" id="drone_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="eg food-drone ( unique )" required />
            {!!error && <div className="text-xs text-red-600 mt-0.5">
           {error}
          </div>}
        </div>
        <div className="ml-2 flex">
          <div>
            <button onClick={handleAddLocation} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Add Drone</button>
          </div>
          
        </div>
        
      </div>
    </div>
  );
}