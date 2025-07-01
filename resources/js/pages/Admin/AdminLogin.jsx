import React, { useContext, useState } from "react";
// import weblogo from "../../assets/weblogo.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLoginMutation } from "../../apps/features/apiSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../apps/features/AuthSlice";
import { UserContext } from "../../context/userContext";

const LoginPage = () => {
    const [login, { isLoading }] = useLoginMutation();
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().required("username or email is required"),
            password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required"),
        }),
        onSubmit: async (values) => {
            setErrorMessage("");
            try {
                const response = await login(values).unwrap();
                console.log("response", response);

                dispatch(
                    setCredentials({
                        // id: response.data.user.id,
                        token: response.access_token,
                        // role: response.data.user.role,
                    })
                );
                if (response?.message === "Login successful") {
                    navigate("/admin");
                }
            } catch (err) {
                console.error("Login Failed:", err);
                setErrorMessage(
                    err?.data?.message || "Login failed. Please try again."
                );
            }
        },
    });

    return (
        <form
            className="p-6 bg-white w-1/3 items-center"
            onSubmit={formik.handleSubmit}
        >
            <div className="mt-5 flex flex-col items-center">
                {/* <img
          src={weblogo}
          alt="weblogo"
          className="mb-4"
          width={100}
          height={100}
        /> */}
                <h4 className="text-2xl font-semibold mb-4 text-[#1c398e]">
                    Welcome to !
                </h4>
            </div>
            <div className="mb-4">
                <input
                    className="w-full p-2 border border-[#bedbff] rounded focus:outline-none shadow-md"
                    placeholder="Enter user name"
                    id="email"
                    type="text"
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email ? (
                    <div className="text-yellow-600">{formik.errors.email}</div>
                ) : null}
            </div>

            <div className="mb-4 relative">
                <input
                    className="w-full p-2 border border-[#bedbff] rounded focus:outline-none shadow-md"
                    placeholder="Enter Password"
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-2 right-3 flex justify-center items-center text-gray-600"
                >
                    {/* {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />} */}
                </button>
                {formik.touched.password && formik.errors.password ? (
                    <div className="text-yellow-600">
                        {formik.errors.password}
                    </div>
                ) : null}
            </div>

            <div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 text-lg  rounded-lg text-white bg-[#1c398e] font-bold cursor-pointer shadow-md"
                    disabled={formik.isSubmitting || isLoading}
                >
                    {isLoading ? (
                        <div className="flex flex-row items-center justify-center space-x-4">
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-[#05445E] rounded-full animate-spin"></div>
                            <span>Logging In</span>
                        </div>
                    ) : (
                        "Login"
                    )}
                </button>

                {errorMessage && (
                    <div className="text-red-600 mt-2">{errorMessage}</div>
                )}
            </div>
            {/* <div className="flex flex-row items-center mt-2">
                <span>Don't you have an account? </span>
                <button
                    className="text-blue-800 underline cursor-pointer"
                    onClick={() => navigate("/register")}
                >
                    Register
                </button>
            </div> */}
        </form>
    );
};

export default LoginPage;
