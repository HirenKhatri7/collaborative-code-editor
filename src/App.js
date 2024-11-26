import React, { useState } from 'react';
import RoomManager from './RoomManager';
import CodeEditor from './CodeEditor';

const App = () => {
  const [roomId, setRoomId] = useState(null);

  const handleRoomJoin = (id) => {
    setRoomId(id);
  };

  return (
    <div className="App">
      <h1>Collaborative Code Editor</h1>
      {roomId ? (
        <CodeEditor roomId={roomId} />
      ) : (
        <RoomManager onRoomJoin={handleRoomJoin} />
      )}
    </div>
  );
};

export default App;
