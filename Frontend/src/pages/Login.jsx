import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 
import { AuthContext } from "../context/AuthContext"; 
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  LogIn,
  UserPlus,
  User,
} from "lucide-react";

const inputClasses =
  "w-full px-3.5 py-2.5 rounded-lg border bg-white text-[14px] text-[#1a1b21] placeholder:text-[#444651]/40 focus:outline-none focus:ring-2 transition-all";
const normalInput = `${inputClasses} border-[#c4c6d3]/60 focus:ring-[#012c7e]/30 focus:border-[#012c7e]`;
const errorInput = `${inputClasses} border-red-500/60 focus:ring-red-500/20 focus:border-red-500`;

function Brand({ subtitle }) {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="w-12 h-12 rounded-xl bg-[#012c7e] flex items-center justify-center mb-4">
        <Building2 size={22} className="text-white" strokeWidth={2} />
      </div>
      <h1 className="font-display text-[22px] font-bold text-[#1a1b21]">
        RealtyOne ERP
      </h1>
      <p className="text-[13px] text-[#444651]/70 mt-1">{subtitle}</p>
    </div>
  );
}

function LoginView({ onSwitch }) {
  const navigate = useNavigate(); 
  const { loginContext } = useContext(AuthContext); 
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(""); // ADDED: For Backend Errors
  const [loading, setLoading] = useState(false);

  const clearError = (key) => {
    if (errors[key]) setErrors({ ...errors, [key]: null });
    if (apiError) setApiError(""); // Clear API error on typing
  };

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = "Full name is required";
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Enter a valid email address";
    if (!password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    
    try {
      const response = await axios.post("https://realityone-epr.onrender.com/api/auth/login", {
        email: email,
        password: password,
      });

      if (response.data.success) {
        // Save to Context
        loginContext(response.data.user, response.data.token, response.data.permissions);
        navigate("/"); 
      }
    } catch (err) {
      setApiError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm font-body">
      <Brand subtitle="Sign in to your workspace" />

      <div className="bg-white/80 backdrop-blur-md border border-[#c4c6d3]/40 rounded-xl shadow-sm p-6 sm:p-7">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[12.5px] font-semibold text-[#444651] block mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444651]/40"
              />
              <input
                type="text"
                className={`${errors.name ? errorInput : normalInput} pl-9`}
                placeholder="e.g. Aria Kapoor"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  clearError("name");
                }}
              />
            </div>
            {errors.name && (
              <p className="text-[11.5px] text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="text-[12.5px] font-semibold text-[#444651] block mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444651]/40"
              />
              <input
                type="email"
                className={`${errors.email ? errorInput : normalInput} pl-9`}
                placeholder="name@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError("email");
                }}
              />
            </div>
            {errors.email && (
              <p className="text-[11.5px] text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[12.5px] font-semibold text-[#444651]">
                Password
              </label>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-[12px] font-semibold text-[#012c7e] hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444651]/40"
              />
              <input
                type={showPassword ? "text" : "password"}
                className={`${errors.password ? errorInput : normalInput} pl-9 pr-10`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError("password");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444651]/40"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11.5px] text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded border-[#c4c6d3] text-[#012c7e] focus:ring-[#012c7e]/30"
            />
            <span className="text-[12.5px] text-[#444651]">Remember me</span>
          </label>

          {/* ADDED: Backend API Error Message */}
          {apiError && (
            <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-[12px] text-red-600 font-semibold">{apiError}</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-lg bg-blue-600 text-white text-[13.5px] font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-60 mt-1"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <LogIn size={16} strokeWidth={2.5} />
            )}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </div>

      <p className="text-center text-[13px] text-[#444651]/70 mt-6">
        Don't have an account?{" "}
        <button
          onClick={onSwitch}
          className="font-semibold text-[#012c7e] hover:underline"
        >
          Create an account
        </button>
      </p>
    </div>
  );
}

function RegisterView({ onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(""); // ADDED
  const [loading, setLoading] = useState(false);

  const clearError = (key) => {
    if (errors[key]) setErrors({ ...errors, [key]: null });
    if (apiError) setApiError("");
  };

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = "Full name is required";
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Enter a valid email address";
    if (!password) next.password = "Password is required";
    else if (password.length < 8)
      next.password = "Must be at least 8 characters";
    if (!confirmPassword) next.confirmPassword = "Please confirm your password";
    else if (confirmPassword !== password)
      next.confirmPassword = "Passwords do not match";
    if (!agree) next.agree = "Please accept the terms to continue";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name: name,
        email: email,
        password: password,
      });

      if (response.data.success) {
        alert("Account Created! Please login.");
        onSwitch(); 
      }
    } catch (err) {
      setApiError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm font-body">
      <Brand subtitle="Create your workspace account" />

      <div className="bg-white/80 backdrop-blur-md border border-[#c4c6d3]/40 rounded-xl shadow-sm p-6 sm:p-7">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[12.5px] font-semibold text-[#444651] block mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444651]/40"
              />
              <input
                type="text"
                className={`${errors.name ? errorInput : normalInput} pl-9`}
                placeholder="e.g. Aria Kapoor"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  clearError("name");
                }}
              />
            </div>
            {errors.name && (
              <p className="text-[11.5px] text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="text-[12.5px] font-semibold text-[#444651] block mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444651]/40"
              />
              <input
                type="email"
                className={`${errors.email ? errorInput : normalInput} pl-9`}
                placeholder="name@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError("email");
                }}
              />
            </div>
            {errors.email && (
              <p className="text-[11.5px] text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="text-[12.5px] font-semibold text-[#444651] block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444651]/40"
              />
              <input
                type={showPassword ? "text" : "password"}
                className={`${errors.password ? errorInput : normalInput} pl-9 pr-10`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError("password");
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444651]/40"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11.5px] text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="text-[12.5px] font-semibold text-[#444651] block mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444651]/40"
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`${errors.confirmPassword ? errorInput : normalInput} pl-9 pr-10`}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearError("confirmPassword");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444651]/40"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[11.5px] text-red-600 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-start gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => {
                  setAgree(e.target.checked);
                  clearError("agree");
                }}
                className="w-4 h-4 mt-0.5 rounded border-[#c4c6d3] text-[#012c7e] focus:ring-[#012c7e]/30"
              />
              <span className="text-[12.5px] text-[#444651]">
                I agree to the{" "}
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="font-semibold text-[#012c7e] hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="font-semibold text-[#012c7e] hover:underline"
                >
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.agree && (
              <p className="text-[11.5px] text-red-600 mt-1">{errors.agree}</p>
            )}
          </div>

          {apiError && (
            <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-[12px] text-red-600 font-semibold">{apiError}</p>
            </div>
          )}

          <button
            onClick={handleRegister}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-lg bg-blue-600 text-white text-[13.5px] font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-60 mt-1"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <UserPlus size={16} strokeWidth={2.5} />
            )}
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </div>
      </div>

      <p className="text-center text-[13px] text-[#444651]/70 mt-6">
        Already have an account?{" "}
        <button
          onClick={onSwitch}
          className="font-semibold text-[#012c7e] hover:underline"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}

export default function Login() {
  const [view, setView] = useState("login");

  return (
    <div className="min-h-screen w-full bg-[#F6F8FB] font-sans flex items-center justify-center px-4 py-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');
        .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
      `}</style>

      {view === "login" ? (
        <LoginView onSwitch={() => setView("register")} />
      ) : (
        <RegisterView onSwitch={() => setView("login")} />
      )}
    </div>
  );
}