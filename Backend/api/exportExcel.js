// const express = require("express");
// const router = express.Router();
// const fs = require("fs");
// const path = require("path");
// const XLSX = require("xlsx");

// function ExportExcel(data, res) {
//     try {
//         // ตรวจสอบว่ามีข้อมูลหรือไม่
//         if (!data || data.length === 0) {
//             throw new Error("No data provided");
//         }

//         // สร้าง worksheet จากข้อมูล
//         const worksheet = XLSX.utils.json_to_sheet(data);

//         // คำนวณความกว้างของคอลัมน์อัตโนมัติ
//         const columnWidths = Object.keys(data[0]).map((key) => {
//             const maxContentLength = Math.max(
//                 key.length,
//                 ...data.map((row) => (row[key] ? row[key].toString().length : 0))
//             );
//             return { wch: maxContentLength + 2 }; // เพิ่ม buffer 2 ตัวอักษร
//         });
//         worksheet["!cols"] = columnWidths;

//         // สร้าง workbook
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

//         // สร้าง Excel ใน memory
//         const excelBuffer = XLSX.write(workbook, {
//             bookType: "xlsx",
//             type: "buffer"
//         });

//         // ตั้งค่า header สำหรับการดาวน์โหลดไฟล์
//         res.setHeader("Content-Disposition", "attachment; filename=ItemLists.xlsx");
//         res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        
//         // ส่งไฟล์
//         res.send(excelBuffer);

//     } catch (error) {
//         console.error("Error generating Excel:", error);
//         res.status(500).json({ 
//             error: "Failed to generate Excel file",
//             details: error.message 
//         });
//     }
// }

// router.post("/", (req, res) => {
//     try {
//         // ตรวจสอบข้อมูลที่ได้รับ
//         if (!req.body.data || !Array.isArray(req.body.data)) {
//             return res.status(400).json({ 
//                 error: "Invalid data format",
//                 message: "Please provide an array of data objects" 
//             });
//         }

//         // ตรวจสอบว่าแต่ละแถวมีข้อมูล
//         if (req.body.data.some(item => typeof item !== 'object' || item === null)) {
//             return res.status(400).json({ 
//                 error: "Invalid data content",
//                 message: "All items in data array must be objects" 
//             });
//         }

//         // สร้างและส่งไฟล์ Excel
//         ExportExcel(req.body.data, res);

//     } catch (error) {
//         console.error("Route handler error:", error);
//         res.status(500).json({ 
//             error: "Server error",
//             details: error.message 
//         });
//     }
// });

// module.exports = router;