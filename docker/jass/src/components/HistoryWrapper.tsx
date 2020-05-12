import * as React from 'react';
import { useEffect, useState } from 'react';
import {FullGame, Team, Trumpf} from '../classes/Game';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { trump } from './GameBoard';
import { Prices } from './Prices';
import TableCell from '@material-ui/core/TableCell';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            width: '25ch',
        },
        container: {
            height: 300,
        },
        total: {
            width: '10%',
        },
        totalValues: {
            width: '24%',
        },
        popover: {
            '& .MuiPaper-elevation8': {
                width: '300px',
                height: '150px',
            },
        },
    })
);

interface HistoryWrapperProps {
    teamOne: Team;
    teamTwo: Team;
    round: number;
    addRound: Function;
    children: React.ReactChild;
    team1Total: number;
    team2Total: number;
    game: FullGame
    updateGame: Function;
}

export const HistoryWrapper = (props: HistoryWrapperProps) => {
    const [team, setTeam] = useState<number>(props.teamOne.id);
    const [points, setPoints] = useState<number>(0);
    const [trumpf, setTrumpf] = useState<Trumpf>(trump[0]);
    const [wiisPoints1, setWiisPoints1] = useState<number>(0);
    const [wiisPoints2, setWiisPoints2] = useState<number>(0);
    const classes = useStyles();

    let tableEnd: any;

    const scrollToBottom = () => {
        tableEnd.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    });

    return (
        <React.Fragment>
            <div>
                <Prices
                    team1Total={props.team1Total}
                    team2Total={props.team2Total}
                    teamNameOne={props.teamOne.name}
                    teamNameTwo={props.teamTwo.name}
                    gameId={props.game.id}
                    updateGame={props.updateGame}
                />
                <Paper>
                    <TableContainer className={classes.container}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell key="Runde">Runde</TableCell>
                                    <TableCell key={props.teamOne.name}>
                                        {props.teamOne.name}
                                    </TableCell>
                                    <TableCell key={props.teamTwo.name}>
                                        {props.teamTwo.name}
                                    </TableCell>
                                    <TableCell key="Trumpf">Trumpf</TableCell>
                                    <TableCell key="Actions">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            {props.children}
                            <div
                                ref={(el) => {
                                    tableEnd = el;
                                }}
                            />
                        </Table>
                    </TableContainer>
                    <Table>
                        <TableRow>
                            <TableCell
                                className={classes.total}
                                size="small"
                                align="left"
                            >
                                Total:
                            </TableCell>
                            <TableCell
                                className={classes.totalValues}
                                size="medium"
                                align="left"
                            >
                                {props.team1Total}
                            </TableCell>
                            <TableCell
                                className={classes.totalValues}
                                size="medium"
                                align="left"
                            >
                                {props.team2Total}
                            </TableCell>
                            <TableCell size="medium" />
                            <TableCell size="medium" />
                        </TableRow>
                    </Table>
                </Paper>
            </div>
            <br />
            <form>
                <FormControl className={classes.formControl}>
                    <FormControl>
                        <InputLabel
                            htmlFor="team-select"
                            id="team-select-label"
                        >
                            Team
                        </InputLabel>
                        <Select
                            labelId="team-select-label"
                            id="team-select"
                            value={team}
                            onChange={(
                                e: React.ChangeEvent<{ value: unknown }>
                            ) => {
                                const value: number = e.target.value as number;
                                setTeam(value);
                            }}
                            disabled={props.game.isFinished}
                        >
                            <MenuItem value={props.teamOne.id}>
                                {props.teamOne.name}
                            </MenuItem>
                            <MenuItem value={props.teamTwo.id}>
                                {props.teamTwo.name}
                            </MenuItem>
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
                        disabled={props.game.isFinished}
                    />
                    <TextField
                        id="points"
                        label={'Wiis Points ' + props.teamOne.name}
                        placeholder="0"
                        value={wiisPoints1}
                        type={'number'}
                        onChange={(e) =>
                            setWiisPoints1(Number(e.currentTarget.value))
                        }
                        disabled={props.game.isFinished}
                    />
                    <TextField
                        id="points"
                        label={'Wiis Points ' + props.teamTwo.name}
                        placeholder="0"
                        value={wiisPoints2}
                        type={'number'}
                        onChange={(e) =>
                            setWiisPoints2(Number(e.currentTarget.value))
                        }
                        disabled={props.game.isFinished}
                    />
                    <FormControl>
                        <InputLabel
                            team-select="trumpf-select"
                            id="trumpf-select-label"
                        >
                            Trumpf
                        </InputLabel>
                        <Select
                            labelId="trumpf-select-label"
                            id="trumpf-select"
                            defaultValue={trumpf.id}
                            onChange={(e) => {
                                const value = e.target.value as number;
                                setTrumpf(trump[value - 1]);
                            }}
                            disabled={props.game.isFinished}
                        >
                            {trump.map((trumpf: Trumpf) => {
                                return (
                                    <MenuItem key={trumpf.id} value={trumpf.id}>
                                        {trumpf.name}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                    <Button
                        onClick={() => {
                            props.addRound(
                                trumpf.id,
                                points,
                                team, {
                                    team: props.teamOne.id,
                                    points: wiisPoints1,
                                }, {
                                    team: props.teamTwo.id,
                                    points: wiisPoints2,
                                },
                            );
                        }}
                        disabled={props.game.isFinished}
                    >
                        Add Round
                    </Button>
                </FormControl>
            </form>
        </React.Fragment>
    );
};
