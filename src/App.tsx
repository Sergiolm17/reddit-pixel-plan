import { useState } from 'react'
import './App.css'
import { Events } from './components/Events';
import { useTmi } from './hook/useTmi';
import { Field } from './components/Text';
import { ConnectionState } from './components/ConnectionState';
import Twitter from './components/Twitter';
import { Analytics } from '@vercel/analytics/react';

function App() {
  const [temp, setTemp] = useState(localStorage.getItem("user") || "");
  const [user, setUser] = useState(localStorage.getItem("user") || "");

  const { connected, users, teams, createTeam, deleteTeam } = useTmi(user);

  const [file, setFile] = useState<any>(null);
  const [newTeam, setNewTeam] = useState("")
  const [deleteName, setDeleteTeam] = useState("");
  const [scale, setScale] = useState<number>(0);

  const total = users.length


  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `url(${file})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Analytics />

      {teams.map((team, index) => (
        <Events
          key={index}
          team={team}
          scale={scale}
          total={total}
          users={users}
        />
      ))}
      <div
        style={{
          position: "fixed",
          top: "7px",
        }}
      >
        <input
          type="file"
          id="file"
          multiple={false}
          onChange={(e) => {
            //el archivo seleccionado es una imagen que quiero usarlo para que sea el fondo
            if (e.target.files?.[0]) {
              const reader = new FileReader();
              reader.onload = (e) => {
                setFile(e.target?.result);
              };
              reader.readAsDataURL(e.target.files[0]);
            }
          }}
        />
        <Field type={"text"} state={temp} setState={setTemp} callback={(data) => {
          setUser(data);
          localStorage.setItem("user", temp);
        }} text={"Set User"} />
        <ConnectionState isConnected={connected} />

        <Field type={"text"} state={newTeam} setState={setNewTeam} callback={createTeam} text={"Create Team"} />
        <Field type={"text"} state={deleteName} setState={setDeleteTeam} callback={deleteTeam} text={"Delete Team"} />


        <div>
          Scale{" "}
          <input
            type="number"
            value={scale}
            min={0}
            max={100}
            onChange={(e) => {
              setScale(parseInt(e.target.value));
            }}
          />
        </div>
      </div>
      <Twitter />
    </div>
  );


}



export default App
