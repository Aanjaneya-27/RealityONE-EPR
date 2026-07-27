const Lead = require("../models/leadModel");

exports.createLead = async (req, res) => {
    try {
        const { name, email, phone, status, project_interest } = req.body;
        if (!name || !phone) {
            return res.status(400).json({ success: false, message: "Name and Phone are required" });
        }

        await Lead.createLead(name, email, phone, status, project_interest);
        res.status(201).json({ success: true, message: "Lead saved successfully!" });
    } catch (error) {
        console.error("CREATE LEAD ERROR:", error);
        res.status(500).json({ success: false, message: "Failed to save lead" });
    }
};

exports.getLeads = async (req, res) => {
    try {
        const leads = await Lead.getAllLeads();
        res.status(200).json({ success: true, data: leads });
    } catch (error) {
        console.error("GET LEADS ERROR:", error);
        res.status(500).json({ success: false, message: "Failed to fetch leads" });
    }
};

exports.updateLead = async (req, res) => {
    try {
        const leadId = req.params.id;
        const cleanId = leadId.replace('DB-', '').replace('L-', ''); 
        const { name, email, phone, status, propertyType, budget, tag, source, desc } = req.body;
        await Lead.updateLeadById(cleanId, name, email, phone, status, propertyType, budget, tag, source, desc);
        
        res.status(200).json({ success: true, message: "Lead updated successfully in MySQL!" });
    } catch (error) {
        console.error("UPDATE LEAD ERROR:", error);
        res.status(500).json({ success: false, message: "Failed to update lead" });
    }
};