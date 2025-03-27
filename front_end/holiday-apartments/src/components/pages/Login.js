import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";

const Login = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("username", data.username);
        localStorage.setItem("groups", data.groups);
        navigate("/");
      } else {
        setError(t("login_failed"));
      }
    } catch (error) {
      setError(t("login_error"));
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-3xl font-bold mb-4">{t("login")}</h1>
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              {t("username")}
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              {t("password")}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {t("login")}
            </button>
            <a
              href="/forgot-password"
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            >
              {t("forgot_password")}
            </a>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm">
              {t("not_registered")}{" "}
              <a
                href="/register"
                className="font-bold text-blue-500 hover:text-blue-800"
              >
                {t("register_here")}
              </a>
            </p>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Login;