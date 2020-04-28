import React, {useState, useEffect} from 'react';
import {Grid} from "@material-ui/core";
import {FullGame, Game} from "../classes/Game";
import calculatePointsPerTeam from "../classes/GameUtils";
import {withRouter} from "react-router";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import ViewWrapper from "./ViewWrapper";
import Card from "@material-ui/core/Card";
import DashboardCard from "./DashboardCard";

function Dashboard(props: any) {

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();
    const [games, setGames] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        fetch('/v1/game', {
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
    }, [setIsLoading, setGames, setError]);

    const createGame = () => {
        props.history.push("/game/create");
    };

    const renderGames = () => {
        return games.map((game: FullGame) => {
            const results = calculatePointsPerTeam(game);
            return (
                <Grid item xs={12} md={6} lg={3} key={game.id}>
                    <Card onClick={() => {
                        props.history.push("/game/" + game.id);
                    }}>
                        <DashboardCard gameTitle={game.id}
                                   teamOne={results.team1.team.name}
                                   pointsTeamOne={results.team1.points}
                                   teamTwo={results.team2.team.name}
                                   pointsTeamTwo={results.team2.points}
                        />
                    </Card>
                </Grid>
            )
        });
    };


    return (
        <ViewWrapper>
            <h1>Dashboard</h1>
            <h2>Games</h2>
            {isLoading ?
                <CircularProgress/>
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
        </ViewWrapper>
    );
}

export default withRouter(Dashboard)
