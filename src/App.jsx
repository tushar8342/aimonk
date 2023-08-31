import React from 'react';
import './App.css';
import TagView from './components/TagView';

const treeData = {
  name: 'root',
  children: [
    {
      name: 'child1',
      children: [
        { name: 'child1-child1', data: 'c1-c1 Hello' },
        { name: 'child1-child2', data: 'c1-c2 JS' },
      ],
    },
    { name: 'child2', data: 'c2 World' },
  ],
};

function App() {
  return (
    <div className="App">
      <h1>Nested Tags Tree</h1>
      <TagView tagData={treeData} />
    </div>
  );
}

export default App;