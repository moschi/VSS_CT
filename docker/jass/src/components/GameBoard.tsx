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
import { del, get, post } from '../classes/RestHelper';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import GameMocks from '../classes/GameMocks';
import { HistoryTable } from './HistoryTable';

export const trump: Trumpf[] = [
    { id: 1, name: 'Eichel', multiplier: 1 },
    { id: 2, name: 'Rose', multiplier: 1 },
    { id: 3, name: 'Schellen', multiplier: 2 },
    { id: 4, name: 'Schilten', multiplier: 2 },
    { id: 5, name: 'ObenAben', multiplier: 3 },
    { id: 6, name: 'UntenUfen', multiplier: 3 },
];

function GameBoard(props: any) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // TODO remove mock usage
    const [game, setGame] = useState<FullGame>(GameMocks[0]);
    const [rerender, setRerender] = useState<boolean>(false);
    const [rererenderer, setRerererenderer] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState();
    const divRef = React.useRef<HTMLDivElement>(null);

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
                console.log('fuck');
            }
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
                <div className={'gameBoardWrapper'} ref={divRef}>
                    <div>
                        <canvas ref={canvasRef} width={515} height={720} />
                    </div>
                    <div>
                        <div className={'gameBoardInnerWrapper'}>
                            <div>
                                <h2>History</h2>
                                <HistoryTable
                                    game={game}
                                    removeRound={removeRound}
                                    getNextRoundId={getNextRoundId}
                                    addRound={addRound}
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
