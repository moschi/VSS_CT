import React from 'react';


export default function DashboardCard(props: any) {

    return <div className={"dashboardCardWrapper"}>
        <h3>{props.gameTitle}</h3>
        <div className={"dashboardCardInnerWrapper"}>
            <div>
                <p>{props.teamOne}</p>
            </div>
            <div>
                <p>{props.pointsTeamOne}</p>
            </div>
        </div>
        <div className={"dashboardCardInnerWrapper"}>
            <div>
                <p>{props.teamTwo}</p>
            </div>
            <div>
                <p>{props.pointsTeamTwo}</p>
            </div>
        </div>
    </div>;
}