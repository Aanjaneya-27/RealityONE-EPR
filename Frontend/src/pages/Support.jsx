import { useState } from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  ChevronDown,
  Send,
  Check,
  X,
} from "lucide-react";

const FAQS = [
  {
    q: "How do I add a new lead to the CRM?",
    a: "Go to CRM → Leads → New Lead, fill in the details, and save. It shows up in the pipeline right away.",
  },
  {
    q: "Why am I not getting site visit reminders?",
    a: "Check Settings → Notifications and make sure 'Site Visit Reminders' is turned on.",
  },
  {
    q: "Can I change the currency shown on the dashboard?",
    a: "Yes, under Settings → Company. This updates reports and deal values across the whole workspace.",
  },
  {
    q: "How many team members can I add?",
    a: "The Business Plan supports up to 25 seats. You can check usage under Settings → Billing.",
  },
];

const inputClasses =
  "w-full px-3.5 py-2.5 rounded-lg border border-[#c4c6d3]/60 bg-white text-[14px] text-[#1a1b21] placeholder:text-[#444651]/40 focus:outline-none focus:ring-2 focus:ring-[#012c7e]/30 focus:border-[#012c7e] transition-all";

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white/80 backdrop-blur-md border border-[#c4c6d3]/40 rounded-xl shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [form, setForm] = useState({ subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const update = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    if (errors[key]) setErrors({ ...errors, [key]: null });
  };

  const handleSubmit = () => {
    const next = {};
    if (!form.subject.trim()) next.subject = "Please add a subject";
    if (!form.message.trim()) next.message = "Please describe your issue";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSent(true);
      setForm({ subject: "", message: "" });
      setTimeout(() => setSent(false), 3000);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F6F8FB] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');
        .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 font-body">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-[26px] font-bold text-[#1a1b21] leading-tight">
            Support
          </h1>
          <p className="text-[13.5px] text-[#444651]/70 mt-1">
            Need help? Browse common questions or send us a message.
          </p>
        </div>

        {/* Contact options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="flex flex-col items-start gap-2">
            <Mail size={20} className="text-[#012c7e]" />
            <p className="text-[12.5px] font-semibold text-[#444651]">Email</p>
            <p className="text-[13.5px] text-[#1a1b21] font-medium">
              support@realtyone.com
            </p>
          </Card>
          <Card className="flex flex-col items-start gap-2">
            <Phone size={20} className="text-[#012c7e]" />
            <p className="text-[12.5px] font-semibold text-[#444651]">Phone</p>
            <p className="text-[13.5px] text-[#1a1b21] font-medium">
              +91 674 000 1122
            </p>
          </Card>
          <Card className="flex flex-col items-start gap-2">
            <MessageCircle size={20} className="text-[#012c7e]" />
            <p className="text-[12.5px] font-semibold text-[#444651]">Live Chat</p>
            <p className="text-[13.5px] text-[#1a1b21] font-medium">
              Mon–Sat, 9am–7pm
            </p>
          </Card>
        </div>

        {/* FAQ */}
        <Card className="mb-8">
          <h3 className="font-semibold text-[15px] text-[#1a1b21] mb-4">
            Frequently Asked Questions
          </h3>
          <div>
            {FAQS.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={f.q} className="border-b border-[#c4c6d3]/30 last:border-0">
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between gap-4 py-3.5 text-left"
                  >
                    <span className="text-[13.5px] font-medium text-[#1a1b21]">
                      {f.q}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-[#444651]/50 flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="text-[13px] text-[#444651]/80 leading-relaxed pb-4">
                      {f.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Contact form */}
        <Card>
          <h3 className="font-semibold text-[15px] text-[#1a1b21] mb-1">
            Send us a message
          </h3>
          <p className="text-[12.5px] text-[#444651]/70 mb-5">
            We usually reply within 4 business hours.
          </p>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[12.5px] font-semibold text-[#444651] block mb-1.5">
                Subject
              </label>
              <input
                className={inputClasses}
                placeholder="What do you need help with?"
                value={form.subject}
                onChange={update("subject")}
              />
              {errors.subject && (
                <p className="text-[11.5px] text-[#ba1a1a] mt-1">{errors.subject}</p>
              )}
            </div>
            <div>
              <label className="text-[12.5px] font-semibold text-[#444651] block mb-1.5">
                Message
              </label>
              <textarea
                rows={4}
                className={`${inputClasses} resize-none`}
                placeholder="Describe the issue..."
                value={form.message}
                onChange={update("message")}
              />
              {errors.message && (
                <p className="text-[11.5px] text-[#ba1a1a] mt-1">{errors.message}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSubmit}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-[13.5px] font-semibold hover:bg-blue-700 transition-colors"
              >
                {sent ? <Check size={16} /> : <Send size={15} />}
                {sent ? "Message Sent" : "Send Message"}
              </button>
              <button
                onClick={() => {
                  setForm({ subject: "", message: "" });
                  setErrors({});
                }}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 text-white text-[13.5px] font-semibold hover:bg-red-700 transition-colors"
              >
                <X size={15} />
                Cancel
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}