
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ClipboardCheck,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import api from "../services/api";

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      const token =
        data?.token || data?.accessToken || data?.data?.token;

      if (!token) {
        setError("Unable to sign in. Please check the server response.");
        return;
      }

      const user = data?.user || data?.data?.user;
      const fullName = user?.full_name || user?.name;
      const userEmail = user?.email || email.trim().toLowerCase();

      localStorage.setItem("token", token);

      if (fullName) {
        localStorage.setItem("full_name", fullName);
      }
      localStorage.setItem("email", userEmail);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          (err.response
            ? `Login failed (${err.response.status}). Please check your credentials.`
            : "Unable to connect to the server. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  }

  const successMessage = location.state?.message;

  return (
    <main className="min-h-screen bg-[#f4fbf4] px-5 py-8 text-[#161d19]">
      <header className="mx-auto flex max-w-6xl items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#006c49] text-white">
            <ClipboardCheck size={22} />
          </span>
          <span className="font-hanken text-2xl font-bold">Formly</span>
        </Link>

        <Link to="/" className="text-sm font-medium text-[#376850] hover:text-[#006c49]">
          Back to home
        </Link>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-100px)] max-w-md flex-col justify-center py-10">
        <div className="mb-7 text-center">
          <span className="inline-block rounded-full border border-[#bbcabf] bg-white px-3 py-1.5 font-jetbrains text-[10px] uppercase tracking-widest text-[#376850]">
            Your feedback, organized
          </span>

          <h1 className="mt-5 font-hanken text-4xl font-bold tracking-tight">
            Welcome back
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#3c4a42]">
            Sign in to manage your surveys and understand your audience.
          </p>
        </div>

        <div className="rounded-2xl border border-[#bbcabf] bg-white p-6 shadow-[0_12px_40px_rgba(22,29,25,0.04)] sm:p-8">
          {successMessage && (
            <p role="status" className="mb-5 rounded-lg border border-[#bbcabf] bg-[#eef6ee] p-3 text-sm text-[#006c49]">
              {successMessage}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="signin-email" className="mb-2 block text-sm font-semibold">
                Email address
              </label>

              <div className="flex h-12 items-center gap-3 rounded-xl border border-[#bbcabf] px-3.5 focus-within:border-[#006c49] focus-within:ring-2 focus-within:ring-[#006c49]/10">
                <Mail size={18} className="shrink-0 text-[#376850]" />
                <input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signin-password" className="mb-2 block text-sm font-semibold">
                Password
              </label>

              <div className="flex h-12 items-center gap-3 rounded-xl border border-[#bbcabf] px-3.5 focus-within:border-[#006c49] focus-within:ring-2 focus-within:ring-[#006c49]/10">
                <LockKeyhole size={18} className="shrink-0 text-[#376850]" />
                <input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="shrink-0 text-[#376850] hover:text-[#006c49]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#bbcabf]" />
            <span className="font-jetbrains text-[10px] tracking-wider text-[#376850]">
              SECURE ACCESS
            </span>
            <div className="h-px flex-1 bg-[#bbcabf]" />
          </div>

          <p className="text-center text-sm text-[#3c4a42]">
            New to Formly?{" "}
            <Link to="/signup" className="font-semibold text-[#006c49] hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        <p className="mt-7 text-center font-jetbrains text-[10px] uppercase tracking-widest text-[#376850]">
          Simple surveys. Clear insights.
        </p>
      </section>
    </main>
  );
}
