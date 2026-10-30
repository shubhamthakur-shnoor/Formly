import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ClipboardCheck,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import api from "../services/api";
import Loader from "../components/Common/Loader";

function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const startTime = Date.now();

    try {
      const response = await api.post("/auth/register", {
        full_name: trimmedName,
        email: trimmedEmail,
        password,
      });

      const token =
        response.data?.token ||
        response.data?.accessToken ||
        response.data?.data?.token;

      if (!token) {
        setError(
          "Account created, but automatic login is unavailable. Please sign in."
        );
        return;
      }
      const user = response.data?.user || response.data?.data?.user;

      localStorage.setItem("token", token);
      localStorage.setItem(
        "full_name",
        user?.full_name || trimmedName
      );
      localStorage.setItem(
        "email",
        user?.email || trimmedEmail.toLowerCase()
      );
      // 1.5 seconds loadz
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1500 - elapsedTime);

      await new Promise((resolve) =>
        setTimeout(resolve, remainingTime)
      );

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error(
        "Signup error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          (error.response
            ? `Registration failed (${error.response.status}). Please check your details.`
            : "Unable to connect to the server. Please check whether the backend is running.")
      );
    } finally {
      setLoading(false);
    }
  }
  if (loading) {
    return <Loader message="Creating your Formly account..." />;
  }

  return (
    <main className="min-h-screen bg-[#f4fbf4] px-5 py-8 text-[#161d19]">
      <header className="mx-auto flex max-w-6xl items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#006c49] text-white">
            <ClipboardCheck size={22} />
          </span>
          <span className="font-hanken text-2xl font-bold">Formly</span>
        </Link>

        <Link
          to="/"
          className="text-sm font-medium text-[#376850] transition hover:text-[#006c49]"
        >
          Back to home
        </Link>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-100px)] max-w-md flex-col justify-center py-10">
        <div className="mb-7 text-center">
          <span className="inline-block rounded-full border border-[#bbcabf] bg-white px-3 py-1.5 font-jetbrains text-[10px] uppercase tracking-widest text-[#376850]">
            Start with Formly
          </span>

          <h1 className="mt-5 font-hanken text-4xl font-bold tracking-tight">
            Create your account
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#3c4a42]">
            Create surveys, collect feedback and turn responses into insights.
          </p>
        </div>

        <div className="rounded-2xl border border-[#bbcabf] bg-white p-6 shadow-[0_12px_40px_rgba(22,29,25,0.04)] sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="signup-name"
                className="mb-2 block text-sm font-semibold"
              >
                Full name
              </label>

              <div className="flex h-12 items-center gap-3 rounded-xl border border-[#bbcabf] px-3.5 transition focus-within:border-[#006c49] focus-within:ring-2 focus-within:ring-[#006c49]/10">
                <UserRound size={18} className="shrink-0 text-[#376850]" />

                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setError("");
                  }}
                  placeholder="Your full name"
                  autoComplete="name"
                  minLength={2}
                  required
                  className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#3c4a42]/60"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="mb-2 block text-sm font-semibold"
              >
                Email address
              </label>

              <div className="flex h-12 items-center gap-3 rounded-xl border border-[#bbcabf] px-3.5 transition focus-within:border-[#006c49] focus-within:ring-2 focus-within:ring-[#006c49]/10">
                <Mail size={18} className="shrink-0 text-[#376850]" />

                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#3c4a42]/60"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className="mb-2 block text-sm font-semibold"
              >
                Password
              </label>

              <div className="flex h-12 items-center gap-3 rounded-xl border border-[#bbcabf] px-3.5 transition focus-within:border-[#006c49] focus-within:ring-2 focus-within:ring-[#006c49]/10">
                <LockKeyhole size={18} className="shrink-0 text-[#376850]" />

                <input
                  id="signup-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#3c4a42]/60"
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

            <div>
              <label
                htmlFor="signup-confirm-password"
                className="mb-2 block text-sm font-semibold"
              >
                Confirm password
              </label>

              <div className="flex h-12 items-center gap-3 rounded-xl border border-[#bbcabf] px-3.5 transition focus-within:border-[#006c49] focus-within:ring-2 focus-within:ring-[#006c49]/10">
                <LockKeyhole size={18} className="shrink-0 text-[#376850]" />

                <input
                  id="signup-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setError("");
                  }}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  required
                  className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#3c4a42]/60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  className="shrink-0 text-[#376850] hover:text-[#006c49]"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
              {!loading && <ArrowRight size={17} />}
            </button>

            <p className="pt-1 text-center text-xs leading-5 text-[#3c4a42]">
              Create an account to start collecting feedback with Formly.
            </p>
          </form>

          <div className="my-6 h-px bg-[#bbcabf]" />

          <p className="text-center text-sm text-[#3c4a42]">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-semibold text-[#006c49] hover:underline"
            >
              Sign in
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

export default SignUp;
