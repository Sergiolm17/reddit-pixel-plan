import { useEffect, useState } from "react";
import tmi from "tmi.js";
import { team } from "../components/interface";


//useTMI

export const useTmi = (user: string[]) => {
    const [users, setUsers] = useState<{
        name: string;
        team: string;
    }[]>([]);
    const [teams, setTeams] = useState<team[]>(JSON.parse(localStorage.getItem("teams") || "[]"));

    useEffect(() => {
        if (user.length === 0) return;
        const client = new tmi.Client({
            channels: user,
        });
        client.connect();
        client.on("connected", () => {
            client.on("message", async (channel: any, tags: any, msg: string) => {

                //solo  la primera palabra
                const message = msg.toLowerCase().split(" ")[0];


                const user = users.find((user) => user.name === tags["display-name"]);
                const teamIndex = teams.findIndex((team) => team.name === message);
                console.log(message, teamIndex);


                if (!user) {
                    if (teamIndex !== -1) {
                        console.log("teamIndex", teamIndex);

                        setUsers(users => [...users, {
                            name: tags["display-name"],
                            team: message,
                        }]);

                        setTeams(teams => {
                            const newTeams = [...teams];
                            newTeams[teamIndex].score++;
                            return newTeams;
                        });
                    }
                } else {

                    if (teamIndex !== -1) {
                        if (user.team !== message) {
                            const currentUserTeamIndex = teams.findIndex(
                                (team) => team.name === user.team
                            );
                            if (currentUserTeamIndex !== -1) {
                                //teams[currentUserTeamIndex].score--;
                                setTeams(teams => {
                                    const newTeams = [...teams];
                                    newTeams[currentUserTeamIndex].score--;
                                    return newTeams;
                                });
                            }

                            //teams[teamIndex].score++;
                            setTeams(teams => {
                                const newTeams = [...teams];
                                newTeams[teamIndex].score++;
                                return newTeams;
                            });
                            //actualiza el team del usuario
                            setUsers(users => {
                                const newUsers = [...users];
                                const currentUserIndex = newUsers.findIndex(
                                    (user) => user.name === tags["display-name"]
                                );
                                newUsers[currentUserIndex].team = message;
                                return newUsers;
                            });

                        }
                    } else {
                        console.log(channel);

                    }
                }

            });
        });
        return () => {
            client.disconnect();
        }
    }, []);
    const createTeam = (name: string) => {
        //verifica si el equipo existe
        const teamIndex = teams.findIndex((team) => team.name === name);
        //si ya existe no hace nada
        if (teamIndex !== -1)
            return;

        setTeams(teams => [...teams, {
            name,
            score: 0,
        }]);
        localStorage.setItem("teams", JSON.stringify(teams));
    }
    useEffect(() => {
        localStorage.setItem("teams", JSON.stringify(teams));
    }, [teams]);
    useEffect(() => {
        localStorage.setItem("users", JSON.stringify(users));
    }, [users]);


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

    return { teams, users, createTeam, deleteTeam };
}