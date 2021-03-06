import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import DrawGameBoard from '../classes/DrawGameBoard';
import {
    FullGame,
    PointsPerTeamPerRound,
    Round,
    Trumpf,
} from '../classes/Game';
import jasstafel from '../images/jasstafel.jpg';
import ViewWrapper from './ViewWrapper';
import {del, get, post, update} from '../classes/RestHelper';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import GameMocks from '../classes/GameMocks';
import { HistoryTable } from './HistoryTable';
import {Alert} from '@material-ui/lab';

export const trump: Trumpf[] = [
    { id: 1, name: 'Eichel', multiplier: 1 },
    { id: 2, name: 'Rose', multiplier: 1 },
    { id: 3, name: 'Schellen', multiplier: 2 },
    { id: 4, name: 'Schilten', multiplier: 2 },
    { id: 5, name: 'ObenAben', multiplier: 3 },
    { id: 6, name: 'UntenUfen', multiplier: 3 },
];

interface WiisPoints {
    team: number,
    points: number
}

function GameBoard(props: any) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // TODO remove mock usage
    const [game, setGame] = useState<FullGame>(GameMocks[0]);
    const [rerender, setRerender] = useState<boolean>(false);
    const [rererenderer, setRerererenderer] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
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
        const boardRenderer = new DrawGameBoard(canvasRef, game, jasstafel);
        boardRenderer.render();
    }, [rerender, game]);

    const getNextRoundId = (rounds: Round[]) => {
        return rounds.length + 1;
    };

    const addRound = (
        trumpfId: number,
        points: number,
        teamId: number,
        wiisPoints1: WiisPoints,
        wiisPoints2: WiisPoints
    ) => {
        const otherTeamId = game.teams[0].id === teamId
                ? game.teams[1].id
                : game.teams[0].id;

        const writeWiisPoints = (id: number) => {
            return wiisPoints1.team === id ? wiisPoints1.points : wiisPoints2.points
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

        const PointsPerTeamPerRoundTeam = {
            points: points,
            wiisPoints: writeWiisPoints(teamId),
            teamId: teamId,
        };
        const PointsPerTeamPerRoundOtherTeam = {
            points: pointsOtherTeam,
            wiisPoints: writeWiisPoints(otherTeamId),
            teamId: otherTeamId
        };
        const pointsPerTeamPerRound: PointsPerTeamPerRound[] = [
            PointsPerTeamPerRoundTeam,
            PointsPerTeamPerRoundOtherTeam,
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
                game.rounds = [...game.rounds, round];
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
            },
            () => {
                console.log('Please try again.');
            }
        );
    };

    const updateGame = (updatedGame: FullGame) => {
        update(
            'game/' + updatedGame.id,
            () => {
                setGame({...game, ...updatedGame});
            },
            () => {
                console.log('Please try again.');
            },
            updatedGame
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
                                {game.isFinished && <Alert severity={'info'}>Is finished!</Alert>}
                                <HistoryTable
                                    game={game}
                                    removeRound={removeRound}
                                    getNextRoundId={getNextRoundId}
                                    addRound={addRound}
                                    updateGame={updateGame}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ViewWrapper>
    );
}

export default GameBoard;
