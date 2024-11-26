import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, child } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const RoomManager = ({ onRoomJoin }) => {
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');
  const [newRoomId, setNewRoomId] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleJoinRoom = async () => {
    const dbRef = ref(database);
    const roomSnapshot = await get(child(dbRef, `rooms/${roomId}`));
    if (roomSnapshot.exists() && roomSnapshot.val().password === password) {
      onRoomJoin(roomId);
    } else {
      alert('Invalid room ID or password');
    }
  };

  const handleCreateRoom = async () => {
    await set(ref(database, `rooms/${newRoomId}`), {
      password: newPassword,
      content: ''
    });
    onRoomJoin(newRoomId);
  };

  return (
    <div>
      <h2>Join Room</h2>
      <input
        type="text"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleJoinRoom}>Join Room</button>

      <h2>Create Room</h2>
      <input
        type="text"
        placeholder="New Room ID"
        value={newRoomId}
        onChange={(e) => setNewRoomId(e.target.value)}
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleCreateRoom}>Create Room</button>
    </div>
  );
};

export default RoomManager;
