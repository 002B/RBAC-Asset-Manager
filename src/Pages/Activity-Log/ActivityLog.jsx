import React from 'react';
import DataTable from '../../Component/DataTable/DataTable';
import Status from '../../Component/Status/Status';
import { useAuth } from '../../Auth/AuthProvider';
import userActivityLog from '../../json/activity-log.json';

const ActivityLog = () => {
    const { user } = useAuth();

    return (
        <div className="flex flex-col gap-2 w-full h-fit rounded drop-shadow">
            <div className='w-full rounded drop-shadow'>
            {Status(user.role, user.company)}
            </div>
            <div className="w-full rounded drop-shadow">
            <div className='bg-white p-1 rounded drop-shadow'>
            <DataTable tIcon={"revision"} tName={"Activity Log"} title={["Date", "Time", "Activity", "User", "Role"]} data={userActivityLog} hasButton={false} />
            </div>
            </div>
        </div>
    );
}

export default ActivityLog;