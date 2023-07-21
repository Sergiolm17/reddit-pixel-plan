import { useEffect, useState } from "react";
import tmi from "tmi.js";
import { team, user } from "../components/interface";


//useTMI

export const useTmi = (channel: string) => {

    const [teams, setTeams] = useState<team[]>(JSON.parse(localStorage.getItem("teams") || "[]"));
    const [users, setUsers] = useState<user[]>(JSON.parse(localStorage.getItem("users") || "[]"));

    const onMessageHandler = (channel: any, tags: any, message: string) => {

        // const user = users.findIndex((user) => user.name === tags["display-name"]);
        const teamIndex = teams.findIndex((team) => team.name === message);


        //si hay el team
        if (teamIndex !== -1) {
            console.log("teamIndex", teamIndex, "message", message, teams);

            //busca si el usuario esta en el team
            // const userIndex = users.findIndex((user) => user.name === tags["display-name"]);

            setUsers((users) => {
                const userIndex = users.findIndex((user) => user.name === tags["display-name"]);
                if (userIndex === -1)
                    return [...users, { name: tags["display-name"], team: message }];
                else
                    return users.map((user, index) => {
                        if (index === userIndex)
                            user.team = message;
                        return user;
                    });
            });
        }


    }
    useEffect(() => {
        localStorage.setItem("users", JSON.stringify(users));


    }, [users])


    useEffect(() => {

        if (channel === "") return;

        const client = new tmi.Client({
            channels: channel.split(","),
            logger: {
                info: (msg: string) => { return },
                warn: (msg: string) => console.warn(msg),
                error: (msg: string) => console.error(msg),
            }
        });
        client.connect();
        client.on("connected", () => {
            console.log("connected");
            client.on("message", onMessageHandler);
        });
        return () => {
            client.disconnect().then(() => console.log("disconnected"));
        }
    }, [teams, channel]);


    const createTeam = (name: string) => {
        const teamIndex = teams.findIndex((team) => team.name === name);
        if (teamIndex !== -1)
            return;
        setTeams(teams => [...teams, { name, score: 0 }]);
        localStorage.setItem("teams", JSON.stringify(teams));
    }
    useEffect(() => {
        localStorage.setItem("teams", JSON.stringify(teams));
    }, [teams]);



    const deleteTeam = (name: string) => {
        if (!window.confirm("¿Estas seguro de eliminar el equipo?"))
            return;
        //verifica si el equipo existe
        const teamIndex = teams.findIndex((team) => team.name === name);
        if (teamIndex === -1)
            return;
        //elimina el equipo
        setTeams(teams => teams.filter(team => team.name !== name));

    }

    return { users, teams, createTeam, deleteTeam };
}