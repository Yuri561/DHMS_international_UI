import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
import { resetPassword } from '../AuthFolder/AuthFiles';
import { toast } from 'react-hot-toast';

// ------------------------------------------------------------
// Password-reset request modal
// ------------------------------------------------------------
//
// The reset link is NOT returned by the backend any more — it
// is emailed to the user by the backend (via Brevo). The
// frontend just submits the email and shows a generic success
// message, regardless of whether the account exists, to avoid
// account enumeration.

interface ForgotProps {
    onClose: () => void;
}

const GENERIC_SUCCESS_MESSAGE =
    "If an account exists for that email, we've sent you a password-reset link. The link expires in 15 minutes.";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPassModal: React.FC<ForgotProps> = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleReset = async () => {
        const trimmed = email.trim();

        if (!trimmed) {
            toast.error('Email is required');
            return;
        }

        if (!EMAIL_PATTERN.test(trimmed)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setLoading(true);

        try {
            await resetPassword(trimmed);
            // Always show the generic message — do not reveal
            // whether the account exists.
            setSubmitted(true);
            toast.success(GENERIC_SUCCESS_MESSAGE);
        } catch (err: any) {
            // 404 (endpoint not mounted yet) is handled the same
            // way as a normal 200 to keep the UX consistent.
            if (err?.response?.status === 404) {
                setSubmitted(true);
                toast.success(GENERIC_SUCCESS_MESSAGE);
            } else {
                toast.error(
                    'We could not send the reset email at this time. Please try again shortly.'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open onOpenChange={(val) => { if (!val) onClose(); }}>
            <DialogContent className="sm:max-w-md bg-[#fef5e5]">
                {loading && <LoadingAnimation />}
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-[#D4AF37]">Reset Password</DialogTitle>
                </DialogHeader>

                {submitted ? (
                    <div className="space-y-4 mt-2">
                        <p className="text-sm text-gray-700 leading-6">
                            {GENERIC_SUCCESS_MESSAGE}
                        </p>
                        <p className="text-xs text-gray-500 leading-6">
                            If you don&rsquo;t see the email within a few minutes,
                            please check your spam or promotions folder.
                        </p>
                        <DialogFooter className="mt-4">
                            <Button onClick={onClose} className="bg-[#D4AF37] text-black">
                                Close
                            </Button>
                        </DialogFooter>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 mt-2">
                            <p className="text-sm text-gray-600">
                                Enter your email address and we&rsquo;ll send you a link
                                to reset your password.
                            </p>
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                                inputMode="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white"
                            />
                        </div>

                        <DialogFooter className="mt-4">
                            <Button
                                disabled={loading}
                                onClick={handleReset}
                                className="bg-[#D4AF37] text-black"
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ForgotPassModal;
