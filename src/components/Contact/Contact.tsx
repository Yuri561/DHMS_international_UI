import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

type FormData = {
    name: string;
    email: string;
    subject?: string;
    message: string;
};

const Contact = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = () => {
        if (!formRef.current) return;

        setLoading(true);

        emailjs
            .sendForm(
                "service_8qzr5ib",
                "contact_form",
                formRef.current,
                "x8QfCUeOjxLraFUOM"
            )
            .then(() => {
                setIsSubmitted(true);
                setLoading(false);
                toast.success("Your inquiry was submitted, we will be in touch shortly!");
                reset();
            })
            .catch((error: any) => {
                console.error("Email send error:", error);
                toast.error("Oops! Something went wrong. Please try again.");
                setLoading(false);
            });
    };

    return (
        <section className="min-h-screen mt-12 bg-transparent flex flex-col justify-center items-center px-6 py-24 bg-black text-white">
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover z-[-1] blur-sm brightness-30"
            >
                <source src='../../../public/videos/signin.MP4' type="video/mp4" />
            </video>
            <div className="max-w-2xl w-full bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] p-8 rounded-2xl shadow-2xl border border-[#f3cb50]/30 backdrop-blur-md">
                <h2 className="text-4xl font-bold text-center mb-8 text-[#f3cb50] font-[satisfy]">
                    Let’s Connect ✨
                </h2>

                {isSubmitted ? (
                    <div className="text-center text-[#f3cb50] text-lg font-semibold">
                        ✅ Message sent successfully.
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="ml-2 text-sm underline hover:text-white transition"
                        >
                            Send another?
                        </button>
                    </div>
                ) : (
                    <form
                        ref={formRef}
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Name */}
                        <div>
                            <label className="text-sm font-semibold text-[#f3cb50]">Full Name</label>
                            <input
                                {...register("name", { required: "Name is required" })}
                                type="text"
                                placeholder="Jane Doe"
                                className="w-full mt-2 px-4 py-3 bg-transparent border border-[#f3cb50]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f3cb50] placeholder:text-gray-400"
                            />
                            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-sm font-semibold text-[#f3cb50]">Email Address</label>
                            <input
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: "Enter a valid email",
                                    },
                                })}
                                type="email"
                                placeholder="email@domain.com"
                                className="w-full mt-2 px-4 py-3 bg-transparent border border-[#f3cb50]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f3cb50] placeholder:text-gray-400"
                            />
                            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="text-sm font-semibold text-[#f3cb50]">Subject (optional)</label>
                            <input
                                {...register("subject")}
                                type="text"
                                placeholder="Partnership inquiry"
                                className="w-full mt-2 px-4 py-3 bg-transparent border border-[#f3cb50]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f3cb50] placeholder:text-gray-400"
                            />
                        </div>

                        {/* Message */}
                        <div>
                            <label className="text-sm font-semibold text-[#f3cb50]">Your Message</label>
                            <textarea
                                {...register("message", { required: "Message is required" })}
                                placeholder="Tell us what’s on your mind..."
                                className="w-full mt-2 px-4 py-3 h-32 bg-transparent border border-[#f3cb50]/50 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#f3cb50] placeholder:text-gray-400"
                            />
                            {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#f3cb50] text-black font-semibold py-3 rounded-lg hover:bg-white transition duration-300 ease-in-out disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                )}
            </div>
        </section>


    );
};

export default Contact;