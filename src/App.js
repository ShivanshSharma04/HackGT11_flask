// src/App.js
import React from 'react';
import HelloWorld from './HelloWorld';  // Import the new component

function App() {
  return (
    <div className="App">
      <h1>Hello, World! Welcome to My React App</h1>
      <HelloWorld />  {/* Render the HelloWorld component */}
    </div>
  );
}

export default App;
