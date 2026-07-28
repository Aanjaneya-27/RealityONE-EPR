const db = require("../config/database"); 

exports.getInventory = async (req, res) => {
    try {
        const [units] = await db.execute("SELECT * FROM inventory ORDER BY unit_id ASC");
        res.status(200).json({ success: true, data: units });
    } catch (error) {
        console.error("Inventory Fetch Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch inventory" });
    }
};

exports.quickBookUnit = async (req, res) => {
    try {
        const { unit_id } = req.params;
        await db.execute("UPDATE inventory SET status='Booked' WHERE unit_id=?", [unit_id]);
        
        res.status(200).json({ success: true, message: "Unit Booked Successfully!" });
    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ success: false, message: "Failed to book unit" });
    }
};