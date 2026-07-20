import { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Palette,
  Building2,
  CreditCard,
  Check,
  Camera,
  Mail,
  Phone,
  Globe,
  Moon,
  Sun,
  Monitor,
  Eye,
  EyeOff,
  AlertTriangle,
  ChevronRight,
  LogOut,
} from "lucide-react";

const TABS = [
  { key: "profile", label: "Profile", icon: User },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security", label: "Security", icon: Shield },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "company", label: "Company", icon: Building2 },
  { key: "billing", label: "Billing", icon: CreditCard },
];

function Card({ title, subtitle, children }) {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-[#c4c6d3]/40 rounded-xl shadow-sm p-6">
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h3 className="font-semibold text-[15px] text-[#1a1b21] leading-tight">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-[12.5px] text-[#444651]/70 mt-1">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

function Field({ label, children, span = "col-span-1" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${span}`}>
      <label className="text-[12.5px] font-semibold text-[#444651] tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClasses =
  "w-full px-3.5 py-2.5 rounded-lg border border-[#c4c6d3]/60 bg-white text-[14px] text-[#1a1b21] placeholder:text-[#444651]/40 focus:outline-none focus:ring-2 focus:ring-[#012c7e]/30 focus:border-[#012c7e] transition-all";

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full flex-shrink-0 relative transition-colors duration-200 ${
        checked ? "bg-[#012c7e]" : "bg-[#c4c6d3]"
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 border-b border-[#c4c6d3]/30 last:border-0">
      <div>
        <p className="text-[13.5px] font-medium text-[#1a1b21]">{label}</p>
        {description && (
          <p className="text-[12px] text-[#444651]/60 mt-0.5">{description}</p>
        )}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState("light");

  const [profile, setProfile] = useState({
    name: "Aria Kapoor",
    email: "aria.kapoor@realtyone.com",
    phone: "+91 98765 43210",
    role: "Senior Sales Manager",
  });

  const [notifs, setNotifs] = useState({
    newLead: true,
    dealUpdates: true,
    weeklyDigest: false,
    siteVisitReminders: true,
    marketingEmails: false,
    smsAlerts: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen w-full bg-[#F6F8FB] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');
        .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 font-body">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-[24px] sm:text-[26px] font-bold text-[#1a1b21] leading-tight">
              Settings
            </h1>
            <p className="text-[13px] sm:text-[13.5px] text-[#444651]/70 mt-1">
              Manage your account, preferences and workspace.
            </p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#012c7e] text-white text-[13.5px] font-semibold shadow-sm hover:bg-[#012c7e]/90 active:scale-[0.98] transition-all w-full sm:w-auto"
          >
            <Check size={16} strokeWidth={2.5} />
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tabs - horizontal scroll on mobile, vertical list on desktop */}
          <div className="lg:w-56 flex-shrink-0">
            <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
              {TABS.map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-[13.5px] font-medium whitespace-nowrap flex-shrink-0 lg:flex-shrink transition-all ${
                      active
                        ? "bg-[#012c7e] text-white shadow-sm"
                        : "text-[#444651] hover:bg-white bg-white/50"
                    }`}
                  >
                    <Icon size={16} strokeWidth={2} />
                    {t.label}
                    {active && (
                      <ChevronRight size={14} className="ml-auto hidden lg:block" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {activeTab === "profile" && (
              <>
                <Card title="Profile Photo" subtitle="This appears across the workspace">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-[#1E2A3A] text-white text-[18px] font-bold flex items-center justify-center">
                        AK
                      </div>
                      <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#012c7e] text-white flex items-center justify-center border-2 border-white">
                        <Camera size={11} />
                      </button>
                    </div>
                    <div>
                      <button className="px-4 py-2 rounded-lg border border-[#c4c6d3]/70 text-[#444651] text-[13px] font-semibold hover:bg-[#F6F8FB] transition-colors mr-2">
                        Upload new
                      </button>
                      <span className="text-[12px] text-[#444651]/50">
                        JPG or PNG, max 2MB
                      </span>
                    </div>
                  </div>
                </Card>

                <Card title="Personal Information">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Full Name">
                      <input
                        className={inputClasses}
                        value={profile.name}
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Role / Designation">
                      <input
                        className={inputClasses}
                        value={profile.role}
                        onChange={(e) =>
                          setProfile({ ...profile, role: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Email Address">
                      <div className="relative">
                        <Mail
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444651]/40"
                        />
                        <input
                          className={`${inputClasses} pl-9`}
                          value={profile.email}
                          onChange={(e) =>
                            setProfile({ ...profile, email: e.target.value })
                          }
                        />
                      </div>
                    </Field>
                    <Field label="Phone Number">
                      <div className="relative">
                        <Phone
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444651]/40"
                        />
                        <input
                          className={`${inputClasses} pl-9`}
                          value={profile.phone}
                          onChange={(e) =>
                            setProfile({ ...profile, phone: e.target.value })
                          }
                        />
                      </div>
                    </Field>
                  </div>
                </Card>
              </>
            )}

            {activeTab === "notifications" && (
              <Card
                title="Notification Preferences"
                subtitle="Choose what you want to be notified about"
              >
                <ToggleRow
                  label="New Lead Assigned"
                  description="Get notified when a new lead is routed to you"
                  checked={notifs.newLead}
                  onChange={(v) => setNotifs({ ...notifs, newLead: v })}
                />
                <ToggleRow
                  label="Deal Stage Updates"
                  description="When a deal moves stages in the pipeline"
                  checked={notifs.dealUpdates}
                  onChange={(v) => setNotifs({ ...notifs, dealUpdates: v })}
                />
                <ToggleRow
                  label="Site Visit Reminders"
                  description="Reminders 1 hour before a scheduled visit"
                  checked={notifs.siteVisitReminders}
                  onChange={(v) =>
                    setNotifs({ ...notifs, siteVisitReminders: v })
                  }
                />
                <ToggleRow
                  label="Weekly Digest"
                  description="A summary email every Monday morning"
                  checked={notifs.weeklyDigest}
                  onChange={(v) => setNotifs({ ...notifs, weeklyDigest: v })}
                />
                <ToggleRow
                  label="SMS Alerts"
                  description="Urgent updates sent to your phone"
                  checked={notifs.smsAlerts}
                  onChange={(v) => setNotifs({ ...notifs, smsAlerts: v })}
                />
                <ToggleRow
                  label="Marketing Emails"
                  description="Product news and tips from RealtyOne"
                  checked={notifs.marketingEmails}
                  onChange={(v) =>
                    setNotifs({ ...notifs, marketingEmails: v })
                  }
                />
              </Card>
            )}

            {activeTab === "security" && (
              <>
                <Card title="Change Password">
                  <div className="grid grid-cols-1 gap-5 max-w-md">
                    <Field label="Current Password">
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className={`${inputClasses} pr-10`}
                          placeholder="••••••••"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444651]/40"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </Field>
                    <Field label="New Password">
                      <input
                        type="password"
                        className={inputClasses}
                        placeholder="••••••••"
                      />
                    </Field>
                    <Field label="Confirm New Password">
                      <input
                        type="password"
                        className={inputClasses}
                        placeholder="••••••••"
                      />
                    </Field>
                    <button className="self-start px-5 py-2.5 rounded-lg bg-[#012c7e] text-white text-[13.5px] font-semibold hover:bg-[#012c7e]/90 transition-colors">
                      Update Password
                    </button>
                  </div>
                </Card>

                <Card
                  title="Two-Factor Authentication"
                  subtitle="Add an extra layer of security to your account"
                >
                  <ToggleRow
                    label="Enable 2FA"
                    description="Require an authentication code at login"
                    checked={false}
                    onChange={() => {}}
                  />
                </Card>

                <Card title="Active Sessions">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <Monitor size={18} className="text-[#444651]/50" />
                      <div>
                        <p className="text-[13.5px] font-medium text-[#1a1b21]">
                          Chrome on Windows — Bhubaneswar, IN
                        </p>
                        <p className="text-[12px] text-[#444651]/50">
                          Current session
                        </p>
                      </div>
                    </div>
                    <span className="text-[11.5px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                </Card>
              </>
            )}

            {activeTab === "appearance" && (
              <Card title="Theme" subtitle="Customize how RealtyOne ERP looks for you">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { key: "light", label: "Light", icon: Sun },
                    { key: "dark", label: "Dark", icon: Moon },
                    { key: "system", label: "System", icon: Monitor },
                  ].map((opt) => {
                    const Icon = opt.icon;
                    const active = theme === opt.key;
                    return (
                      <button
                        key={opt.key}
                        onClick={() => setTheme(opt.key)}
                        className={`flex flex-col items-center gap-2 py-5 rounded-lg border-2 transition-all ${
                          active
                            ? "border-[#012c7e] bg-[#012c7e]/5"
                            : "border-[#c4c6d3]/50 hover:bg-[#F6F8FB]"
                        }`}
                      >
                        <Icon
                          size={20}
                          className={active ? "text-[#012c7e]" : "text-[#444651]/60"}
                        />
                        <span
                          className={`text-[13px] font-semibold ${
                            active ? "text-[#012c7e]" : "text-[#444651]"
                          }`}
                        >
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6">
                  <Field label="Language">
                    <div className="relative max-w-xs">
                      <Globe
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444651]/40"
                      />
                      <select className={`${inputClasses} pl-9 appearance-none`}>
                        <option>English</option>
                        <option>हिन्दी (Hindi)</option>
                        <option>ਪੰਜਾਬੀ (Punjabi)</option>
                        <option>বাংলা (Bengali)</option>
                      </select>
                    </div>
                  </Field>
                </div>
              </Card>
            )}

            {activeTab === "company" && (
              <>
                <Card title="Company Details">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Company Name">
                      <input
                        className={inputClasses}
                        defaultValue="RealtyOne Properties Pvt. Ltd."
                      />
                    </Field>
                    <Field label="GSTIN">
                      <input className={inputClasses} placeholder="22AAAAA0000A1Z5" />
                    </Field>
                    <Field label="Registered Address" span="sm:col-span-2">
                      <input
                        className={inputClasses}
                        placeholder="123 Business Park, Bhubaneswar, Odisha"
                      />
                    </Field>
                  </div>
                </Card>
                <Card title="Team Members" subtitle="Manage who has access to this workspace">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1E2A3A] text-white text-[11px] font-bold flex items-center justify-center">
                        AK
                      </div>
                      <div>
                        <p className="text-[13.5px] font-medium text-[#1a1b21]">
                          Aria Kapoor
                        </p>
                        <p className="text-[12px] text-[#444651]/50">Admin</p>
                      </div>
                    </div>
                    <button className="text-[12.5px] font-semibold text-[#012c7e]">
                      Manage
                    </button>
                  </div>
                </Card>
              </>
            )}

            {activeTab === "billing" && (
              <>
                <Card title="Current Plan">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="font-display font-bold text-[18px] text-[#1a1b21]">
                        Business Plan
                      </p>
                      <p className="text-[13px] text-[#444651]/70 mt-1">
                        ₹4,999/month · Renews on Aug 10, 2026
                      </p>
                    </div>
                    <button className="px-5 py-2.5 rounded-lg border border-[#c4c6d3]/70 text-[#444651] text-[13.5px] font-semibold hover:bg-[#F6F8FB] transition-colors">
                      Upgrade Plan
                    </button>
                  </div>
                </Card>
                <Card title="Payment Method">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard size={20} className="text-[#444651]/50" />
                      <p className="text-[13.5px] font-medium text-[#1a1b21]">
                        Visa ending in 4242
                      </p>
                    </div>
                    <button className="text-[12.5px] font-semibold text-[#012c7e]">
                      Change
                    </button>
                  </div>
                </Card>
              </>
            )}

            {/* Danger zone always visible at bottom of profile/security for convenience */}
            {(activeTab === "profile" || activeTab === "security") && (
              <Card>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#ba1a1a]/10 text-[#ba1a1a] flex items-center justify-center flex-shrink-0">
                      <AlertTriangle size={18} />
                    </div>
                    <div>
                      <p className="text-[13.5px] font-semibold text-[#1a1b21]">
                        Sign out of all devices
                      </p>
                      <p className="text-[12px] text-[#444651]/60">
                        This will log you out everywhere except here
                      </p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#ba1a1a]/40 text-[#ba1a1a] text-[13px] font-semibold hover:bg-[#ba1a1a]/5 transition-colors">
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}