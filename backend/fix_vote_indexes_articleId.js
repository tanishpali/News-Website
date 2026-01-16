const mongoose = require("mongoose");
require("dotenv").config();

const fixIndexesVote = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/news-website");
        console.log("Connected to DB");

        const collection = mongoose.connection.collection("votes");

        // List existing indexes
        try {
            const indexes = await collection.indexes();
            console.log("Existing Indexes:", indexes);
        } catch (err) {
            console.log("Could not list indexes (maybe collection doesn't exist):", err.message);
        }

        // Drop all indexes except _id
        try {
            await collection.dropIndexes();
            console.log("Dropped all indexes successfully found in 'votes' collection.");
        } catch (e) {
            console.log("Error dropping indexes (maybe none existed or collection missing):", e.message);
        }

        console.log("Indexes will be rebuilt by Mongoose on next application request/start.");
        process.exit(0);
    } catch (error) {
        console.error("Error fixing indexes:", error);
        process.exit(1);
    }
};

fixIndexesVote();
