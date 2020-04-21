import React, {useEffect, useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import {Team} from "../classes/Game";

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

interface CreateGame {
    name1: string;
    team1?: Team;
    name2: string;
    team2?: Team;
}

function CreateGame() {

    const teamValidationMessage = 'A team name must consist of numbers or letters';
    const teamNameRegex = RegExp('^[\\w\\d]+$');

    const classes = useStyles();

    const initialGame: CreateGame = {name1: '', name2: ''};
    const initialMessage: Message = {showError: false, message: ''};
    const [game, setGame] = useState(initialGame);
    const [team1, setTeam1] = useState({} as Team);
    const [team2, setTeam2] = useState({} as Team);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [name1Message, setName1Messages] = useState(initialMessage);
    const [name2Message, setName2Messages] = useState(initialMessage);
    const [teams, setTeams] = useState([] as Team[]);
    const [, setTeamError] = useState();

    useEffect(() => {
        fetch('/api/v1/team', {
            method: 'GET',
        })
            .then((response) => {
                if (response.ok) {
                    response.json().then((data) => {
                        setTeams(data);
                    });
                } else {
                    console.log("Error during game loading, please try again!")
                    throw new Error("Error during game loading, please try again!");
                }
            })
            .catch((error) => {
                console.log("error: " + error);
                setTeamError({message: error.message, error: error});
                setTeams([{
                        id: 2,
                        name: 'brudas'
                    } as Team, {
                        id: 3,
                        name: 'bestis'
                    } as Team
                ])
            });
    }, [setTeams, setTeamError]);

    const validateName1 = (value: string) => {
        return validate(value,
            teamNameRegex,
            setName1Messages,
            () => {
                return {
                    message: '',
                    showError: false
                };
            },
            () => {
                return {
                    showError: true,
                    message: teamValidationMessage
                };
            }
        );
    };

    const validateName2 = (value: string) => {
        return validate(value,
            teamNameRegex,
            setName2Messages,
            () => {
                return {
                    ...name2Message,
                    showError: false
                };
            },
            () => {
                return {
                    showError: true,
                    message: teamValidationMessage
                };
            }
        );
    };

    const submit = () => {
        const validName1 = validateName1(game.name1);
        const validName2 = validateName2(game.name2)
        if (validName1 && validName2) {
            console.log('submit this funking game: ' + JSON.stringify(game));
            reset();
        } else {
            console.log('no valid input');
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
        setGame(initialGame);
        setName1Messages(initialMessage);
        setName2Messages(initialMessage);
    };
    const [value, setValue] = React.useState<TeamType | null>(null);
    const selectTeam1 = async (team: TeamType) => {
        if (team.id) {
            setTeam1(team);
            return Promise.resolve();
        } else {
            fetch('/api/v1/team', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: team.name
                }),
            })
                .then((response) => {
                    if (response.ok) {
                        response.json().then((data) => {
                            team.id = data.id;
                            setTeam1(team);
                            return Promise.resolve();
                        });
                    } else {
                        console.log("Error team creation, please try again!")
                        throw new Error("Error team creation, please try again!");
                    }
                })
                .catch((error: ErrorEvent) => {
                    console.log("error: " + error);
                    throw new Error(error.message);
                });
        }
    };

    return (
        <form className={classes.root}>
            <h1>Create Game</h1>
            <Autocomplete
                value={team1}
                disabled={isLoading}
                onChange={(event: any, team: TeamType | null) => {
                    if (team && team.name) {
                        // TODO create team and put the correct id in
                        setIsLoading(true);
                        selectTeam1(team)
                            .then(() => setIsLoading(false))
                            .catch((error: ErrorEvent) => {
                                setMessage(error.message);
                            });
                        return;
                    }
                    // TODO handle null
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    if (params.inputValue !== '') {
                        filtered.push({
                            name: params.inputValue,
                            title: `Add "${params.inputValue}"`,
                        });
                    }

                    return filtered;
                }}
                id="free-solo-with-text-demo"
                options={teams}
                getOptionLabel={(option) => {
                    // e.g value selected with enter, right from the input
                    if (typeof option === 'string') {
                        return option;
                    }
                    return option.name;
                }}
                renderOption={(option) => {
                    return option.title ? option.title : option.name;
                }}
                style={{ width: 300 }}
                freeSolo
                renderInput={(params) => (
                    <TextField {...params} label="Team 1" variant="outlined" />
                )}
            />
            <Button onClick={submit}>Create</Button>
            <Button onClick={reset}>Reset</Button>
            <p>{team1.name}, {team1.id}</p>
            <p>{message}</p>
        </form>
    );
}

export default CreateGame