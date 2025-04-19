import React, { useEffect, useState } from 'react';
import DataTable from '../../Component/DataTable/DataTable';
import Status from '../../Component/Status/Status';
import { useAuth } from '../../Auth/AuthProvider';

const ActivityLog = () => {
    const { user } = useAuth();
    const [activityLog, setActivityLog] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                user.selectedBranch ? user.selectedBranch : user.selectedBranch = user.branch[0]
                const response = await fetch(
                    `http://localhost:3000/activitylog/all`
                );
                const data = await response.json();
                const formattedData = data.map((item) => [
                    item.log_id,
                    item.date.split("T")[0],
                    item.date.split("T")[1].split(".")[0],
                    item.activity,
                    item.username,
                    item.role
                ]);
                console.log(formattedData);
                
                setActivityLog(formattedData);
            } catch (error) {
                console.error("Error fetching inventory data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user.company, user.selectedBranch, activityLog]);

    if (loading) return <div>Loading...</div>;
    return (
        <div className="flex flex-col gap-2 w-full h-fit rounded drop-shadow">
            <div className='w-full rounded drop-shadow'>
                <Status role={user.role} company={user.company} />
            </div>
            <div className="w-full rounded drop-shadow">
                <div className='bg-white p-1 rounded drop-shadow'>
                    <DataTable tIcon={"revision"} tName={"Activity Log"} title={["Log_ID", "Date", "Time", "Activity", "Username", "Role"]} data={activityLog} hasButton={false} />
                </div>
            </div>
        </div>
    );
}

export default ActivityLog;