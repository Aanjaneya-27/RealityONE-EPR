const db = require("../config/database");

class Lead {
    static async createLead(name, email, phone, status, project_interest) {
        const [result] = await db.execute(
            "INSERT INTO leads (name, email, phone, status, project_interest) VALUES (?, ?, ?, ?, ?)",
            [name, email, phone, status || 'New Lead', project_interest]
        );
        return result;
    }

    static async getAllLeads() {
        const [rows] = await db.execute("SELECT * FROM leads ORDER BY created_at DESC");
        return rows;
    }
}

module.exports = Lead;