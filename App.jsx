import React from 'react';
import LeftSidebar from './components/LeftSidebar';
import EditorComponent from './components/EditorComponent';
import './styles/Sidebar.css';
import './styles/Editor.css';

const App = () => {
  return (
    <div className="app-container">
      <LeftSidebar />
      <EditorComponent />
    </div>
  );
};

export default App;
