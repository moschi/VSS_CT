import React, {useEffect, useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Autocomplete, {createFilterOptions} from '@material-ui/lab/Autocomplete';
import {GameCreation, Team} from "../classes/Game";
import CircularProgress from "@material-ui/core/CircularProgress";
import ViewWrapper from "./ViewWrapper";
import {Redirect} from 'react-router-dom';
import {get} from "../classes/RestHelper";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& .MuiTextField-root': {
                margin: theme.spacing(1),
                width: '25ch',
            },
        },
    }),
);

const filter = createFilterOptions<TeamType>();

interface TeamType extends Team {
    title?: string;
}

const GAME_NOT_CREATED = 'Spiel wurde nicht erstellt, bitte versuchen sie es erneut.';
const NOT_AVAILABLE = 'Momentant können keine Spiele erstellt werden, bitte versuchen sie es später erneut.';
const BAD_TEAM_NAME = 'Ein Teamname muss aus Buchstaben und Zahlen bestehen.';
const TEAM_FAILURE = 'Team wurde nicht erstellt, bitte versuchen sie es erneut!';

function CreateGame() {

    const teamNameRegex = RegExp('^[\\w\\d]{1,20}$');
    const [isLoading, setIsLoading] = useState<Boolean>(true);
    const classes = useStyles();
    const initialMessage: Message = {show: false, message: ''};

    const [team1, setTeam1] = useState<Team>({} as Team);
    const [team2, setTeam2] = useState<Team>({} as Team);
    const [team1ready, setTeam1ready] = useState<boolean>(false);
    const [team2ready, setTeam2ready] = useState<boolean>(false);
    const [team1Message, setTeam1Messages] = useState<Message>(initialMessage);
    const [team2Message, setTeam2Messages] = useState<Message>(initialMessage);
    const [isLoadingTeam1, setIsLoadingTeam1] = useState(false);
    const [isLoadingTeam2, setIsLoadingTeam2] = useState(false);

    const [message, setMessage] = useState<Message>(initialMessage);
    const [teams, setTeams] = useState([] as Team[]);
    const [teamError, setTeamError] = useState<Message>({
        show: false,
        message: '',
    });
    const [gameId, setGameId] = useState<number>();

    useEffect(() => {
        setIsLoading(true);
        get("team", (data: any) => {
            setTeams(data);
            setTeamError({
                message: '',
                show: false,
            });
            setIsLoading(false);
        }, (error: any) => {
            setTeamError({
                show: true,
                message: error.message,
                error: error
            });
        });
    }, [setTeams, setTeamError, setIsLoading]);

    const validateName1 = (value: string) => {
        return validate(value,
            teamNameRegex,
            setTeam1Messages,
            () => {
                return {
                    message: '',
                    show: false
                };
            },
            () => {
                return {
                    show: true,
                    message: BAD_TEAM_NAME
                };
            }
        );
    };

    const validateName2 = (value: string) => {
        return validate(value,
            teamNameRegex,
            setTeam2Messages,
            () => {
                return {
                    ...team2Message,
                    show: false
                };
            },
            () => {
                return {
                    show: true,
                    message: BAD_TEAM_NAME
                };

            }
        );
    };

    const submit = () => {
        if (((team1.id || team1.id === 0) && team1.id.toString()) && ((team2.id || team2.id === 0) && team2.id.toString()) && (team1.id !== team2.id)) {
            const game: GameCreation = {
                teams: [
                    team1,
                    team2,
                ]
            };
            postGame(game)
                .then(id => {
                    reset();
                    setGameId(id);
                })
                .catch((error: Error) => {
                    reset();
                    setMessage({
                        show: true,
                        message: error.message,
                        error: error,
                    });
                });
        } else {
            setMessage({
                show: true,
                message: GAME_NOT_CREATED,
            });
        }
    };

    const postGame = async (game: GameCreation): Promise<number> => {
        const response = await fetch('/v1/game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(game),
        });
        if (response.ok) {
            const data = await response.json();
            return Promise.resolve(data.id);
        } else {
            throw new Error(GAME_NOT_CREATED);
        }
    };

    /**
     * Returns true if no validation error occurred
     * @param value
     * @param regex
     * @param setMessage
     * @param noValidationError
     * @param validationError
     */
    const validate = (value: string, regex: RegExp, setMessage: (message: Message) => void, noValidationError: () => Message, validationError: () => Message): boolean => {
        let hasError = false;
        if (regex.test(value)) {
            setMessage(noValidationError());
        } else {
            setMessage(validationError());
            hasError = true;
        }
        return !hasError;
    };

    const reset = () => {
        setTeam1({} as Team);
        setTeam2({} as Team);
        setTeam1Messages(initialMessage);
        setTeam2Messages(initialMessage);
        setMessage(initialMessage);
    };

    const postTeam = async (name: string): Promise<number> => {
        const response = await fetch('/v1/team', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name
            }),
        });
        if (response.ok) {
            const data = await response.json();
            return Promise.resolve(data.id);
        } else {
            throw new Error(TEAM_FAILURE);
        }
    };

    const selectTeam = async (team: TeamType, setTeam: Function) => {
        if ((team.id || team.id === 0) && team.id.toString()) {
            setTeam(team);
        } else {
            const id = await postTeam(team.name);
            if (id) {
                team.id = id;
                setTeam(team);
            } else {
                return Promise.reject('Team nicht erstellt!');
            }
        }
        return Promise.resolve();
    };

    const onChangeTeam1 = (event: any, team: TeamType | null) => {
        if (team && team.name) {
            setIsLoadingTeam1(true);
            if (validateName1(team.name)) {
                selectTeam(team, setTeam1)
                    .then(() => {
                        setIsLoadingTeam1(false);
                        setTeam1ready(true);
                    })
                    .catch((error: Error) => {
                        setMessage({
                            show: true,
                            message: error.message,
                            error: error,
                        });
                    });
            } else {
                setTeam1ready(false);
            }
            return;
        } else {
            setTeam1ready(false);
        }
    };

    const onChangeTeam2 = (event: any, team: TeamType | null) => {
        if (team && team.name) {
            setIsLoadingTeam2(true);
            if (validateName2(team.name)) {
                selectTeam(team, setTeam2)
                    .then(() => {
                        setIsLoadingTeam2(false);
                        setTeam2ready(true);
                    })
                    .catch((error: Error) => {
                        setMessage({
                            show: true,
                            message: error.message,
                            error: error
                        });
                    });
            } else {
                setTeam2ready(false);
            }
            return;
        } else {
            setTeam2ready(false);
        }
    };

    const filterInput = (options: any, params: any): TeamType[] => {
        const filtered = filter(options, params);
        if (params.inputValue !== '') {
            filtered.push({
                id: params.id,
                name: params.inputValue,
                title: `Add "${params.inputValue}"`,
            });
        }
        return filtered;
    };

    const getOptionLabel = (option: any): string => {
        // e.g value selected with enter, right from the input
        if (typeof option === 'string') {
            return option;
        }
        return option.name;
    };

    const renderOption = (option: TeamType) => {
        return option.title ? option.title : option.name;
    };

    return (
        <ViewWrapper>
            <React.Fragment>
                {teamError ?
                    isLoading ?
                        <CircularProgress/>
                        :
                        gameId || gameId === 0 ?
                            <Redirect to={'/game/' + gameId}/>
                            :
                            <form className={classes.root}>
                                <h1>Create Game</h1>
                                <Autocomplete
                                    value={team1}
                                    loading={isLoadingTeam1}
                                    onChange={onChangeTeam1}
                                    filterOptions={filterInput}
                                    id="free-solo-with-text-demo"
                                    options={teams}
                                    getOptionLabel={getOptionLabel}
                                    renderOption={renderOption}
                                    style={{width: 300}}
                                    freeSolo
                                    renderInput={(params) => (
                                        <TextField error={team1Message.show}
                                                   helperText={team1Message.message} {...params}
                                                   label="Team 1" variant="outlined"/>
                                    )}
                                />
                                <Autocomplete
                                    value={team2}
                                    loading={isLoadingTeam2}
                                    onChange={onChangeTeam2}
                                    filterOptions={filterInput}
                                    id="free-solo-with-text-demo"
                                    options={teams}
                                    getOptionLabel={getOptionLabel}
                                    renderOption={renderOption}
                                    style={{width: 300}}
                                    freeSolo
                                    renderInput={(params) => (
                                        <TextField error={team2Message.show}
                                                   helperText={team2Message.message} {...params}
                                                   label="Team 2" variant="outlined"/>
                                    )}
                                />
                                <Button disabled={!team1ready || !team2ready} onClick={submit}>Create</Button>
                                <Button onClick={reset}>Reset</Button>
                                <p>{message.show && message.message}</p>
                            </form>
                    :
                    <p>{NOT_AVAILABLE}</p>
                }
            </React.Fragment>
        </ViewWrapper>
    );
}

export default CreateGame