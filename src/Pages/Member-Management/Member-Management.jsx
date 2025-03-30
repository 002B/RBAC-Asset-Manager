import React from 'react';
import MemberManagementAdmin from './Member-Management-Admin';
import MemberManagementSuperMember from './Member-Management-SuperMember';
import { useAuth } from '../../Auth/AuthProvider';

const MemberManagement = () => {
    const {user} = useAuth();

    switch (user.role) {
        case "super_admin":
            return <MemberManagementAdmin />;
        case "admin":
            return <MemberManagementAdmin />;
        case "super_member":
            return <MemberManagementSuperMember />;
        default:
            return null
    };
}

export default MemberManagement;
