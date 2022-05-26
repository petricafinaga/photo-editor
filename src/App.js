import './App.css';

import { useState } from 'react';

import { Actions } from './settings/Constants.settings';

import { Toolbar } from './components/Toolbar/Toolbar';
import { Playground } from './components/Playground/Playground';

function App() {
  const [action, setAction] = useState(Actions.None);

  const setActionState = (action) => {
    setAction(action);
  }

  return (
    <div className="app">
      <Playground action={action} />
      <Toolbar setAction={setActionState} />
    </div>
  );
}

export default App;
