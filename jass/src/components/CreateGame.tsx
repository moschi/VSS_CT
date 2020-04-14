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
    const [name1Message, setName1Messages] = useState(initialMessage);
    const [name2Message, setName2Messages] = useState(initialMessage);
    const [teams, setTeams] = useState([] as Team[]);
    const [, setTeamError] = useState();

    useEffect(() => {
        fetch('api/v1/team', {
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

    const changeName1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGame({...game, name1: e.currentTarget.value})
        validateName1(e.currentTarget.value);
    };

    const changeName2 = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGame({...game, name2: e.currentTarget.value})
        validateName2(e.currentTarget.value)
    };

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

    return (
        <form className={classes.root}>
            <h1>Create Game</h1>
            <Autocomplete
                value={team1}
                onChange={(event: any, newValue: TeamType | null) => {
                    if (newValue && newValue.name) {
                        // TODO create team and put the correct id in
                        setTeam1(newValue)
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
                    <TextField {...params} label="Free solo with text demo" variant="outlined" />
                )}
            />
            <TextField error={name1Message.showError} helperText={name1Message.message} id="name1" label="Name Team 1" value={game.name1} onChange={changeName1}/> <br/>
            <TextField error={name2Message.showError} helperText={name2Message.message} id="name2" label="Name Team 2" value={game.name2} onChange={changeName2}/> <br/>
            <Button onClick={submit}>Create</Button>
            <Button onClick={reset}>Reset</Button>
            <p>{team1.name}, {team1.id}</p>
        </form>
    );
}

export default CreateGame