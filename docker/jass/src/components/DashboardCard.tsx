
import React from 'react';

interface DashboardCardProps {
    teamOne: string;
    pointsTeamOne: number;
    teamTwo: string;
    pointsTeamTwo: number;
}

export default function DashboardCard(props: DashboardCardProps) {

    return <div className={"dashboardCardWrapper"}>
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