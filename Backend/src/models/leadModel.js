const db = require("../config/database"); 

class Lead {
    static async createLead(name, email, phone, status, project_interest) {
        const query = `INSERT INTO leads (name, email, phone, status, project_interest) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.execute(query, [name, email, phone, status, project_interest]);
        return result;
    }

    static async getAllLeads() {
        const query = `SELECT * FROM leads ORDER BY id DESC`;
        const [rows] = await db.execute(query);
        return rows;
    }

    static async updateLeadById(id, name, email, phone, status, propertyType, budget, tag, source, desc) {
        const query = `
            UPDATE leads 
            SET name = ?, 
                email = ?, 
                phone = ?, 
                status = ?, 
                project_interest = ?, 
                budget = ?, 
                tag = ?, 
                source = ?, 
                description = ?
            WHERE id = ?
        `;
        
        const values = [name, email, phone, status, propertyType, budget, tag, source, desc, id];
        const [result] = await db.execute(query, values);
        return result;
    }
}

module.exports = Lead;