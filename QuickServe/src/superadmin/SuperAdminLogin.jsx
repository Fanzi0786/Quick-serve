import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./SuperAdminLogin.css";

function SuperAdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const [showForgot, setShowForgot] = useState(false);

  const [recoveryUsername, setRecoveryUsername] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [success, setSuccess] = useState("");

  /* =========================================
     LOGIN
  ========================================= */

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const savedAdmin = JSON.parse(
      localStorage.getItem("quickServeSuperAdmin") || "null",
    );

    /*
      First-time/default account
    */

    const savedUsername = savedAdmin?.username || "superadmin";

    const savedPassword = savedAdmin?.password || "super123";

    if (username.trim() === savedUsername && password === savedPassword) {
      localStorage.setItem("quickServeSuperAdminLoggedIn", "true");

      localStorage.setItem(
        "quickServeSuperAdmin",
        JSON.stringify({
          username: savedUsername,
          password: savedPassword,
          name: savedAdmin?.name || "QuickServe Super Admin",
          recoveryEmail: savedAdmin?.recoveryEmail || "admin@quickserve.com",
        }),
      );

      navigate("/superadmin/dashboard");
    } else {
      setError("Invalid username or password.");
    }
  };

  /* =========================================
     FORGOT PASSWORD
  ========================================= */

  const handleForgotPassword = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const savedAdmin = JSON.parse(
      localStorage.getItem("quickServeSuperAdmin") || "null",
    );

    const savedUsername = savedAdmin?.username || "superadmin";

    const savedRecoveryEmail =
      savedAdmin?.recoveryEmail || "admin@quickserve.com";

    /* CHECK USERNAME */

    if (recoveryUsername.trim() !== savedUsername) {
      setError("Username not found.");
      return;
    }

    /* CHECK EMAIL */

    if (
      recoveryEmail.trim().toLowerCase() !== savedRecoveryEmail.toLowerCase()
    ) {
      setError("Recovery email does not match.");
      return;
    }

    /* PASSWORD CHECK */

    if (newPassword.length < 6) {
      setError("New password must contain at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    /* SAVE NEW PASSWORD */

    localStorage.setItem(
      "quickServeSuperAdmin",
      JSON.stringify({
        username: savedUsername,
        password: newPassword,
        name: savedAdmin?.name || "QuickServe Super Admin",
        recoveryEmail: savedRecoveryEmail,
      }),
    );

    /* RESET FORM */

    setRecoveryUsername("");
    setRecoveryEmail("");
    setNewPassword("");
    setConfirmPassword("");

    setError("");

    setSuccess(
      "Password changed successfully. You can now login with your new password.",
    );

    setTimeout(() => {
      setShowForgot(false);
      setSuccess("");
    }, 2500);
  };

  /* =========================================
     BACK TO LOGIN
  ========================================= */

  const backToLogin = () => {
    setShowForgot(false);

    setError("");
    setSuccess("");

    setRecoveryUsername("");
    setRecoveryEmail("");
    setNewPassword("");
    setConfirmPassword("");
  };

  /* =========================================
     FORGOT PASSWORD PAGE
  ========================================= */

  if (showForgot) {
    return (
      <div className="super-login-page">
        <div className="super-login-card">
          {/* LOGO */}

          <div className="super-login-logo">Q</div>

          <h1>Reset Password</h1>

          <div className="super-login-badge">
            <i className="bi bi-shield-lock-fill"></i>
            Super Admin Security
          </div>

          <p className="super-login-subtitle">
            Verify your account details and create a new password.
          </p>

          <form onSubmit={handleForgotPassword}>
            {/* USERNAME */}

            <div className="super-input-group">
              <label>Username</label>

              <div className="super-input-wrapper">
                <i className="bi bi-person-fill"></i>

                <input
                  type="text"
                  placeholder="Enter your username"
                  value={recoveryUsername}
                  onChange={(e) => setRecoveryUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* EMAIL */}

            <div className="super-input-group">
              <label>Recovery Email</label>

              <div className="super-input-wrapper">
                <i className="bi bi-envelope-fill"></i>

                <input
                  type="email"
                  placeholder="Enter recovery email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* NEW PASSWORD */}

            <div className="super-input-group">
              <label>New Password</label>

              <div className="super-input-wrapper">
                <i className="bi bi-lock-fill"></i>

                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  <i
                    className={
                      showNewPassword
                        ? "bi bi-eye-slash-fill"
                        : "bi bi-eye-fill"
                    }
                  ></i>
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}

            <div className="super-input-group">
              <label>Confirm New Password</label>

              <div className="super-input-wrapper">
                <i className="bi bi-lock-fill"></i>

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i
                    className={
                      showConfirmPassword
                        ? "bi bi-eye-slash-fill"
                        : "bi bi-eye-fill"
                    }
                  ></i>
                </button>
              </div>
            </div>

            {/* ERROR */}

            {error && (
              <div className="super-login-error">
                <i className="bi bi-exclamation-circle-fill"></i>

                {error}
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="super-login-success">
                <i className="bi bi-check-circle-fill"></i>

                {success}
              </div>
            )}

            {/* RESET BUTTON */}

            <button type="submit" className="super-login-button">
              <i className="bi bi-key-fill"></i>
              Change Password
            </button>

            {/* BACK */}

            <button
              type="button"
              className="back-login-button"
              onClick={backToLogin}
            >
              <i className="bi bi-arrow-left"></i>
              Back to Login
            </button>
          </form>

          <div className="super-login-footer">
            QuickServe Platform Administration
          </div>
        </div>
      </div>
    );
  }

  /* =========================================
     LOGIN PAGE
  ========================================= */

  return (
    <div className="super-login-page">
      <div className="super-login-card">
        {/* LOGO */}

        <div className="super-login-logo">Q</div>

        {/* TITLE */}

        <h1>QuickServe</h1>

        {/* BADGE */}

        <div className="super-login-badge">
          <i className="bi bi-shield-lock-fill"></i>
          Super Admin Portal
        </div>

        {/* DESCRIPTION */}

        <p className="super-login-subtitle">
          Sign in to manage restaurants, subscriptions and platform analytics.
        </p>

        {/* LOGIN FORM */}

        <form onSubmit={handleLogin}>
          {/* USERNAME */}

          <div className="super-input-group">
            <label>Username</label>

            <div className="super-input-wrapper">
              <i className="bi bi-person-fill"></i>

              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* PASSWORD */}

          <div className="super-input-group">
            <label>Password</label>

            <div className="super-input-wrapper">
              <i className="bi bi-lock-fill"></i>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={
                    showPassword ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"
                  }
                ></i>
              </button>
            </div>
          </div>

          {/* ERROR */}

          {error && (
            <div className="super-login-error">
              <i className="bi bi-exclamation-circle-fill"></i>

              {error}
            </div>
          )}

          {/* LOGIN */}

          <button type="submit" className="super-login-button">
            <i className="bi bi-box-arrow-in-right"></i>
            Sign In
          </button>

          {/* FORGOT PASSWORD */}

          <button
            type="button"
            className="forgot-password-button"
            onClick={() => {
              setShowForgot(true);
              setError("");
            }}
          >
            <i className="bi bi-question-circle"></i>
            Forgot Password?
          </button>
        </form>

        {/* FOOTER */}

        <div className="super-login-footer">
          QuickServe Platform Administration
        </div>
      </div>
    </div>
  );
}

export default SuperAdminLogin;
