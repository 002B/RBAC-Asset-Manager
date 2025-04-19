const activityLogModal = require('./DB/activityLogModal.js');

async function getActivityLog() {
    try {
        return await activityLogModal.find({}).lean();
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        return [];
    }
}

async function getActivityLoginLogout() {
    try {
        return await activityLogModal.find({ activity: { $in: ["Log in", "Log out"] } }).lean();
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        return [];
    }
}

async function createLog(data) {
    try {
        const lastItem = await activityLogModal.countDocuments({ "log_id": { $regex: `AL-${new Date().getFullYear()}`, $options: "i" } });
        const lastNumber = lastItem + 1;
        const newId = `LOG-${new Date().getFullYear()}-${(lastNumber + 1).toString().padStart(7, '0')}`;
        return await activityLogModal.create({ log_id: newId, ...data });
    } catch (error) {
        console.error('Error creating log:', error);
        return null;
    }
}

module.exports = {
    getActivityLog,
    getActivityLoginLogout,
    createLog
};
