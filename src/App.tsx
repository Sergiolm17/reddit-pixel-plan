import { useState } from 'react'
import './App.css'
import { Events } from './components/Events';
import { useTmi } from './hook/useTmi';


function App() {

  const { teams, createTeam, deleteTeam } = useTmi();

  const [file, setFile] = useState<any>(null)
  const [newName, setNewTeam] = useState("")
  const [deleteName, setDeleteTeam] = useState("")
  const [scale, setScale] = useState<number>(0)
  const total = teams.reduce((total, team) => total + team.score, 0);


  return (
    <div style={{
      height: "100vh",
      backgroundImage: `url(${file})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",

    }}>
      {teams.map((team, index) =>
        <Events key={index} team={team} scale={scale} total={total} />
      )}
      <div style={
        {
          position: "fixed",
          top: "7px",
        }
      }>
        <input type="file" id="file"
          multiple={false}
          onChange={(e) => {
            //el archivo seleccionado es una imagen que quiero usarlo para que sea el fondo
            if (e.target.files?.[0]) {
              const reader = new FileReader();
              reader.onload = (e) => {
                setFile(e.target?.result);
              }
              reader.readAsDataURL(e.target.files[0]);
            }

          }}
        />
        <div>
          <input type="text"
            value={newName}
            onChange={(e) => {
              setNewTeam(e.target.value)
            }
            }
          />
          <button onClick={() => {
            if (newName === "") return
            //mayuscula
            createTeam(newName.toLocaleLowerCase());
            setNewTeam("")
          }}>Create Team</button>
        </div>
        <div>
          <input type="text"
            value={deleteName}
            onChange={(e) => {
              setDeleteTeam(e.target.value);
            }
            }
          />
          <button onClick={() => {
            if (deleteName === "") return;
            deleteTeam(deleteName.toLocaleLowerCase());
            setDeleteTeam("");
          }}>Delete Team</button>
        </div>
        <div>
          Scale{" "}
          <input type="number"
            value={scale}
            min={0}
            max={100}
            onChange={(e) => {
              setScale(parseInt(e.target.value))
            }
            }
          />
        </div>              </div>
    </div>
  );


}



export default App
