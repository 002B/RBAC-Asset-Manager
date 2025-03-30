import company from "../json/company.json";

function getAllItem() {
    return Object.entries(company).map(([key, value]) => {
        return Object.entries(value.branch).map(([branchKey, branchValue]) => {
            return Object.entries(branchValue.item).map(([itemKey, itemValue]) => {
                return [
                    itemKey,
                    itemValue.brand,
                    itemValue.type,
                    itemValue.capacity,
                    itemValue.install_by,
                    itemValue.install_date,
                    itemValue.exp_date,
                    itemValue.location,
                    itemValue.color,
                    itemValue.next_check,
                    itemValue.last_check,
                    itemValue.status,
                    itemValue.log
                ];
            });
        });
    }).flat(2);
}

function getItemCompany(Com){
    if(company[Com]){
        return Object.entries(company[Com]["branch"]).map (([key, value]) => {
            return Object.entries(company[Com]["branch"][key]["item"]).map ((keys,values) =>{
                return [keys];
            })
        }).flat(2);
    }else{
        return [];
    }
}

function getItemBranch(Com,Bran) {
    if(company[Com] && company[Com]["branch"][Bran]){
        return company[Com]["branch"][Bran].item;
    }else{
        return [];
    }
}

function getItemInfo(Com,Bran,ID){
    if (company[Com] && company[Com]["branch"][Bran] && company[Com]["branch"][Bran]["item"][ID]) {
        return {Com,Bran,ID, ...company[Com]["branch"][Bran]["item"][ID]};
    }else{
        return null;
    }
}

function getLogReport(Com){
    if(company[Com]){
        return company[Com].Log.Report;
    }else{
        return [];
    }
}

function getLogLogin(Com){
    if(company[Com]){
        return company[Com].Log.Login;
    }else{
        return [];
    }
}

function getLogItem(Com){
    if(company[Com]){
        return company[Com].Log.item;
    }else{
        return [];
    }
}

function getNextCheck(Com,Bran){
    if(company[Com] && company[Com]["branch"][Bran]){
        return company[Com]["branch"][Bran].check.next_check;
    }else{
        return [];
    }
}

function getLastCheck(Com,Bran){
    if(company[Com] && company[Com]["branch"][Bran]){
        return company[Com]["branch"][Bran].check.last_check;
    }else{
        return [];
    }
}


function getBadItemBranch(Com,Bran) {
    if(company[Com] && company[Com]["branch"][Bran]){
        return Object.entries(company[Com]["branch"][Bran]["item"]).filter(item => item[1].status === "Bad");
    }else{
        return [];
    }
}

export { getAllItem, getItemBranch, getItemCompany, getLogReport, getLogLogin, getLogItem, getNextCheck, getLastCheck, getItemInfo, getBadItemBranch };