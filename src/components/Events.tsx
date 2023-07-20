import { useState } from "react";
import Draggable from 'react-draggable'; // The default
import { team } from "./interface";

export function Events({ team, scale, total }: { team: team, scale: number, total: number }) {
    //usa el local storage para guardar la posicion de los equipos y obtener
    const [, setState] = useState({
        activeDrags: 0,
        deltaPosition: JSON.parse(localStorage.getItem(team.name) || '{"x":90,"y":90}'),
    })

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
    const width = 100 + scale * 10 * team.score / totall;

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
                    {team.score}
                </p>
            </div>
        </Draggable>
    );
}