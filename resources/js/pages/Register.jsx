import { useState } from "react";
import { useRegisterMutation } from "../apps/features/apiSlice";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "user",
    });

    const [register, { isLoading, isSuccess, isError, error }] =
        useRegisterMutation();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData).unwrap();
            navigate("/login");
        } catch (err) {
            console.error("Registration failed:", err);
        }
    };

    return (
        <div className="mx-auto p-6 rounded max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center text-[#1c398e]">
                Register{" "}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded border-[#bedbff] focus:outline-none shadow-md"
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border p-2 rounded border-[#bedbff] focus:outline-none shadow-md"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border p-2 rounded border-[#bedbff] focus:outline-none shadow-md"
                    required
                />

                <input
                    type="password"
                    name="password_confirmation"
                    placeholder="Password Confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className="w-full border p-2 rounded border-[#bedbff] focus:outline-none shadow-md"
                    required
                />
                {/* <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full border p-2 rounded border-[#bedbff] focus:outline-none shadow-md"
                    required
                >
                    <option value="user">User</option>
                    <option value="doctor">Doctor</option>
                </select> */}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#1c398e] text-white p-2 rounded hover:bg-[#05085a] cursor-pointer shadow-md"
                >
                    {isLoading ? (
                        <div className="flex flex-row items-center justify-center">
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                            <span>Registering</span>
                        </div>
                    ) : (
                        <div>Register</div>
                    )}
                </button>

                {isSuccess && (
                    <p className="text-green-600">Registered successfully!</p>
                )}
                {isError && (
                    <p className="text-red-600">
                        Error: {error?.data?.message || "Something went wrong."}
                    </p>
                )}
                <div className="flex flex-row items-center mt-2">
                    <span>Do you have an account? </span>
                    <button
                        className="text-blue-800 underline cursor-pointer"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
}
