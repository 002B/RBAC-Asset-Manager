const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const app = express();
const port = 3000;


// กำหนดพาธของไฟล์ JSON

const filedata = require("../data/company.json");
const { get } = require('http');
function getItemCompanyCount(Com) { 
    let count = 0;
    if (filedata[Com]) {
        Object.entries(filedata[Com]["branch"]).map(([key, value]) => {
            count += Object.entries(value.item).length;
        });
        return count;
    } else {
        return 0;
    }
}
// โหลดข้อมูลจากไฟล์ JSON

router.get('/', (req, res) => {
        let count = 0;

        Object.entries(filedata).map(([key, value]) => {
            count += getItemCompanyCount(key);
        });
        res.json({count});

});

router.get('/:Com', (req, res) => {
    let count = 0;
    const Com = req.params.Com;
    if (filedata[Com]) {
        Object.entries(filedata[Com]["branch"]).map(([key, value]) => {
            count += Object.entries(value.item).length;
        });
        res.json({count})
    } else {
        res.json ({count: 0});
    }
})


router.get('/:Com/:Bran', (req, res) => { 
    const Bran = req.params.Bran;
    const Com = req.params.Com;
    let count = 0
    if (filedata[Com] && filedata[Com]["branch"][Bran]) {
        count = Object.entries(filedata[Com]["branch"][Bran]["item"]).length;
        res.json({count});
    } else {
        res.json ({count: 0});
    }
});

module.exports = router;