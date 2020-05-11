import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import DrawGameBoard from '../classes/DrawGameBoard';
import { PointsPerTeamPerRound, Round, Trumpf } from '../classes/Game';
import jasstafel from '../images/jasstafel.jpg';
import ViewWrapper from './ViewWrapper';
import { del, get, post } from '../classes/RestHelper';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import GameMocks from '../classes/GameMocks';
import {FormControl, TableBody, TableCell} from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import IconButton from '@material-ui/core/IconButton';

const trump: Trumpf[] = [
    { id: 1, name: 'Eichel', multiplier: 1 },
    { id: 2, name: 'Rose', multiplier: 1 },
    { id: 3, name: 'Schellen', multiplier: 2 },
    { id: 4, name: 'Schilten', multiplier: 2 },
    { id: 5, name: 'ObenAben', multiplier: 3 },
    { id: 6, name: 'UntenUfen', multiplier: 3 },
];

interface HistoryWrapperProps {
    teamNameOne: string;
    teamNameTwo: string;
    children: React.ReactChildren;
    round: number;
    addRound: Function;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            width: '25ch',
        },
        container: {
            height: 300,
        },
    })
);

const HistoryWrapper = (props: HistoryWrapperProps) => {
    const [team, setTeam] = useState(props.teamNameOne);
    const [points, setPoints] = useState(0);
    const [trumpf, setTrumpf] = useState(trump[0].name);
    const [wiisPoints1, setWiisPoints1] = useState(0);
    const [wiisPoints2, setWiisPoints2] = useState(0);

    const classes = useStyles();

    return (
        <React.Fragment>
            <div>
                <Paper>
                    <TableContainer className={classes.container}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell key="Runde">
                                        Runde
                                    </TableCell>
                                    <TableCell key={props.teamNameOne}>
                                        {props.teamNameOne}
                                    </TableCell>
                                    <TableCell key={props.teamNameTwo}>
                                        {props.teamNameTwo}
                                    </TableCell>
                                    <TableCell key="Trumpf">
                                        Trumpf
                                    </TableCell>
                                    <TableCell key="Actions">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.children}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </div>
            <br/>
            <form>
                <FormControl className={classes.formControl}>
                    <FormControl>
                        <InputLabel htmlFor="team-select" id="team-select-label">Team</InputLabel>
                        <Select
                            labelId="team-select-label"
                            id="team-select"
                            value={team}
                            onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                                const value: string = e.target.value as string;
                                setTeam(value);
                            }}
                        >
                            <MenuItem value={props.teamNameOne}>{props.teamNameOne}</MenuItem>
                            <MenuItem value={props.teamNameTwo}>{props.teamNameTwo}</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        id="points"
                        label="Points"
                        placeholder="0"
                        value={points}
                        type={'number'}
                        onChange={(e) =>
                            setPoints(Number(e.currentTarget.value))
                        }
                    />
                    <TextField
                        id="points"
                        label={"Wiis Points "+props.teamNameOne}
                        placeholder="0"
                        value={wiisPoints1}
                        type={'number'}
                        onChange={(e) =>
                            setWiisPoints1(Number(e.currentTarget.value))
                        }
                    />
                    <TextField
                        id="points"
                        label={"Wiis Points "+props.teamNameTwo}
                        placeholder="0"
                        value={wiisPoints2}
                        type={'number'}
                        onChange={(e) =>
                            setWiisPoints2(Number(e.currentTarget.value))
                        }
                    />
                    <FormControl>
                        <InputLabel team-select="trumpf-select" id="trumpf-select-label">Trumpf</InputLabel>
                        <Select
                            labelId="trumpf-select-label"
                            id="trumpf-select"
                            defaultValue={trumpf}
                            onChange={(e) => setTrumpf(e.currentTarget.value as string)}
                        >
                            {trump.map((trumpf: Trumpf) => {
                                return <MenuItem value={trumpf.name}>{trumpf.name}</MenuItem>;
                            })}
                        </Select>
                    </FormControl>
                    <Button onClick={() => {
                        {
                            trump.forEach((trump) => {
                                if (trump.name === trumpf) {
                                    props.addRound(
                                        trump.id,
                                        points,
                                        team,
                                        wiisPoints1,
                                        wiisPoints2
                                    );
                                }
                            });
                        }
                    }}>
                        Add Round
                    </Button>
                </FormControl>
            </form>
        </React.Fragment>
    );
};

const HistoryTableRow = (props: any) => {
    return (
        <TableRow>
            <TableCell>
                <p>{props.runde}</p>
            </TableCell>
            <TableCell>
                <p>{props.teamOnePoints}</p>
            </TableCell>
            <TableCell>
                <p>{props.teamTwoPoints}</p>
            </TableCell>
            <TableCell>
                <p>{props.trump}</p>
            </TableCell>
            <TableCell>
                <IconButton
                    aria-label="delete"
                    onClick={() => props.removeRound(props.roundId)}
                >
                    <DeleteOutlineIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    );
};

