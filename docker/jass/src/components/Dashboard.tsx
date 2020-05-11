import React, { useState, useEffect } from 'react';
import { FullGame } from '../classes/Game';
import calculatePointsPerTeam from '../classes/GameUtils';
import { withRouter } from 'react-router';
import {CircularProgress, CardContent, IconButton, Card , Button, CardHeader, Grid, Snackbar} from '@material-ui/core';
import ViewWrapper from './ViewWrapper';
import DashboardCard from './DashboardCard';
import { del, get } from '../classes/RestHelper';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { Alert, Color } from '@material-ui/lab';

interface SnackbarMessage extends Message {
    showSnackbar?: boolean;
    type?: Color;
}

function Dashboard(props: any) {
    const GAME_DELETE_FAILURE =
        'The game could not be deleted, please try again.';
    const GAME_DELETE_SUCCESS = 'The game was deleted.';
    const NO_GAMES = 'No Games recorded, please add one.';

    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState<SnackbarMessage>({
        show: false,
        message: '',
    });
    const [games, setGames] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        get(
            'game',
            (games: any) => {
                setGames(games);
                setIsLoading(false);
            },
            (error: any) => {
                setMessage({
                    show: true,
                    message: NO_GAMES,
                    error: error,
                    showSnackbar: false,
                });
                setIsLoading(false);
            }
        );
    }, []);

    const createGame = () => {
        props.history.push('/game/create');
    };

    const deleteGame = (id: number, index: number) => {
        del(
            'game/' + id,
            () => {
                const gamesCopy = [...games];
                gamesCopy.splice(index, 1);
                setGames(gamesCopy);
                setMessage({
                    show: true,
                    message: GAME_DELETE_SUCCESS,
                    showSnackbar: true,
                    type: 'success',
                });
            },
            (error: Error) => {
                setMessage({
                    show: true,
                    message: GAME_DELETE_FAILURE,
                    error: error,
                    showSnackbar: true,
                    type: 'error',
                });
            }
        );
    };

    const renderGames = () => {
        return games.map((game: FullGame, index: number) => {
            const results = calculatePointsPerTeam(game);
            return (
                <Grid item xs={12} md={6} lg={3} key={game.id}>
                    <Card>
                        <CardHeader
                            action={
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => deleteGame(game.id, index)}
                                >
                                    <DeleteOutlineIcon />
                                </IconButton>
                            }
                            title={game.id}
                        />
                        <CardContent
                            onClick={() => {
                                props.history.push('/game/' + game.id);
                            }}
                        >
                            <DashboardCard
                                teamOne={results.team1.team.name}
                                pointsTeamOne={results.team1.points}
                                teamTwo={results.team2.team.name}
                                pointsTeamTwo={results.team2.points}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            );
        });
    };

    return (
        <ViewWrapper>
            <h1>Dashboard</h1>
            <h2>Games</h2>
            {isLoading ? (
                <CircularProgress />
            ) : (
                <Grid container
                    direction="row"
                    justify="center"
                    align-items="center">
                    {message.show &&
                        <React.Fragment>
                            {message.showSnackbar ? (
                                <Snackbar
                                    open={message.showSnackbar}
                                    autoHideDuration={3000}
                                >
                                    <Alert severity={message.type}>
                                        {message.message}
                                    </Alert>
                                </Snackbar>
                            ) : (
                                <Grid
                                    item
                                    xs={12}
                                    md={12}
                                    lg={12}
                                >
                                    <Alert severity="info"> {message.message} </Alert>
                                </Grid>
                            )
                            }
                        </React.Fragment>
                    }
                    <Grid
                        container
                        spacing={10}
                        direction="row"
                        justify="center"
                        align-items="center"
                    >
                        {renderGames()}
                        <Grid item xs={12} md={4} lg={2}>
                            <Button onClick={createGame}>+ Game</Button>
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </ViewWrapper>
    );
}

export default withRouter(Dashboard);
