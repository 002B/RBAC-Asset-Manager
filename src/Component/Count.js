import company from '../json/company.json';
import user from '../json/permission.json';

/**
 * ดึงจำนวนถังทั้งหมดในระบบ
 * @returns {number} จำนวนถังทั้งหมด
 */
function getAllItemCompanyCount() { 
    let count = 0;
    Object.entries(company).map(([key, value]) => {
        count += getItemCompanyCount(key);
    });
    return count;
}

/**
 * ดึงจำนวนถังทั้งหมดในบริษัท
 * @param {string} Com บริษัท
 * @returns {number} จำนวนถังทั้งหมดในบริษัท
 */
function getItemCompanyCount(Com) { 
    let count = 0;
    if (company[Com]) {
        Object.entries(company[Com]["branch"]).map(([key, value]) => {
            count += Object.entries(value.item).length;
        });
        return count;
    } else {
        return 0;
    }
}

/**
 * ดึงจำนวนถังทั้งหมดในสาขา
 * @param {string} Com บริษัท
 * @param {string} Bran สาขา
 * @returns {number} จำนวนถังทั้งหมดในสาขา
 */
function getItemBranchCount(Com, Bran) {
    if (company[Com] && company[Com]["branch"][Bran]) {
        return Object.entries(company[Com]["branch"][Bran]["item"]).length;
    } else {
        return 0;
    }
}

/**
 * ดึงจำนวนUserทั้งหมดในบริษัท
 * @param {string} Com บริษัท
 * @returns {number} จำนวนUserทั้งหมดในบริษัท
 */
function getUserCount(Com) { 
    if (user[Com]) {
        return Object.entries(user[Com]).length;
    } else {
        return 0;
    }
}

/**
 * ดึงจำนวนUserทั้งหมดในระบบ
 * @returns {number} จำนวนUserทั้งหมดในระบบ
 */
function getAllUserCount() {
    let count = 0;
    Object.entries(user).map(([key, value]) => {
        count += Object.entries(value).length;
    });
    return count;
}

function getCompanyCount(){
    return Object.entries(company).length;
}

/**
 * ดึงจำนวนสาขาทั้งหมดในบริษัท
 * @param {string} Com บริษัท
 * @returns {number} จำนวนสาขาทั้งหมดในบริษัท
 */
function getBranchCount(Com) {
    if (company[Com]) {
        return Object.entries(company[Com]["branch"]).length;
    } else {
        return 0;
    }
}

function getBranchList(Com) {
    if (company[Com]) {
        return Object.entries(company[Com]["branch"]).map((branch => branch[0]));
    } else {
        return [];
    }
}

function getLogReportPendingCount(Com) { //ขก.พิมพ์
    if (company[Com]) {
        return Object.entries(company[Com].log.report.pending).length;
    } else {
        return 0;
    }
}

function getAllLogReportPendingCount() { //ขก.พิมพ์
    let count = 0;
    Object.entries(company).map(([key, value]) => {
        count += getLogReportPendingCount(key);
    });
    return count;
}

function getLogReportAcceptedCount(Com) { //ขก.พิมพ์
    if (company[Com]) {
        return Object.entries(company[Com].log.report.accepted).length;
    } else {
        return 0;
    }
}

function getLogReportRejectedCount(Com) { //ขก.พิมพ์
    if (company[Com]) {
        return Object.entries(company[Com].log.report.rejected).length;
    } else {
        return 0;
    }
}

function getLogReportFixingCount(Com) { //ขก.พิมพ์
    if (company[Com]) {
        return Object.entries(company[Com].log.report.fixing).length;
    } else {
        return 0;
    }
}

function getLogReportFinishedCount(Com) { //ขก.พิมพ์
    if (company[Com]) {
        return Object.entries(company[Com].log.report.finished).length;
    } else {
        return 0;
    }
}

function getLogReportRejectCount(Com) { //ขก.พิมพ์
    if (company[Com]) {
        return Object.entries(company[Com].log.report.reject).length;
    } else {
        return 0;
    }
}

function getAllLogReportCount() { //ขก.พิมพ์
    let count = 0;
    Object.entries(company).map(([key, value]) => {
        count += getLogReportRejectCount(key) + getLogReportPendingCount(key) + getLogReportAcceptedCount(key) + getLogReportRejectedCount(key) + getLogReportFixingCount(key) + getLogReportFinishedCount(key);
    });
    return count;
}


export { getAllItemCompanyCount, getItemCompanyCount, getItemBranchCount, getUserCount, getAllUserCount, getBranchCount,getBranchList , getLogReportPendingCount,getAllLogReportPendingCount, getLogReportAcceptedCount, getAllLogReportCount, getCompanyCount };

