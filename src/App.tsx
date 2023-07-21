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
        opacity: 0.8,
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
          left: "7px",
          backgroundColor: "white",
          color: "black",
          padding: "7px",
        }}
      >

        <Field type={"text"} state={temp} setState={setTemp} callback={(data) => {
          setUser(data);
          localStorage.setItem("user", temp);
        }} text={"Set User"} />
        <ConnectionState isConnected={connected} />

        <Field type={"text"} state={newTeam} setState={setNewTeam} callback={createTeam} text={"Create Team"} />
        <Field type={"text"} state={deleteName} setState={setDeleteTeam} callback={deleteTeam} text={"Delete Team"} />



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
      <div
        style={{
          position: "fixed",
          bottom: "7px",
          left: "7px",
          backgroundColor: "white",
          color: "black",
          padding: "7px",
          borderRadius: "7px",
          width: "300px",
          opacity: 0.5,
        }}
      >
        <h3>Guía Stream:</h3>
        <ol>
          <li>1. Coloca tu nick de twitch, se conectará a tu chat</li>
          <li>2. Crear los equipos</li>
          <li>3. Carga tu imagen</li>
          <li>4. Organiza los equipos</li>
        </ol>

        <h3>Guía Chat:</h3>
        <ol>
          <li>1. Para que se puedan unir tienen que escribir el nombre del equipo</li>
          <li>2. Coloca tu pixel en tu equipo</li>
        </ol>

      </div>
    </div>
  );


}



export default App
