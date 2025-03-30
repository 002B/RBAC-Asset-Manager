const express = require("express");
const router = express.Router();
const fs = require("fs");

const filePath = "./data/company.json";

router.get("/", async (req, res) => {
    try {
        const companyData = JSON.parse(fs.readFileSync(filePath));
        
        const allReports = Object.values(companyData).flatMap(company => {
            return company.log?.report || [];
        });

        res.json({ 
            success: true,
            count: allReports.length,
            reports: allReports 
        });
        
    } catch(error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            error: "Internal server error" 
        });
    }
});

router.get("/:company?", async (req, res) => {
    try {
        const companyData = JSON.parse(fs.readFileSync(filePath));
        const companyName = req.params.company;
        
        let allReports = Object.entries(companyData).flatMap(([companyKey, company]) => {
            if (companyName && companyKey.toLowerCase() !== companyName.toLowerCase()) {
                return [];
            }
            return company.log?.report || [];
        });

        if (companyName && allReports.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: `No reports found for company '${companyName}'` 
            });
        }

        res.json({ 
            success: true,
            count: allReports.length,
            reports: allReports 
        });
        
    } catch(error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            error: "Internal server error" 
        });
    }
});

module.exports = router;