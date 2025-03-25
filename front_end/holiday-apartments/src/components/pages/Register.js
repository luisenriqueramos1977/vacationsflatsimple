import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import { useTranslation } from "react-i18next";

const Register = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert(t("passwords_do_not_match"));
      return;
    }

    console.log(t("registering_with"), { email, password });
    // Add registration logic here
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      {/* Centered Form */}
      <div className="flex-grow flex items-center justify-center">
        <div className="w-[300px] p-6 border rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4">{t("register")}</h2>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            {/* Email Field */}
            <input
              type="email"
              placeholder={t("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded"
              required
            />

            {/* Password Field */}
            <input
              type="password"
              placeholder={t("password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 rounded"
              required
            />

            {/* Confirm Password Field */}
            <input
              type="password"
              placeholder={t("repeat_password")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border p-2 rounded"
              required
            />

            {/* Register Button */}
            <button type="submit" className="bg-blue-500 text-white p-2 rounded font-bold">
              {t("register")}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-4">
            <span>{t("already_have_account")}</span>
            <button onClick={() => navigate("/login")} className="text-blue-600 underline">
              {t("login_here")}
            </button>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;