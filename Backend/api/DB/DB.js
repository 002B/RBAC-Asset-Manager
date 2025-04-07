const mongoose = require('mongoose');

const connectionString = `mongodb+srv://kittiposmek:LndCpxVUjFvxIYjK@fireextinguisher-db.wepn9uj.mongodb.net/FEMS-New?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;