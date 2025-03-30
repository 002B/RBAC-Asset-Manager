import React from 'react';
import { useAuth } from '../../Auth/AuthProvider';

import DashboardSuperAdmin from './Dashboard-SuperAdmin';
import DashboardAdmin from './Dashboard-Admin';
import DashboardWorker from './Dashboard-Worker';
import DashboardSuperMember from './Dashboard-SuperMember';
import DashboardMember from './Dashboard-Member';

const Dashboard = () => {
    const { user } = useAuth();

    switch (user.role) {
        case "super_admin":
            return <DashboardSuperAdmin />;
        case "admin":
            return <DashboardAdmin />;
        case "worker":
            return <DashboardWorker />;
        case "super_member":
            return <DashboardSuperMember />;
        case "member":
            return <DashboardMember />;
        default:
            return null
    };
}

export default Dashboard;
