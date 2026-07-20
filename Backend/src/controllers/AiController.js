exports.getAIResponse = async (req, res) => {
    try {
        const { query } = req.body;
        const q = query.toLowerCase();
        let answer = "I am processing your data...";
        if (q.includes("highest intent score")) {
            answer = "📊 Marcus Thorne has the highest intent score today (92/100). He has opened your last 3 emails and visited the 'Luxury Villa' page twice this morning.";
        } else if (q.includes("marcus thorne's recent activity")) {
            answer = "👤 Marcus Thorne Activity:\n- Added to pipeline: 2 days ago.\n- Budget: $2.5M\n- Last contact: Yesterday phone call (Positive).\n- Next Step: Site visit scheduled for Friday.";
        } else if (q.includes("properties over $2m")) {
            answer = "💰 You currently have 4 hot leads looking for properties over $2M. Top matches: Marcus Thorne, Sophia Chen, and The Nexus Group.";
        }
        else if (q.includes("3bhk units under $1.5m")) {
            answer = "🏢 There are currently 14 available 3BHK units under $1.5M. The highest concentration is in the 'Emerald Heights' project (Tower B).";
        } else if (q.includes("highest inquiry rate")) {
            answer = "🔥 The 'Skyview Penthouse' currently has the highest inquiry rate. We received 12 new inquiries for it just this week.";
        } else if (q.includes("pending maintenance")) {
            answer = "🛠️ Yes, 2 units are currently pending maintenance:\n- Unit A-12 (Plumbing check)\n- Unit C-45 (Deep cleaning)\nExpected completion: Tomorrow.";
        }
        else if (q.includes("contacted in 30 days")) {
            answer = "⚠️ You have 5 High-Net-Worth clients who haven't been contacted in 30 days. I have prepared draft reminder emails in your outbox for them.";
        } else if (q.includes("feedback from last week's site visits")) {
            answer = "📝 Site Visit Feedback:\n- 70% positive response on Emerald Heights.\n- Main concern: Parking space availability.\n- 2 clients requested a second visit.";
        } else if (q.includes("purchase history of nexus group")) {
            answer = "🏢 Nexus Group History:\n- Total Purchases: $12.4M\n- Units owned: 3 Commercial spaces, 1 Luxury Penthouse.\n- Status: VIP Client.";
        }
        else if (q.includes("unconfirmed bookings")) {
            answer = "⏳ There are 3 unconfirmed bookings from this week. Total pending downpayment is $150,000. Would you like me to send automated payment reminders?";
        } else if (q.includes("awaiting kyc approval")) {
            answer = "📄 2 bookings are currently awaiting KYC approval:\n1. Unit B-22 (Sarah Jenkins) - Missing ID proof.\n2. Unit A-12 (Marcus Thorne) - Under review.";
        } else if (q.includes("total booking amount for july")) {
            answer = "💵 The total booking amount collected for July is $1.2M across 8 confirmed units. This is 15% higher than our target!";
        }
        else if (q.includes("daily agenda")) {
            answer = "📅 Today's Agenda:\n- 10:00 AM: Sales Team Meeting\n- 02:00 PM: Site visit with Marcus Thorne\n- 04:30 PM: Review KYC documents.";
        } else if (q.includes("high-priority tasks")) {
            answer = "🚨 You have 2 high-priority tasks pending:\n1. Prepare contracts for Nexus Group.\n2. Follow up with Sophia Chen regarding the downpayment.";
        } else if (q.includes("revenue projection")) {
            answer = "📈 Today's Revenue Projection:\nExpected Q3 total is $5.4M. If all pending deals close this week, we will hit 110% of our quarterly target.";
        } 
     
        else {
            answer = "I've checked the ERP records. Everything is running smoothly. Is there any specific project or lead you want me to analyze?";
        }
        setTimeout(() => {
            res.status(200).json({ answer });
        }, 1000);

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ success: false, message: "My neural network is disconnected right now." });
    }
};