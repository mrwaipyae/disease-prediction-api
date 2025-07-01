import { useNavigate } from "react-router-dom";
import localIcon from "../../../assets/index";
import { useGetLoggedInUserQuery } from "../../apps/features/apiSlice";
import { useEffect, useRef, useState } from "react";
import PatientDashboardHeader from "../../components/PatientDashboardHeader";

export default function PatientPage() {
    const { data: user } = useGetLoggedInUserQuery({});
    console.log("user", user?.role);

    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef();

    const handleClickOutside = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
            setShowMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (
        <div>
            <PatientDashboardHeader
                user={user}
                showMenu={showMenu}
                setShowMenu={setShowMenu}
            />
            <div className="grid grid-cols-[1fr_3fr] gap-4">
                <div className="col-span-1 bg-gray-900 text-white p-4 min-h-screen">
                    <div className="flex flex-row items-center space-x-4">
                        <img src={localIcon.dashboard} alt="dashboard" />
                        {user?.role === "doctor" ? (
                            <h1 className="text-xl font-bold">
                                Doctor Dashboard
                            </h1>
                        ) : (
                            <h1 className="text-xl font-bold">
                                Patient Dashboard
                            </h1>
                        )}
                    </div>
                    <ul className="mt-4 space-y-6">
                        <li className="flex flex-row items-center space-x-4">
                            <img
                                src={localIcon.microscope}
                                className="text-white"
                                width={20}
                                height={20}
                            />
                            <a href="/patient/results">Make Diagnosis</a>
                        </li>
                        <li className="flex flex-row items-center space-x-4">
                            <img
                                src={localIcon.dock}
                                className="text-white"
                                width={20}
                                height={20}
                            />
                            <a href="/patient/records">Diagnosis Results</a>
                        </li>

                        <li className="flex flex-row items-center space-x-4">
                            <img
                                src={localIcon.appointment}
                                className="text-white"
                                width={20}
                                height={20}
                            />
                            <a href="/patient/doctors">Doctor's Information</a>
                        </li>
                    </ul>
                </div>
                {user?.role === "doctor" ? (
                    <div className="col-span-3">
                        <div className="grid grid-cols-3 space-x-4 p-4">
                            <div className="bg-[#bedbff] rounded-md shadow flex flex-col items-center p-4">
                                <p className="text-gray-700 text-lg mb-4">
                                    Total doctors - 2{" "}
                                </p>
                                <button className="px-2 py-1 border border-blue-800 rounded text-sm text-blue-800 cursor-pointer">
                                    View More Info{" "}
                                </button>
                            </div>
                            <div className="bg-[#bedbff] rounded-md shadow flex flex-col items-center p-4">
                                <p className="text-gray-700 text-lg mb-4">
                                    Total patients - 5{" "}
                                </p>
                                <button className="px-2 py-1 border border-blue-800 rounded text-sm text-blue-800 cursor-pointer">
                                    View More Info{" "}
                                </button>
                            </div>
                            <div className="bg-[#bedbff] rounded-md shadow flex flex-col items-center p-4">
                                <p className="text-gray-700 text-lg mb-4">
                                    Total appointments - 2{" "}
                                </p>
                                <button className="px-2 py-1 border border-blue-800 rounded text-sm text-blue-800 cursor-pointer">
                                    View More Info{" "}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
