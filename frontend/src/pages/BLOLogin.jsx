import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { useAuth } from "../auth/AuthContext";
import { STRINGS } from "../i18n/strings";

const API_URL = "http://localhost:5000/api";

export default function BLOLogin() {
    const { lang } = useLanguage();
    const { login } = useAuth();
    const t = STRINGS[lang];
    const navigate = useNavigate();

    // Login State
    const [step, setStep] = useState(1); // 1: Credentials, 2: OTP
    const [formData, setFormData] = useState({ bloId: "", password: "", otp: "" });
    const [tempToken, setTempToken] = useState(null);
    const [maskedPhone, setMaskedPhone] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Focus OTP input when step 2 is active
    useEffect(() => {
        if (step === 2) {
            // Use setTimeout to ensure the alert happens after render
            setTimeout(() => {
                alert(`Demo OTP: 1234`);
                const input = document.getElementById('otp-input-field');
                if (input) input.focus();
            }, 50);
        }
    }, [step]);

    // CAPTCHA State (Client-side simulation)
    const [captcha, setCaptcha] = useState("");
    const [captchaInput, setCaptchaInput] = useState("");

    // Generate random captcha
    const generateCaptcha = () => {
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let result = "";
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptcha(result);
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleStep1 = async (e) => {
        e.preventDefault();

        if (captchaInput !== captcha) {
            setError(t.invalidCaptcha);
            // Refresh captcha on fail
            generateCaptcha();
            setCaptchaInput("");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bloId: formData.bloId, password: formData.password })
            });

            const data = await res.json();

            if (res.ok) {
                setTempToken(data.tempToken);
                setMaskedPhone(data.maskedPhone);
                setStep(2);
                // Alert is now handled by useEffect on step change
            } else {
                setError(data.error || "Login failed");
                generateCaptcha(); // Refresh on fail
            }
        } catch (err) {
            setError("Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleStep2 = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/auth/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tempToken, otp: formData.otp })
            });

            const data = await res.json();

            if (res.ok) {
                login({
                    token: data.token,
                    user: data.user,
                    expiresIn: 86400000 // 24 hours
                });
                navigate("/blo/dashboard");
            } else {
                setError(data.error || "OTP Verification failed");
            }
        } catch (err) {
            setError("Server connection failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="section light-bg">
            <div className="login-container">
                <h2>{t.loginTitle}</h2>

                {error && <div className="error-message" role="alert" style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

                {step === 1 ? (
                    <form className="login-form" onSubmit={handleStep1}>
                        <label>
                            {t.bloId}
                            <input
                                name="bloId"
                                value={formData.bloId}
                                onChange={handleInputChange}
                                required
                                aria-label="BLO ID"
                            />
                        </label>

                        <label>
                            {t.password}
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                aria-label="Password"
                            />
                        </label>

                        <div role="group" aria-label="Captcha Verification">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <strong>{captcha}</strong>
                                <button
                                    type="button"
                                    onClick={generateCaptcha}
                                    className="btn btn-secondary"
                                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
                                    title="Refresh Captcha"
                                >
                                    <i className="fas fa-sync-alt"></i>
                                </button>
                            </div>
                            <input
                                value={captchaInput}
                                onChange={(e) => setCaptchaInput(e.target.value)}
                                required
                                aria-label="Enter Captcha"
                                placeholder={t.captcha}
                                style={{ marginTop: '0.5rem' }}
                            />
                        </div>

                        <button className="btn btn-primary" disabled={loading}>
                            {loading ? "Verifying..." : t.secureLogin}
                        </button>
                    </form>
                ) : (
                    <form className="login-form" onSubmit={handleStep2}>
                        <div className="otp-message-container">
                            <p>{t.otpSent}</p>
                            <div className="phone-display">
                                <strong>xxxx-xxxx-{maskedPhone}</strong>
                            </div>
                        </div>

                        <label style={{ alignItems: 'center' }}>
                            {t.enterOtp}
                            <input
                                id="otp-input-field"
                                name="otp"
                                value={formData.otp}
                                onChange={handleInputChange}
                                required
                                maxLength="4"
                                placeholder="----"
                                className="otp-input"
                                autoFocus
                            />
                        </label>

                        <button className="btn btn-primary" disabled={loading}>
                            {loading ? "Verifying..." : t.verifyOtp}
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setStep(1)}
                            style={{ marginTop: '0.5rem', border: 'none', fontSize: '0.9rem' }}
                        >
                            {t.backToLogin}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
}
