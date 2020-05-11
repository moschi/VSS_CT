import TableRow from '@material-ui/core/TableRow';
import {TableCell} from '@material-ui/core';
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
}

export const HistoryTableRow = (props: HistoryTableRowProps) => {
    return (
        <TableRow key={props.roundId}>
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