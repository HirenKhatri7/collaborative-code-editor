
// import React, { useEffect, useRef, useState } from 'react';
// import * as monaco from 'monaco-editor';
// import { initializeApp } from 'firebase/app';
// import { getDatabase, ref, onValue, set } from 'firebase/database';
// import axios from 'axios';

// // Your web app's Firebase configuration

//   const firebaseConfig = {
//     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//     databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
//     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.REACT_APP_FIREBASE_APP_ID,
//     measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
//   };
  

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);
// const codeRef = ref(database, 'codeContent');

// // Language settings
// const languageSettings = {
//   python: { fileName: 'main.py', version: '3.10.0' },
//   java: { fileName: 'Main.java', version: '15.0.2' },
//   csharp: { fileName: 'Program.cs', version: '9.0' },
//   cpp: { fileName: 'main.cpp', version: '10.2.0' },
//   c: { fileName: 'main.c', version: '10.2.0' }
// };

// const CodeEditor = () => {
//   const editorRef = useRef(null);
//   const [language, setLanguage] = useState('python');
//   const [output, setOutput] = useState('');
//   const monacoEditorRef = useRef(null);

//   useEffect(() => {
//     monacoEditorRef.current = monaco.editor.create(editorRef.current, {
//       value: 'print("Hello, world!")',
//       language: language,
//       theme: 'vs-dark',
//     });

//     // Listen for changes in the database
//     onValue(codeRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data && monacoEditorRef.current.getValue() !== data) {
//         monacoEditorRef.current.setValue(data);
//       }
//     });

//     // Update the database on user input
//     monacoEditorRef.current.onDidChangeModelContent(() => {
//       set(codeRef, monacoEditorRef.current.getValue());
//     });

//     return () => {
//       monacoEditorRef.current.dispose();
//     };
//   }, [language]);

//   const handleLanguageChange = (event) => {
//     setLanguage(event.target.value);
//   };

//   const executeCode = async () => {
//     const code = monacoEditorRef.current.getValue();
//     const { fileName, version } = languageSettings[language];
//     const program = {
//       language: language,
//       version: version,
//       files: [
//         {
//           name: fileName,
//           content: code
//         }
//       ]
//     };

//     try {
//       const response = await axios.post('https://emkc.org/api/v2/piston/execute', program, {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
//       setOutput(response.data.run.output);
//     } catch (error) {
//       console.error('Error executing code:', error);
//       setOutput('Error executing code');
//     }
//   };

//   return (
//     <div>
//       <select onChange={handleLanguageChange} value={language}>
//         <option value="python">Python</option>
//         <option value="java">Java</option>
//         <option value="csharp">C#</option>
//         <option value="cpp">C++</option>
//         <option value="c">C++</option>
//       </select>
//       <button onClick={executeCode}>Execute</button>
//       <div ref={editorRef} style={{ height: '60vh', border: '1px solid #ccc' }} />
//       <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', backgroundColor: '#f5f5f5' }}>
//         <h3>Output:</h3>
//         <pre>{output}</pre>
//       </div>
//     </div>
//   );
// };

// export default CodeEditor;


import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import axios from 'axios';

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

// Language settings
const languageSettings = {
  python: { fileName: 'main.py', version: '3.10.0' },
  nodejs: { fileName: 'main.js', version: '14.17.0' },
  java: { fileName: 'Main.java', version: '15.0.2' },
  csharp: { fileName: 'Program.cs', version: '9.0' },
  cpp: { fileName: 'main.cpp', version: '10.2.0' },
  c: { fileName: 'main.c', version: '10.2.0' }
};

const CodeEditor = ({ roomId }) => {
  const editorRef = useRef(null);
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const monacoEditorRef = useRef(null);

  useEffect(() => {
    monacoEditorRef.current = monaco.editor.create(editorRef.current, {
      value: 'print("Hello, world!")',
      language: language,
      theme: 'vs-dark',
    });

    const dbRef = ref(database, `rooms/${roomId}/content`);
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data && monacoEditorRef.current.getValue() !== data) {
        monacoEditorRef.current.setValue(data);
      }
    });

    monacoEditorRef.current.onDidChangeModelContent(() => {
      set(dbRef, monacoEditorRef.current.getValue());
    });

    return () => {
      monacoEditorRef.current.dispose();
    };
  }, [language, roomId]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const executeCode = async () => {
    const code = monacoEditorRef.current.getValue();
    const { fileName, version } = languageSettings[language];
    const program = {
      language: language,
      version: version,
      files: [
        {
          name: fileName,
          content: code
        }
      ]
    };

    try {
      const response = await axios.post('https://emkc.org/api/v2/piston/execute', program, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setOutput(response.data.run.output);
    } catch (error) {
      console.error('Error executing code:', error);
      setOutput('Error executing code');
    }
  };

  return (
    <div>
      <select onChange={handleLanguageChange} value={language}>
        <option value="python">Python</option>
        <option value="nodejs">Node.js</option>
        <option value="java">Java</option>
        <option value="csharp">C#</option>
        <option value="cpp">C++</option>
        <option value="c">C</option>
      </select>
      <button onClick={executeCode}>Execute</button>
      <div ref={editorRef} style={{ height: '60vh', border: '1px solid #ccc' }} />
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', backgroundColor: '#f5f5f5' }}>
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
