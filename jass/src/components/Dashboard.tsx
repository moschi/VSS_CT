import React, { useState, useEffect } from 'react';
import {Grid} from "@material-ui/core";
import {Game} from "../classes/Game";
import calculatePointsPerTeam from "../classes/GameUtils";
import {withRouter} from "react-router";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

function Dashboard(props: any) {

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();
    const [games, setGames] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        fetch('api/v1/game', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (response.ok) {
                    response.json().then((data) => {
                        setGames(data);
                        setIsLoading(false);
                    });
                } else {
                    throw new Error("Error during game loading, please try again!");
                }
            })
            .catch((error) => {
                setError({message: error.message, error: error});
                setIsLoading(false);
            });
    },[setIsLoading, setGames, setError]);

    const createGame = () => {
        const route = "/game/create";
        props.history.push(route);
    };

    const renderGames = () => {
        return games.map((game: Game) => {
            const results = calculatePointsPerTeam(game);
            return (
                <Grid item xs={12} md={4} lg={2} key={game.id}>
                    <div className="gameWrapper" onClick={() => {
                        const route = "/game/" + game.id;
                        props.history.push(route);
                    }}>
                        <table>
                            <thead>
                            </thead>
                            <tbody>
                            <tr>
                                <th>Game</th>
                                <th>{game.id}</th>
                            </tr>
                            <tr>
                                <td>{results.team1.team.name}</td>
                                <td>{results.team1.points}</td>
                            </tr>
                            <tr>
                                <td>{results.team2.team.name}</td>
                                <td>{results.team2.points}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </Grid>
            )
        });
    };


    return (
        <div>
            <h1>Dashboard</h1>
            <h2>Games</h2>
            {isLoading ?
                <CircularProgress />
                :
                error ?
                    <p>error: {error.message}</p>
                    :
                    <Grid container
                          spacing={10}
                          direction="row"
                          justify="center"
                          align-items="center">
                        {renderGames()}
                        <Grid item xs={12} md={4} lg={2}>
                            <Button onClick={createGame}>+ Game</Button>
                        </Grid>
                    </Grid>
            }
        </div>
    );
}

export default withRouter(Dashboard)
