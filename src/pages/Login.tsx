import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  HeartPulse,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useStore } from "../store/useStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const login = useStore((s) => s.login);
  const nav = useNavigate();

//   const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setError("");

//     const normalizedEmail = email.trim();

//     if (!normalizedEmail || !password) {
//       setError("Please enter email and password");
//       return;
//     }

//     try {
//       setLoading(true);
//       await login(normalizedEmail, password);
//       nav("/", { replace: true });
//     } catch (loginError: unknown) {
//       setError(loginError instanceof Error ? loginError.message : "Unable to sign in. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setError("");

  const normalizedEmail = email.trim();

  if (!normalizedEmail) {
    setError("Email is required");
    return;
  }

  if (!password) {
    setError("Password is required");
    return;
  }

  try {
    setLoading(true);
    await login(normalizedEmail, password);
    nav("/", { replace: true });
  } catch (loginError: unknown) {
    setError(
      loginError instanceof Error
        ? loginError.message
        : "Unable to sign in. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="login-shell">
      <section className="login-brand-panel" aria-label="HealthCare Pro overview">
        <div className="login-brand-top">
          <div className="login-logo-mark" aria-hidden="true">
            <HeartPulse />
          </div>
          <div>
            <p className="login-eyebrow">HealthCare Pro</p>
            <h1 className="login-headline">
              Hospital operations, always within reach.
            </h1>
          </div>
        </div>

        <p className="login-brand-copy">
          Securely manage patients, appointments, department capacity, and care insights from one clinical dashboard.
        </p>

        <div className="login-hospital-card" aria-hidden="true">
          <div className="login-card-row">
            <div>
              <p className="login-card-label">Today&apos;s care status</p>
              <p className="login-card-value">96%</p>
            </div>
            <div className="login-status-icon">
              <Activity />
            </div>
          </div>
          <div className="login-unit-grid">
            {["ER", "ICU", "OPD"].map((unit, index) => (
              <div key={unit} className="login-unit">
                <p>{unit}</p>
                <div className="login-unit-track">
                  <div
                    className="login-unit-fill"
                    style={{ width: `${[78, 64, 88][index]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="login-feature-grid">
          <div className="login-feature">
            <ShieldCheck />
            <span>Secure access</span>
          </div>
          <div className="login-feature">
            <Building2 />
            <span>Multi-department</span>
          </div>
          <div className="login-feature">
            <HeartPulse />
            <span>Care first</span>
          </div>
        </div>
      </section>

      <section className="login-form-panel" aria-label="Sign in">
        <form className="login-card" onSubmit={handleLogin}>
          <div className="login-form-header">
            <div className="login-mobile-logo" aria-hidden="true">
              <HeartPulse />
            </div>
            <p className="login-form-eyebrow">Staff portal</p>
            <h2>Welcome back</h2>
            <p>
              Sign in to continue to the HealthCare Pro command center.
            </p>
            {/* <div className="login-demo">
              <span>Demo:</span>
              <strong>admin@healthcarepro.com</strong>
              <span>/</span>
              <strong>Admin@123456</strong>
            </div> */}
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <div className="login-field-stack">
            <label>
              <span className="login-label">Email address</span>
              <span className="login-input-wrap">
                <Mail />
                <input
                  type="email"
                  className="login-input"
                  placeholder="doctor@hospital.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </span>
            </label>

            <label>
              <span className="login-label">Password</span>
              <span className="login-input-wrap">
                <LockKeyhole />
                <input
                  type={showPassword ? "text" : "password"}
                  className="login-input login-password-input"
                  placeholder="Enter password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </span>
            </label>
          </div>

          <button type="submit" disabled={loading} className="login-submit">
            <span>{loading ? "Signing in..." : "Sign in"}</span>
            <ArrowRight />
          </button>

          <div className="login-footer">
            <span>Protected hospital workspace</span>
            <span>2026 HealthCare Pro</span>
          </div>
        </form>
      </section>
    </main>
  );
}
