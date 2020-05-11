import {FullGame, Round} from '../classes/Game';
import {default as React, useCallback, useEffect, useState} from 'react';
import {HistoryTableRow} from './HistoryTableRow';
import {HistoryWrapper} from './HistoryWrapper';
import {TableBody, TableCell} from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
import {trump} from './GameBoard';

interface HistoryTableProps {
    game: FullGame;
    removeRound: Function;
    getNextRoundId: Function;
    addRound: Function;
}

export const HistoryTable = (props: HistoryTableProps) => {
    const rounds = props.game.rounds;
    const team1 = props.game.teams[0];
    const team2 = props.game.teams[1];
    const [team1Total, setTeam1Total] = useState<number>(0);
    const [team2Total, setTeam2Total] = useState<number>(0);

    const pointsPerRound = useCallback((round: Round, callbackTeam1: (points: number) => void, callbackTeam2: (points: number) => void) => {
        let trumpf = trump[round.trumpfId - 1];
        round.pointsPerTeamPerRound.map((pointsPerRound) => {
            let teamId = pointsPerRound.teamId;
            let pointsTeam =
                pointsPerRound.points * trumpf.multiplier;
            let wiisPoints =
                pointsPerRound.wiisPoints * trumpf.multiplier;
            let points = pointsTeam + wiisPoints;
            if (teamId === team1.id) {
                callbackTeam1(points);
            } else {
                callbackTeam2(points);
            }
        });
    },[team1.id]);

    useEffect(() => {
        setTeam1Total(0);
        setTeam2Total(0);
        rounds.map((round: Round) => {
            pointsPerRound(round,
                (points: number) => {
                    setTeam1Total(total => total + points);
                },
                (points: number) => {
                    setTeam2Total(total => total + points);
                });
        });
    },[pointsPerRound, rounds]);

    const renderRounds = () => {
        return rounds.map((round: Round, numOfRounds: number) => {
            let teamOnePoints = 0;
            let teamTwoPoints = 0;
            pointsPerRound(round,
                (points: number) => {
                    teamOnePoints = points
                },
                (points: number) => {
                    teamTwoPoints = points;
                });

            return (
                <HistoryTableRow
                    runde={numOfRounds + 1}
                    teamOnePoints={teamOnePoints}
                    teamTwoPoints={teamTwoPoints}
                    trump={trump[round.trumpfId - 1].name}
                    removeRound={props.removeRound}
                    roundId={round.id}
                    key={round.id}
                />
            );
        })
    };

    return (
        <HistoryWrapper
            teamNameOne={team1.name}
            teamNameTwo={team2.name}
            round={props.getNextRoundId(rounds)}
            addRound={props.addRound}
        >
            <TableBody>
                {renderRounds()}
                {rounds.length > 0 &&
                <TableRow>
                    <TableCell rowSpan={2}>Total: </TableCell>
                    <TableCell colSpan={1}>{team1Total}</TableCell>
                    <TableCell>{team2Total}</TableCell>
                </TableRow>
                }
            </TableBody>
        </HistoryWrapper>
    );
};