import company from '../json/company.json';

/**
 * @function getLogReport
 * @description ดึงรายงานสถานะของบริษัท
 * @param {string} Com บริษัท
 * @returns {Array} รายงานสถานะของบริษัท
 */
function getLogReport(Com){
    if(company[Com]){
        return company[Com].log.Report;
    }else{
        return [];
    }
}

/**
 * @function getLogLogin
 * @description ดึงประวัติเข้าสู่ระบบ 
 * @param {string} Com บริษัท
 * @returns {Array} ประวัติเข้าสู่ระบบ 
 */
function getLogLogin(Com){
    if(company[Com]){
        return company[Com].log.Login;
    }else{
        return [];
    }
}

/**
 * @function getLogItem
 * @description ดึงประวัติการตรวจสอบรายการของบริษัท
 * @param {string} Com บริษัท
 * @returns {Array} ประวัติการตรวจสอบรายการของบริษัท
 */
function getLogItem(Com){
    if(company[Com]){
        return company[Com].log.item;
    }else{
        return [];
    }
}

/**
 * @function getNextCheck
 * @description ดึงวันตรวจสอบครั้งถัดไปของสาขาในบริษัท
 * @param {string} Com บริษัท
 * @param {string} Bran สาขา
 * @returns {string|Array} วันที่ตรวจสอบครั้งถัดไปของสาขา
 */
function getNextCheck(Com,Bran){
    if(company[Com] && company[Com]["branch"][Bran]){
        return company[Com]["branch"][Bran].check.next_check;
    }else{
        return [];
    }
}

/**
 * @function getLastCheck
 * @description ดึงวันตรวจสอบครั้งล่าสุดของสาขาในบริษัท
 * @param {string} Com บริษัท
 * @param {string} Bran สาขา
 * @returns {string|Array} วันที่ตรวจสอบครั้งล่าสุดของสาขา
 */
function getLastCheck(Com,Bran){
    if(company[Com] && company[Com]["branch"][Bran]){
        return company[Com]["branch"][Bran].check.last_check;
    }else{
        return [];
    }
}

export { getLogReport, getLogLogin, getLogItem, getNextCheck, getLastCheck };