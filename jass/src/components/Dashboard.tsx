import React from 'react';
import {Grid} from "@material-ui/core";
import {Game} from "../classes/Game";
import calculatePointsPerTeam from "../classes/GameUtils";
import GameMocks from "../classes/GameMocks";
import {withRouter} from "react-router";


function Dashboard(props:any) {

    const gameArray: Game[] = GameMocks;

    const games = gameArray.map((game: Game) => {
        const results = calculatePointsPerTeam(game);

        return (
            <Grid item xs={12} md={4} lg={2}>

                    <div className="gameWrapper" onClick={() => {

                        const route = "/game/" + game.id;

                        props.history.push(route);

                    }}>
                        <table>
                            <thead>
                            </thead>
                            <tbody>
                            <tr>
                                <th>Game</th>
                                <th>{game.id}</th>
                            </tr>
                            <tr>
                                <td>{results.team1.team.name}</td>
                                <td>{results.team1.points}</td>
                            </tr>
                            <tr>
                                <td>{results.team2.team.name}</td>
                                <td>{results.team2.points}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
            </Grid>
        )
    });


    return (
        <div>
            <h1>Dashboard</h1>
            <h2>Recent Activity</h2>

            <Grid container
                  spacing={10}
                  direction="row"
                  justify="center"
                  align-items="center">
                {games}



            </Grid>

            <h2>Games</h2>

            <Grid container
                  spacing={10}
                  direction="row"
                  justify="center"
                  align-items="center">
                <Grid item xs={12} md={4} lg={2}>
                    <div className="gameWrapper"><h1>+ add Game</h1></div>
                </Grid>
                {games}
            </Grid>


            {/*<Button variant="contained" color="primary">ASDF</Button>*/}
        </div>
    );
}

export default withRouter(Dashboard)
