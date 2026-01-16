const mongoose = require("mongoose");
require("dotenv").config();

const fixIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/news-website");
        console.log("Connected to DB");

        const collection = mongoose.connection.collection("bookmarks");

        // List existing indexes
        const indexes = await collection.indexes();
        console.log("Existing Indexes:", indexes);

        // Drop all indexes except _id
        await collection.dropIndexes();
        console.log("Dropped all indexes successfully!");

        console.log("Indexes will be rebuilt by Mongoose on next server start.");
        process.exit(0);
    } catch (error) {
        console.error("Error fixing indexes:", error);
        process.exit(1);
    }
};

fixIndexes();
