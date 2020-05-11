import * as React from 'react';
import { useEffect } from 'react';
import { RefObject } from 'react';
import { useState } from 'react';
import { Button } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';

interface SimpleDialogProps {
    show: boolean;
    title: string;
    action: any;
    children: React.ReactChild;
}

const SimpleDialog = (props: SimpleDialogProps) => {
    return (
        <Dialog open={props.show} onClose={props.action}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>{props.children}</DialogContent>
            <DialogActions>
                <Button color="primary" autoFocus onClick={props.action}>
                    Okay
                </Button>
            </DialogActions>
        </Dialog>
    );
};

interface PricesProps {
    team1Total: number;
    team2Total: number;
    containerRef: RefObject<HTMLDivElement>;
    teamNameOne: string;
    teamNameTwo: string;
}
export const Prices = (props: PricesProps) => {
    const [showWinner, setShowWinner] = useState<boolean>(false);
    const [winnerShown, setWinnerShown] = useState<boolean>(false);
    const [showBergPriis, setShowbergPriis] = useState<boolean>(false);
    const [bergPriisShown, setBergPriisShown] = useState<boolean>(false);
    const [showSchniider1, setShowSchniider1] = useState<boolean>(false);
    const [showSchniider2, setShowSchniider2] = useState<boolean>(false);
    const [schniiderShown1, setSchniiderShown1] = useState<boolean>(false);
    const [schniiderShown2, setSchniiderShown2] = useState<boolean>(false);
    const maxPoints = 2500;
    const bergpriis = 1500;
    const schniider = 1250;

    useEffect(() => {
        if (props.team2Total > maxPoints || props.team1Total > maxPoints) {
            setShowWinner(true);
        }
        if (props.team2Total > bergpriis || props.team1Total > bergpriis) {
            setShowbergPriis(true);
        }
        if (props.team2Total > schniider || props.team1Total > schniider) {
            if (props.team2Total > schniider && !schniiderShown2) {
                setShowSchniider2(true);
            } else if (props.team1Total > schniider && !schniiderShown1) {
                setShowSchniider1(true);
            }
        }
    }, [props.team1Total, props.team2Total, schniiderShown2]);

    const showWinnerClose = () => {
        setShowWinner(false);
        setWinnerShown(true);
    };

    const showBergPriisClose = () => {
        setShowbergPriis(false);
        setBergPriisShown(true);
    };

    const showSchniiderClose1 = () => {
        setShowSchniider1(false);
        setSchniiderShown1(true);
    };

    const showSchniiderClose2 = () => {
        setShowSchniider2(false);
        setSchniiderShown2(true);
    };

    return (
        <React.Fragment>
            <SimpleDialog
                show={showWinner && winnerShown}
                title={'Win!'}
                action={showWinnerClose}
            >
                <div>
                    {props.team1Total > maxPoints
                        ? props.teamNameOne
                        : props.teamNameTwo}{' '}
                    won, congratulations!
                </div>
            </SimpleDialog>
            <SimpleDialog
                show={showBergPriis && !bergPriisShown}
                title={'Bergpriis!'}
                action={showBergPriisClose}
            >
                <div>
                    {props.team1Total > bergpriis
                        ? props.teamNameOne
                        : props.teamNameTwo}{' '}
                    gets the bergpriis, congratulations!
                </div>
            </SimpleDialog>
            <SimpleDialog
                show={showSchniider2 && !schniiderShown2}
                title={'Schniider!'}
                action={showSchniiderClose2}
            >
                <div>
                    {props.teamNameTwo} got out of the schniider,
                    congratulations!
                </div>
            </SimpleDialog>
            <SimpleDialog
                show={showSchniider1 && !schniiderShown1}
                title={'Schniider!'}
                action={showSchniiderClose1}
            >
                <div>
                    {props.teamNameOne} got out of the schniider,
                    congratulations!
                </div>
            </SimpleDialog>
        </React.Fragment>
    );
};
