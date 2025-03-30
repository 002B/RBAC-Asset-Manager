import React from 'react';
import { useAuth } from '../../Auth/AuthProvider';

// import InventorySAdmin from './Inventory-SAdmin';
import InventoryAdmin from './Inventory-Admin';
import InventoryWorker from './Inventory-Worker';
import InventorySuperMember from './Inventory-SuperMember';
import InventoryMember from './Inventory-Member';


const Inventory = () => {
    const { user } = useAuth();

    switch (user.role) {
        case "super_admin":
            return <InventoryAdmin />;
        case "admin":
            return <InventoryAdmin />;
        case "worker":
            return <InventoryWorker />;
        case "super_member":
            return <InventorySuperMember />;
        case "member":
            return <InventoryMember />;
        default:
            return null
    };
}

export default Inventory;
