import React, { useState } from "react";
import { X } from "lucide-react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const NotifyModal = ({ open, onClose }) => {
    const [email, setEmail] = useState("");
    const [captchaToken, setCaptchaToken] = useState(null);
    const [status, setStatus] = useState("idle"); // idle | loading | success | error

    if (!open) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!captchaToken) {
            setStatus("error");
            return;
        }

        setStatus("loading");

        try {
            const res = await fetch(
                "https://script.google.com/macros/s/AKfycbywCUY33FX48sA0tfzVse8AreBCNcE1tCl9IuUVmB0-2XlSdWHby3W4o2m36pWeaTz6/exec",
                {
                    method: "POST",
                    body: JSON.stringify({
                        email,
                        source: "DSA Sheet",
                    }),
                }
            );


            if (res.ok) {
                setStatus("success");
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl relative">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={18} />
                </button>

                {status === "success" ? (
                    <div className="text-center space-y-3">
                        <h3 className="text-lg font-semibold">You're in 🚀</h3>
                        <p className="text-sm text-gray-600">
                            We'll email you when progress tracking goes live.
                        </p>
                        <button
                            onClick={onClose}
                            className="mt-4 px-4 py-2 rounded-lg bg-primary text-white text-sm"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <>
                        <h3 className="text-lg font-semibold">Get notified on launch</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            No spam. One email when progress tracking is live.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                            <input
                                type="email"
                                required
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />

                            <HCaptcha
                                sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
                                reCaptchaCompat={false}
                                onVerify={setCaptchaToken}
                            />

                            <button
                                type="submit"
                                disabled={!captchaToken || status === "loading"}
                                className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-white
                           disabled:opacity-50 disabled:cursor-not-allowed
                           hover:bg-primary/90 transition"
                            >
                                {status === "loading" ? "Submitting..." : "Notify me"}
                            </button>

                            {status === "error" && (
                                <p className="text-xs text-red-500 text-center">
                                    Please complete captcha or try again.
                                </p>
                            )}
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default NotifyModal;
