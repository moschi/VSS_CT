import TableRow from '@material-ui/core/TableRow';
import { TableCell } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import * as React from 'react';

interface HistoryTableRowProps {
    runde: number;
    teamOnePoints: number;
    teamTwoPoints: number;
    trump: string;
    roundId: number;
    removeRound: Function;
    gameIsFinished: boolean;
}

export const HistoryTableRow = (props: HistoryTableRowProps) => {
    return (
        <TableRow key={props.roundId}>
            <TableCell>{props.runde}</TableCell>
            <TableCell>{props.teamOnePoints}</TableCell>
            <TableCell>{props.teamTwoPoints}</TableCell>
            <TableCell>{props.trump}</TableCell>
            <TableCell>
                <IconButton
                    aria-label="delete"
                    onClick={() => props.removeRound(props.roundId)}
                    disabled={props.gameIsFinished}
                >
                    <DeleteOutlineIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    );
};
