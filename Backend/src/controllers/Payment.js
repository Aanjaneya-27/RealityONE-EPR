const db = require("../config/database");

exports.getPayments = async (req, res) => {
    try {
        const [payments] = await db.execute("SELECT * FROM payments ORDER BY id DESC");
        res.status(200).json({ success: true, data: payments });
    } catch (error) {
        console.error("Payment Fetch Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch payments" });
    }
};

exports.addPayment = async (req, res) => {
    try {
        const { payment_id, customer_name, project, unit_id, amount, date, method, status } = req.body;
        
        await db.execute(
            `INSERT INTO payments (payment_id, customer_name, project, unit_id, amount, date, method, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [payment_id, customer_name, project, unit_id, amount, date, method, status]
        );
        
        res.status(201).json({ success: true, message: "Payment Recorded Successfully!" });
    } catch (error) {
        console.error("Add Payment Error:", error);
        res.status(500).json({ success: false, message: "Failed to record payment" });
    }
};

exports.updatePaymentStatus = async (req, res) => {
    try {
        const { payment_id } = req.params;
        const { status } = req.body;
        
        await db.execute("UPDATE payments SET status=? WHERE payment_id=?", [status, payment_id]);
        res.status(200).json({ success: true, message: "Payment Status Updated!" });
    } catch (error) {
        console.error("Update Status Error:", error);
        res.status(500).json({ success: false, message: "Failed to update status" });
    }
};