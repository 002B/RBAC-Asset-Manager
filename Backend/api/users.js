const userModel = require("./DB/users.js");
const bcrypt = require("bcryptjs");

async function getAllUsers(){
    try {
        const data = await userModel.find();
        return data;
    } catch (error) {
        console.log(error);
    }
}

async function getClientUser(client_id){
    try {
        const data = await userModel.find({ client: client_id });
        return data;
    } catch (error) {
        console.log(error);
    }
}

async function getOperatorUser(){
    try {
        const data = await userModel.find({
            role: { $in: ["Worker", "Admin", "Super Admin"] },
        });
        return data;
    } catch (error) {
        console.log(error);
    }
}

async function getWorkerUser(){
    try {
        const data = await userModel.find({
            role: "Worker",
        });
        return data;
    } catch (error) {
        console.log(error);
    }
}

async function getAllUsersCount(){
    try {
        const count = await userModel.countDocuments();
        return count;
    } catch (error) {
        console.log(error);
    }
}

async function getUsersCount(client_id){
    try {
        const count = await userModel.countDocuments({ client: client_id });
        return count;
    } catch (error) {
        console.log(error);
    }
}

async function getUser(username){
    try {
        const data = await userModel.findOne({ username });
        return data;
    } catch (error) {
        console.log(error);
    }
}

async function createUser(userData) {
    try {
        const { username, password, display_name, role } = userData;
        
        // Validate required fields (only truly required ones)
        if (!username || !password || !display_name || !role) {
            throw new Error('Missing required fields');
        }

        // Check if user exists
        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
            throw new Error('Username already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user object with defaults
        const newUser = {
            username,
            password: hashedPassword,
            display_name,
            role,
            client: userData.client || "",
            client_access: userData.client_access || [],
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLogin: null,
            isActive: userData.isActive || 'True'
        };

        // Save to database
        const createdUser = await userModel.create(newUser);
        
        // Remove password from response
        const userResponse = createdUser.toObject();
        delete userResponse.password;

        return userResponse;
    } catch (error) {
        console.error('Error in createUser:', error);
        throw error;
    }
}

async function login(username, password) {
    try {
        const user = await userModel.findOne({ username });
        if (!user) {
            return [404, { message: "User not found" }];
        }

        if (user.isActive !== 'True') {
            return [403, { message: "Account is inactive" }];
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return [401, { message: "Invalid credentials" }];
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT token
        const token = user.generateAuthToken();

        // Prepare response without password
        const userResponse = user.toObject();
        delete userResponse.password;

        return [200, { user: userResponse, token }];
    } catch (error) {
        console.error('Error in login:', error);
        return [500, { message: "Error logging in" }];
    }
}


async function updateUser(username, updateData) {  // Changed parameter name to updateData
    try {
        const updatedUser = await userModel.findOneAndUpdate(
            { username: username },
            updateData,  // Using the renamed parameter
            { new: true }
        );
        return updatedUser;
    } catch (error) {
        console.log(error);
        throw error;  // Make sure to re-throw the error so it can be caught in the route handler
    }
}

async function deleteUser(username){
    try {
        const data = await userModel.findOneAndDelete({ username: username });
        return data;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getAllUsers,
    getAllUsersCount,
    getOperatorUser,
    getClientUser,
    getUser,
    getUsersCount,
    createUser,
    login,
    updateUser,
    deleteUser,
    getWorkerUser
};

