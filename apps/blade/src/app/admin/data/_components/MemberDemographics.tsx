"use client";

import { api } from "~/trpc/react";
import DuesPercentCard from "./DuesPercentCard";
import GenderPieChartCard from "./GenderPieChartCard";

export default function MemberDemographics() {
    const { data: members } = api.member.getMembers.useQuery();
    const { data: duesPayingStatus } = api.member.getDuesPayingMembers.useQuery();

    return (
        <div className="my-8">
            {members && duesPayingStatus ? 
            <div className="flex flex-col gap-4">
                <DuesPercentCard numMembers={members.length} numDuesPaying={duesPayingStatus.length} /> 
                <div className="flex flex-row sm:flex-col">
                    <GenderPieChartCard members={members} />
                </div>
            </div>
            : <p>error</p>}
        </div>
    );
}