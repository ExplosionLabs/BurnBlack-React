const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const url = process.env.MONGO_URL;
    if (!url) {
      throw new Error('MONGO_URL is not defined in environment variables');
    }

    const conn = await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Specify the correct write concern here
      writeConcern: {
        w: "majority",
        wtimeout: 1000,
        j: true,
      },
    });

    console.log(`Database connected successfully at ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Exit process with failure
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during MongoDB disconnection:', err);
    process.exit(1);
  }
});

module.exports = connectDB;