function GameBoard(props: any) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState(GameMocks[0]);
    const [rerender, setRerender] = useState(false);
    const [rererenderer, setRerererenderer] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        setIsLoading(true);
        get(
            'game/' + props.match.params.id,
            (game: any) => {
                setGame(game);
                const boardRenderer = new DrawGameBoard(
                    canvasRef,
                    game,
                    jasstafel
                );
                boardRenderer.render();
                setIsLoading(false);
            },
            (error: any) => {
                setError({ message: error.message, error: error });
                setIsLoading(false);
            }
        );
    }, [rererenderer, props.match.params.id]);

    useEffect(() => {
        console.log('should rerender');
        const boardRenderer = new DrawGameBoard(canvasRef, game, jasstafel);
        boardRenderer.render();
    }, [rerender]);

    const getNextRoundId = (rounds: Round[]) => {
        return rounds.length + 1;
    };

    const addRound = (
        trumpfId: number,
        points: number,
        teamName: string,
        wiisPoints1: number,
        wiisPoints2: number
    ) => {
        let teamId =
            game.teams[0].name === teamName
                ? game.teams[0].id
                : game.teams[1].id;
        const getTeamIdOtherTeam = () => {
            return game.teams[0].id === teamId
                ? game.teams[1].id
                : game.teams[0].id;
        };

        let pointsOtherTeam = 0;
        if (points === 157) {
            points = 257;
        } else if (points === 0) {
            pointsOtherTeam = 257;
        } else if (points === 257) {
            pointsOtherTeam = 0;
        } else {
            pointsOtherTeam = 157 - points;
        }
        const pointsPerTeamPerRound: PointsPerTeamPerRound[] = [
            { points: points, wiisPoints: wiisPoints1, teamId: teamId },
            {
                points: pointsOtherTeam,
                wiisPoints: wiisPoints2,
                teamId: getTeamIdOtherTeam(),
            },
        ];

        const postRound: Round = {
            id: 0,
            trumpfId: trumpfId,
            pointsPerTeamPerRound: pointsPerTeamPerRound,
        };

        post(
            'game/' + game.id + '/round',
            (resp: any) => {
                const round: Round = postRound;
                round.id = resp.id;
                game.rounds.push(round);
                setGame(game);
                setRerender(!rerender);
            },
            () => {
                console.log('fuck');
            },
            postRound
        );
    };

    const removeRound = (roundId: number) => {
        del(
            'game/' + game.id + '/' + roundId,
            () => {
                setRerererenderer(!rererenderer);
                console.log('blah');
            },
            () => {
                console.log('fuck');
            }
        );
    };

    const HistoryTable = (props: any) => {
        let rounds = props.game.rounds;

        const team1 = props.game.teams[0];
        const team2 = props.game.teams[1];

        return (
            <HistoryWrapper
                teamNameOne={team1.name}
                teamNameTwo={team2.name}
                round={getNextRoundId(rounds)}
                addRound={addRound}
            >
                {rounds.map((round: Round, numOfRounds: number) => {
                    // Fuck you databases!
                    let trumpf = trump[round.trumpfId - 1];
                    let pointsPerTeamPerRound = round.pointsPerTeamPerRound;
                    let teamOnePoints = 0;
                    let teamTwoPoints = 0;

                    pointsPerTeamPerRound.map((pointsPerRound) => {
                        let teamId = pointsPerRound.teamId;
                        let pointsTeam =
                            pointsPerRound.points * trumpf.multiplier;
                        let wiisPoints =
                            pointsPerRound.wiisPoints * trumpf.multiplier;
                        let points = pointsTeam + wiisPoints;
                        if (teamId === team1.id) {
                            teamOnePoints = points;
                        } else {
                            teamTwoPoints = points;
                        }
                    });
                    return (
                        <HistoryTableRow
                            runde={numOfRounds + 1}
                            teamOnePoints={teamOnePoints}
                            teamTwoPoints={teamTwoPoints}
                            trump={trumpf.name}
                            removeRound={removeRound}
                            roundId={round.id}
                        />
                    );
                })}
            </HistoryWrapper>
        );
    };

    return (
        <ViewWrapper>
            <h1>{props.match.params.id}</h1>
            {isLoading ? (
                <CircularProgress />
            ) : error ? (
                <p>error: {error.message}</p>
            ) : (
                <div className={'gameBoardWrapper'}>
                    <div>
                        <canvas ref={canvasRef} width={515} height={720} />
                    </div>
                    <div>
                        <div className={'gameBoardInnerWrapper'}>
                            <div>
                                <h2>History</h2>
                                <HistoryTable game={game} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ViewWrapper>
    );
}

export default GameBoard;
