import React from "react";
import { Link, NavLink } from "react-router-dom";
import localIcon from "../../assets/index";

export default function Nav() {
    return (
        <div className="p-2 bg-white sticky top-0 z-50 shadow">
            <nav>
                <div className="flex justify-between items-center px-4">
                    <div className="flex flex-row items-center gap-4">
                        <img
                            src={localIcon.logo}
                            alt=""
                            width={60}
                            height={60}
                            className="rounded-full"
                        />
                        <h1 className="text-2xl font-bold text-gray-700">
                            Disease Prediction System
                        </h1>
                    </div>

                    <ul className="flex gap-4">
                        <NavLink
                            to="/"
                            className={
                                ({ isActive }) =>
                                    isActive
                                        ? "font-bold text-small text-[#05445E]" // active color
                                        : "font-bold text-small text-gray-600 hover:text-[#05445E]" // normal color
                            }
                        >
                            HOME
                        </NavLink>
                        <li>
                            <NavLink
                                to="/about"
                                className={({ isActive }) =>
                                    isActive
                                        ? "font-bold text-small text-[#05445E]" // active color
                                        : "font-bold text-small text-gray-600 hover:text-[#05445E]"
                                }
                            >
                                ABOUT
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/doctors"
                                className={({ isActive }) =>
                                    isActive
                                        ? "font-bold text-small text-[#05445E]" // active color
                                        : "font-bold text-small text-gray-600 hover:text-[#05445E]"
                                }
                            >
                                DOCTORS
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/register"
                                className={({ isActive }) =>
                                    isActive
                                        ? "font-bold text-small text-[#05445E]" // active color
                                        : "font-bold text-small text-gray-600 hover:text-[#05445E]"
                                }
                            >
                                REGISTER
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    isActive
                                        ? "font-bold text-small text-[#05445E]" // active color
                                        : "font-bold text-small text-gray-600 hover:text-[#05445E]"
                                }
                            >
                                LOGIN
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}
