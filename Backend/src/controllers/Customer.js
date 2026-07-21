const db = require("../config/database");

exports.createCustomer = async (req, res) => {
    try {
        const { customer_id, name, email, phone, avatar, project, units, collectionValue, status } = req.body;

        await db.execute(
            `INSERT INTO customers 
            (customer_id, name, email, phone, avatar, project, units, collectionValue, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [customer_id, name, email, phone, avatar, project, units, collectionValue, status]
        );

        res.status(201).json({ success: true, message: "Customer Added Successfully!" });
    } catch (error) {
        console.error("Add Customer Error:", error);
        res.status(500).json({ success: false, message: "Failed to add customer" });
    }
};

exports.getCustomers = async (req, res) => {
    try {
        const [customers] = await db.execute("SELECT * FROM customers ORDER BY created_at DESC");
        res.status(200).json({ success: true, data: customers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch customers" });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const { customer_id, name, email, phone, avatar, project, units, collectionValue, status } = req.body;

        await db.execute(
            `UPDATE customers 
            SET name=?, email=?, phone=?, avatar=?, project=?, units=?, collectionValue=?, status=? 
            WHERE customer_id=?`,
            [name, email, phone, avatar, project, units, collectionValue, status, customer_id]
        );

        res.status(200).json({ success: true, message: "Customer Updated Successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update customer" });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const { customer_id } = req.params;
        await db.execute("DELETE FROM customers WHERE customer_id=?", [customer_id]);
        res.status(200).json({ success: true, message: "Customer Deleted!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete customer" });
    }
};