const db = require('../config/database');

const User = {findByEmail: async(email) => {
    const [rows] = await db.query(`SELECT users.*, roles.name AS role_name FROM users JOIN roles ON users.role_id = roles.id WHERE users.email = ?`, [email]);
        return rows[0]},

        createUser: async(name, email, password, role_id) => {
            const [result] = await db.query(`INSERT INTO users (name, email, password, role_id) VALUES (?,?,?,?)`,[name, email, password, role_id]);
            return result.insertId;
        },
        getRoleByName: async(role_name) => {
            const [rows] = await db.query(`SELECT * FROM roles WHERE name = ?`, [role_name]);
            return rows[0] ? rows[0].id : null;
        },
        getPermissions: async(userId) => {
         const [rows] = await db.query(
            `SELECT m.name AS module_name, p.can_view, p.can_create, p.can_edit, p.can_delete 
             FROM user_permissions p 
             JOIN modules m ON p.module_id = m.id 
             WHERE p.user_id = ?`, 
            [userId]
        );
        return rows;
    }
}

module.exports = User;