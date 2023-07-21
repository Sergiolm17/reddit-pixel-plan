import { useEffect, useState } from "react";
import Draggable from 'react-draggable'; // The default
import { team, user } from "./interface";

export function Events({ team, scale, total, users }: { team: team, scale: number, total: number, users: user[] }) {
    //usa el local storage para guardar la posicion de los equipos y obtener
    const [, setState] = useState({
        activeDrags: 0,
        deltaPosition: JSON.parse(localStorage.getItem(team.name) || '{"x":90,"y":90}'),
    })
    const [score, setScore] = useState(0);

    useEffect(() => {
        //cuenta cuantos usuarios hay con el nombre del team
        const count = users.filter((user) => user.team === team.name).length;
        setScore(count)

    }, [users])


    const handleDrag = (e: any, ui: any) => {
        setState(prevState => ({
            ...prevState,
            deltaPosition: {
                x: ui.x,
                y: ui.y,
            }
        }));
        //save on local
        localStorage.setItem(team.name, JSON.stringify({
            x: ui.x,
            y: ui.y,
        }));
        return;
        console.log(e);
    };

    const dragHandlers = { onDrag: handleDrag };
    const totall = total === 0 ? 1 : total;
    const width = 100 + scale * 10 * score / totall;


    return (
        <Draggable bounds="body" defaultPosition={JSON.parse(localStorage.getItem(team.name) || '{"x":90,"y":90}')}
            {...dragHandlers}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: `${width}px`,
                height: `${width}px`,
                backgroundColor: "red",

            }}>
                <p>
                    {team.name}
                </p>
                <p>
                    {score}
                </p>
            </div>
        </Draggable>
    );
}