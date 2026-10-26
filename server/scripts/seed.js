const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

const UserModel = require("../api/DB/users");
const CompanyModel = require("../api/DB/client");
const ItemModel = require("../api/DB/item");
const ReportModel = require("../api/DB/report");
const ItemLogModel = require("../api/DB/logItem");
const ActivityLogModel = require("../api/DB/activityLogModal");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in server/.env");
  process.exit(1);
}

async function seedData() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log(" Connected to MongoDB Atlas!");

    // Clear existing demo data
    console.log("Clearing existing collections...");
    await Promise.all([
      UserModel.deleteMany({}),
      CompanyModel.deleteMany({}),
      ItemModel.deleteMany({}),
      ReportModel.deleteMany({}),
      ItemLogModel.deleteMany({}),
      ActivityLogModel.deleteMany({}),
    ]);
    console.log(" Collections cleared.");

    // 1. Seed Companies & Branches
    console.log("Seeding Companies & Branches...");
    const companies = [
      {
        client_id: "CP-ALL",
        client_branch_id: "HQ",
        location: {
          province: "Bangkok",
          district: "Bang Rak",
          street: "Silom Rd",
          alley: "CP Tower",
          building_number: "313",
          postal_code: "10500",
          latitude: 13.7278,
          longitude: 100.5280,
        },
        next_check: "25/11/2026",
        last_check: ["15/10/2026", "15/09/2026"],
      },
      {
        client_id: "CP-ALL",
        client_branch_id: "Silom",
        location: {
          province: "Bangkok",
          district: "Bang Rak",
          street: "Silom Rd",
          alley: "Silom Soi 3",
          building_number: "52",
          postal_code: "10500",
          latitude: 13.7290,
          longitude: 100.5310,
        },
        next_check: "18/11/2026",
        last_check: ["20/10/2026", "20/09/2026"],
      },
      {
        client_id: "CP-ALL",
        client_branch_id: "Siam",
        location: {
          province: "Bangkok",
          district: "Pathum Wan",
          street: "Rama I Rd",
          alley: "Siam Square One",
          building_number: "388",
          postal_code: "10330",
          latitude: 13.7462,
          longitude: 100.5347,
        },
        next_check: "30/11/2026",
        last_check: ["01/10/2026"],
      },
      {
        client_id: "CP-ALL",
        client_branch_id: "Asok",
        location: {
          province: "Bangkok",
          district: "Watthana",
          street: "Sukhumvit 21",
          alley: "Asok Montri",
          building_number: "115",
          postal_code: "10110",
          latitude: 13.7372,
          longitude: 100.5605,
        },
        next_check: "05/12/2026",
        last_check: ["10/10/2026"],
      },
      {
        client_id: "PTT-Station",
        client_branch_id: "Vibhavadi-HQ",
        location: {
          province: "Bangkok",
          district: "Chatuchak",
          street: "Vibhavadi Rangsit Rd",
          alley: "Building A",
          building_number: "555",
          postal_code: "10900",
          latitude: 13.8205,
          longitude: 100.5592,
        },
        next_check: "12/12/2026",
        last_check: ["12/10/2026"],
      },
      {
        client_id: "PTT-Station",
        client_branch_id: "Bangna",
        location: {
          province: "Bangkok",
          district: "Bang Na",
          street: "Bang Na-Trat Rd",
          alley: "KM 4",
          building_number: "201",
          postal_code: "10260",
          latitude: 13.6680,
          longitude: 100.6280,
        },
        next_check: "22/11/2026",
        last_check: ["22/10/2026"],
      },
      {
        client_id: "SCG",
        client_branch_id: "Bangsue-HQ",
        location: {
          province: "Bangkok",
          district: "Bang Sue",
          street: "Siam Cement Rd",
          alley: "Building 1",
          building_number: "1",
          postal_code: "10800",
          latitude: 13.8050,
          longitude: 100.5370,
        },
        next_check: "15/12/2026",
        last_check: ["15/10/2026"],
      },
      {
        client_id: "Central-Group",
        client_branch_id: "CentralWorld",
        location: {
          province: "Bangkok",
          district: "Pathum Wan",
          street: "Ratchadamri Rd",
          alley: "Central World Mall",
          building_number: "999/9",
          postal_code: "10330",
          latitude: 13.7466,
          longitude: 100.5393,
        },
        next_check: "10/11/2026",
        last_check: ["10/10/2026"],
      },
    ];
    await CompanyModel.create(companies);
    console.log(` Inserted ${companies.length} company branches.`);

    // 2. Seed Users
    console.log("Seeding Users...");
    const defaultPassword = "password123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const users = [
      {
        username: "admin",
        password: hashedPassword,
        display_name: "Sarah Admin",
        role: "Admin",
        client: "System",
        client_access: ["All Branches"],
        isActive: "True",
        lastLogin: new Date(),
      },
      {
        username: "superadmin",
        password: hashedPassword,
        display_name: "Alexander SuperAdmin",
        role: "Super Admin",
        client: "System",
        client_access: ["All Branches"],
        isActive: "True",
        lastLogin: new Date(),
      },
      {
        username: "supermember_cp",
        password: hashedPassword,
        display_name: "Nattapong CP Manager",
        role: "Super Member",
        client: "CP-ALL",
        client_access: ["HQ", "Silom", "Siam", "Asok"],
        isActive: "True",
        lastLogin: new Date(),
      },
      {
        username: "member_silom",
        password: hashedPassword,
        display_name: "Somchai Silom Staff",
        role: "Member",
        client: "CP-ALL",
        client_access: ["Silom"],
        isActive: "True",
        lastLogin: new Date(),
      },
      {
        username: "member_siam",
        password: hashedPassword,
        display_name: "Ploy Siam Staff",
        role: "Member",
        client: "CP-ALL",
        client_access: ["Siam"],
        isActive: "True",
        lastLogin: new Date(),
      },
      {
        username: "worker_wichai",
        password: hashedPassword,
        display_name: "Wichai Inspector",
        role: "Worker",
        client: "System",
        client_access: ["All Branches"],
        isActive: "True",
        lastLogin: new Date(),
      },
      {
        username: "worker_somsak",
        password: hashedPassword,
        display_name: "Somsak Technician",
        role: "Worker",
        client: "System",
        client_access: ["All Branches"],
        isActive: "True",
        lastLogin: new Date(),
      },
    ];
    await UserModel.create(users);
    console.log(` Inserted ${users.length} users with password '${defaultPassword}'.`);

    // 3. Seed Items (Fire Extinguishers)
    console.log("Seeding Fire Extinguishers...");
    const year = new Date().getFullYear();
    const items = [
      {
        item_id: `TH-${year}-0000001`,
        client_id: "CP-ALL",
        client_branch_id: "Silom",
        item_brand: "SafetyPlus",
        item_capacity: "5kg",
        item_color: "red",
        item_type: "dry chemical",
        item_class: "ABC",
        item_location: "Floor 1 - Main Entrance",
        item_status: "available",
      },
      {
        item_id: `TH-${year}-0000002`,
        client_id: "CP-ALL",
        client_branch_id: "Silom",
        item_brand: "FireShield",
        item_capacity: "10lbs",
        item_color: "red",
        item_type: "co2",
        item_class: "BC",
        item_location: "Floor 2 - Server Room",
        item_status: "reporting",
      },
      {
        item_id: `TH-${year}-0000003`,
        client_id: "CP-ALL",
        client_branch_id: "Silom",
        item_brand: "SafetyPlus",
        item_capacity: "5kg",
        item_color: "red",
        item_type: "foam",
        item_class: "A",
        item_location: "Floor 1 - Cashier Counter",
        item_status: "fixing",
      },
      {
        item_id: `TH-${year}-0000004`,
        client_id: "CP-ALL",
        client_branch_id: "Silom",
        item_brand: "Yamato",
        item_capacity: "2.5kg",
        item_color: "red",
        item_type: "dry chemical",
        item_class: "ABC",
        item_location: "Basement - Storage Room",
        item_status: "available",
      },
      {
        item_id: `TH-${year}-0000005`,
        client_id: "CP-ALL",
        client_branch_id: "Silom",
        item_brand: "Badger",
        item_capacity: "15lbs",
        item_color: "silver",
        item_type: "water",
        item_class: "A",
        item_location: "Back Alley - Loading Dock",
        item_status: "bad",
      },
      {
        item_id: `TH-${year}-0000006`,
        client_id: "CP-ALL",
        client_branch_id: "Siam",
        item_brand: "SafetyPlus",
        item_capacity: "5kg",
        item_color: "red",
        item_type: "dry chemical",
        item_class: "ABC",
        item_location: "Floor 1 - Front Counter",
        item_status: "available",
      },
      {
        item_id: `TH-${year}-0000007`,
        client_id: "CP-ALL",
        client_branch_id: "Siam",
        item_brand: "FireShield",
        item_capacity: "10lbs",
        item_color: "red",
        item_type: "co2",
        item_class: "BC",
        item_location: "Floor 2 - Staff Break Room",
        item_status: "reporting",
      },
      {
        item_id: `TH-${year}-0000008`,
        client_id: "CP-ALL",
        client_branch_id: "Siam",
        item_brand: "Yamato",
        item_capacity: "5kg",
        item_color: "red",
        item_type: "dry chemical",
        item_class: "ABC",
        item_location: "Floor 2 - Emergency Exit",
        item_status: "available",
      },
      {
        item_id: `TH-${year}-0000009`,
        client_id: "CP-ALL",
        client_branch_id: "HQ",
        item_brand: "SafetyPlus",
        item_capacity: "10lbs",
        item_color: "red",
        item_type: "co2",
        item_class: "BC",
        item_location: "12th Floor - Board Room",
        item_status: "available",
      },
      {
        item_id: `TH-${year}-0000010`,
        client_id: "CP-ALL",
        client_branch_id: "HQ",
        item_brand: "SafetyPlus",
        item_capacity: "5kg",
        item_color: "red",
        item_type: "dry chemical",
        item_class: "ABC",
        item_location: "15th Floor - Data Center",
        item_status: "available",
      },
      {
        item_id: `TH-${year}-0000011`,
        client_id: "CP-ALL",
        client_branch_id: "Asok",
        item_brand: "Yamato",
        item_capacity: "5kg",
        item_color: "red",
        item_type: "dry chemical",
        item_class: "ABC",
        item_location: "G Floor - Retail Lobby",
        item_status: "available",
      },
      {
        item_id: `TH-${year}-0000012`,
        client_id: "PTT-Station",
        client_branch_id: "Vibhavadi-HQ",
        item_brand: "FireShield",
        item_capacity: "15lbs",
        item_color: "red",
        item_type: "dry chemical",
        item_class: "ABC",
        item_location: "Fuel Pump Island 1",
        item_status: "available",
      },
      {
        item_id: `TH-${year}-0000013`,
        client_id: "PTT-Station",
        client_branch_id: "Vibhavadi-HQ",
        item_brand: "FireShield",
        item_capacity: "15lbs",
        item_color: "red",
        item_type: "foam",
        item_class: "ABC",
        item_location: "Fuel Pump Island 4",
        item_status: "fixing",
      },
      {
        item_id: `TH-${year}-0000014`,
        client_id: "PTT-Station",
        client_branch_id: "Bangna",
        item_brand: "SafetyPlus",
        item_capacity: "10lbs",
        item_color: "red",
        item_type: "dry chemical",
        item_class: "ABC",
        item_location: "Convenience Store Entrance",
        item_status: "available",
      },
      {
        item_id: `TH-${year}-0000015`,
        client_id: "SCG",
        client_branch_id: "Bangsue-HQ",
        item_brand: "Badger",
        item_capacity: "10lbs",
        item_color: "red",
        item_type: "dry chemical",
        item_class: "ABC",
        item_location: "Building 1 - Hallway East",
        item_status: "available",
      },
      {
        item_id: `TH-${year}-0000016`,
        client_id: "Central-Group",
        client_branch_id: "CentralWorld",
        item_brand: "Yamato",
        item_capacity: "5kg",
        item_color: "red",
        item_type: "foam",
        item_class: "K",
        item_location: "Food Court - Zone A",
        item_status: "available",
      },
      {
        item_id: `TH-${year}-0000017`,
        client_id: "Central-Group",
        client_branch_id: "CentralWorld",
        item_brand: "Yamato",
        item_capacity: "5kg",
        item_color: "red",
        item_type: "dry chemical",
        item_class: "ABC",
        item_location: "Cinema Zone - Floor 7",
        item_status: "available",
      },
    ];
    await ItemModel.create(items);
    console.log(` Inserted ${items.length} fire extinguishers.`);

    // 4. Seed Reports
    console.log("Seeding Inspection & Problem Reports...");
    const reports = [
      {
        report_id: `RP-${year}-0000001`,
        item_id: `TH-${year}-0000002`,
        client_id: "CP-ALL",
        client_branch_id: "Silom",
        createAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending",
        send_by: "member_silom",
        send_to: "",
        problem: "Pressure gauge damaged or showing low pressure",
        image: null,
        note: "Observed needle in the red recharge zone during daily check",
      },
      {
        report_id: `RP-${year}-0000002`,
        item_id: `TH-${year}-0000007`,
        client_id: "CP-ALL",
        client_branch_id: "Siam",
        createAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending",
        send_by: "member_siam",
        send_to: "",
        problem: "Safety pin missing and tamper seal broken",
        image: null,
        note: "Requires new seal and safety pin replacement",
      },
      {
        report_id: `RP-${year}-0000003`,
        item_id: `TH-${year}-0000003`,
        client_id: "CP-ALL",
        client_branch_id: "Silom",
        createAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: "fixing",
        send_by: "member_silom",
        send_to: "worker_wichai",
        problem: "Nozzle clogged with debris and dust",
        image: null,
        note: "Assigned to Wichai for cleaning and nozzle inspection",
      },
      {
        report_id: `RP-${year}-0000004`,
        item_id: `TH-${year}-0000013`,
        client_id: "PTT-Station",
        client_branch_id: "Vibhavadi-HQ",
        createAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        status: "fixing",
        send_by: "guest",
        send_to: "worker_somsak",
        problem: "Fire extinguisher expired annual certification",
        image: null,
        note: "Under annual hydrostatic test and recertification",
      },
      {
        report_id: `RP-${year}-0000005`,
        item_id: `TH-${year}-0000005`,
        client_id: "CP-ALL",
        client_branch_id: "Silom",
        createAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "accepted",
        send_by: "member_silom",
        send_to: "",
        problem: "Tank swollen or rusted near base",
        image: null,
        note: "Marked as hazardous, scheduled for disposal replacement",
      },
      {
        report_id: `RP-${year}-0000006`,
        item_id: `TH-${year}-0000001`,
        client_id: "CP-ALL",
        client_branch_id: "Silom",
        createAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: "done",
        send_by: "member_silom",
        send_to: "worker_wichai",
        problem: "Mounting bracket damaged",
        image: null,
        note: "Installed heavy-duty replacement wall bracket. All secure.",
      },
      {
        report_id: `RP-${year}-0000007`,
        item_id: `TH-${year}-0000006`,
        client_id: "CP-ALL",
        client_branch_id: "Siam",
        createAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        status: "done",
        send_by: "member_siam",
        send_to: "worker_wichai",
        problem: "Hose torn or damaged",
        image: null,
        note: "Replaced discharge hose and pressure tested. Passed.",
      },
    ];
    await ReportModel.create(reports);
    console.log(` Inserted ${reports.length} reports across pending/fixing/done.`);

    // 5. Seed Item Logs
    console.log("Seeding Item Logs...");
    const itemLogs = [
      {
        log_id: `ITEMLOG-${year}-0000001`,
        item_id: `TH-${year}-0000001`,
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        activity: "create",
        username: "admin",
        role: "Admin",
      },
      {
        log_id: `ITEMLOG-${year}-0000002`,
        item_id: `TH-${year}-0000002`,
        date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        activity: "create",
        username: "admin",
        role: "Admin",
      },
      {
        log_id: `ITEMLOG-${year}-0000003`,
        item_id: `TH-${year}-0000002`,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        activity: "reporting",
        username: "member_silom",
        role: "Member",
      },
      {
        log_id: `ITEMLOG-${year}-0000004`,
        item_id: `TH-${year}-0000003`,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        activity: "reporting",
        username: "member_silom",
        role: "Member",
      },
      {
        log_id: `ITEMLOG-${year}-0000005`,
        item_id: `TH-${year}-0000003`,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        activity: "fixing",
        username: "worker_wichai",
        role: "Worker",
      },
      {
        log_id: `ITEMLOG-${year}-0000006`,
        item_id: `TH-${year}-0000001`,
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        activity: "done",
        username: "worker_wichai",
        role: "Worker",
      },
    ];
    await ItemLogModel.create(itemLogs);
    console.log(` Inserted ${itemLogs.length} item logs.`);

    // 6. Seed Activity Logs
    console.log("Seeding Activity Logs...");
    const activityLogs = [
      {
        log_id: `LOG-${year}-0000001`,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        activity: "Log in",
        username: "admin",
        role: "Admin",
        client: "System",
      },
      {
        log_id: `LOG-${year}-0000002`,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        activity: "Log in",
        username: "supermember_cp",
        role: "Super Member",
        client: "CP-ALL",
      },
      {
        log_id: `LOG-${year}-0000003`,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        activity: "reporting",
        username: "member_silom",
        role: "Member",
        client: "CP-ALL",
      },
      {
        log_id: `LOG-${year}-0000004`,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        activity: "Log in",
        username: "worker_wichai",
        role: "Worker",
        client: "System",
      },
      {
        log_id: `LOG-${year}-0000005`,
        date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        activity: "Log in",
        username: "member_siam",
        role: "Member",
        client: "CP-ALL",
      },
      {
        log_id: `LOG-${year}-0000006`,
        date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        activity: "Log out",
        username: "member_siam",
        role: "Member",
        client: "CP-ALL",
      },
    ];
    await ActivityLogModel.create(activityLogs);
    console.log(` Inserted ${activityLogs.length} activity logs.`);

    console.log("\n Database Seeding Complete!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
  }
}

seedData();

