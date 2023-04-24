import React, { FC, ReactElement, useState } from "react";

interface DebuggerProps {
  values?: object
}

export default function Debugger( { values } : DebuggerProps ) : ReactElement {

  if(!window.DEBUG){
    return <></>;
  } 

  return (
    <div style={{ position: 'absolute', background: 'black'}}>
          {JSON.stringify(values)}
    </div>
  );
}