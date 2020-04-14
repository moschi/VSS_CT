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

interface TeamType {
    inputValue?: string;
    title: string;
}

interface CreateGame {
    name1: string;
    name2: string;
}

function CreateGame() {

    const teamValidationMessage = 'A team name must consist of numbers or letters';
    const teamNameRegex = RegExp('^[\\w\\d]+$');

    const classes = useStyles();

    const initialGame: CreateGame = {name1: '', name2: ''};
    const initialMessage: Message = {showError: false, message: ''};
    const [game, setGame] = useState(initialGame);
    const [name1Message, setName1Messages] = useState(initialMessage);
    const [name2Message, setName2Messages] = useState(initialMessage);
    const [teams, setTeams] = useState([]);
    const [teamError, setTeamError] = useState();

    useEffect(() => {
        fetch('api/v1/team', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (response.ok) {
                    response.json().then((data) => {
                        setTeams(data);
                    });
                } else {
                    throw new Error("Error during game loading, please try again!");
                }
            })
            .catch((error) => {
                setTeamError({message: error.message, error: error});
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
    }

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
    const [value, setValue] = useState();

    return (
        <form className={classes.root}>
            <h1>Create Game</h1>
            <Autocomplete
                value={value}
                onChange={(event: any, newValue: TeamType | null) => {
                    if (newValue && newValue.inputValue) {
                        setValue({
                            title: newValue.inputValue,
                        });
                        return;
                    }

                    setValue(newValue);
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    if (params.inputValue !== '') {
                        filtered.push({
                            inputValue: params.inputValue,
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
                    if (option.inputValue) {
                        return option.inputValue;
                    }
                    return option.title;
                }}
                renderOption={(option) => option.title}
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
        </form>
    );
}

export default CreateGame