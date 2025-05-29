import { useEffect, useRef, useState } from "react";
import {
    useGetLoggedInUserQuery,
    useGetSymptomsQuery,
    useLazyPredictDiseaseQuery,
} from "../../apps/features/apiSlice";
import OneSelect from "../../components/OneSelect";
import localIcon from "../../../assets/index";
import { Navigate, useNavigate } from "react-router-dom";
import PatientDashboardHeader from "../../components/PatientDashboardHeader";

export default function Results() {
    const navigate = useNavigate();
    const { data: user } = useGetLoggedInUserQuery({});
    const { data: symptoms } = useGetSymptomsQuery();
    const [selectedSymptoms, setSelectedSymptoms] = useState([
        "",
        "",
        "",
        "",
        "",
    ]);

    const [showModal, setShowModal] = useState(false);
    const [sidebarExpanded, setSidebarExpanded] = useState(true);

    const handleSymptomChange = (index, value) => {
        const newSelections = [...selectedSymptoms];
        newSelections[index] = value;
        setSelectedSymptoms(newSelections);
    };

    const [triggerPredictDisease, { data: prediction, isLoading }] =
        useLazyPredictDiseaseQuery();

    const handlePredict = () => {
        const filtered = selectedSymptoms.filter(Boolean);
        if (filtered.length > 0) {
            triggerPredictDisease({ symptoms: filtered });
            setSelectedSymptoms(["", "", "", "", ""]);
        }
    };

    useEffect(() => {
        if (prediction) {
            setShowModal(true);
        }
    }, [prediction]);

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
        <>
            <PatientDashboardHeader
                user={user}
                showMenu={showMenu}
                setShowMenu={setShowMenu}
            />
            <div className="flex">
                {/* Sidebar */}
                <div
                    className={`bg-gray-900 text-white p-4 min-h-screen transition-all duration-300 ${
                        sidebarExpanded ? "w-64" : "w-12"
                    }`}
                >
                    {/* Sidebar content */}

                    <>
                        <div className="flex flex-row items-center space-x-4 mb-6">
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
                        <ul className="space-y-6">
                            <li className="flex items-center space-x-4">
                                <img
                                    src={localIcon.microscope}
                                    width={20}
                                    height={20}
                                />
                                {sidebarExpanded && (
                                    <a href="/patient/results">
                                        Make Diagnosis
                                    </a>
                                )}
                            </li>
                            <li className="flex items-center space-x-4">
                                <img
                                    src={localIcon.dock}
                                    width={20}
                                    height={20}
                                />
                                {sidebarExpanded && (
                                    <a href="/patient/records">
                                        Diagnosis Results
                                    </a>
                                )}
                            </li>
                            {user?.role === "doctor" ? (
                                <li className="flex flex-row items-center space-x-4">
                                    <img
                                        src={localIcon.appointment}
                                        className="text-white"
                                        width={20}
                                        height={20}
                                    />
                                    <a href="/patient/appointments">
                                        Appointment Requests
                                    </a>
                                </li>
                            ) : (
                                <li className="flex flex-row items-center space-x-4">
                                    <img
                                        src={localIcon.appointment}
                                        className="text-white"
                                        width={20}
                                        height={20}
                                    />
                                    <a href="/patient/appointments">
                                        Your Appointments
                                    </a>
                                </li>
                            )}
                        </ul>
                    </>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-4">
                    {[...Array(5)].map((_, index) => (
                        <div
                            key={index}
                            className="flex flex-row items-center space-x-2 p-4 w-full"
                        >
                            <span className="w-[20%]">Symptom {index + 1}</span>
                            <OneSelect
                                symptoms={symptoms}
                                value={selectedSymptoms[index]}
                                onChange={(value) =>
                                    handleSymptomChange(index, value)
                                }
                            />
                        </div>
                    ))}

                    <div className="p-4 flex flex-row items-center justify-end space-x-4">
                        <button
                            className="px-4 py-2 border border-gray-400 cursor-pointer rounded-md "
                            onClick={() =>
                                setSelectedSymptoms(["", "", "", "", ""])
                            }
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handlePredict}
                            disabled={isLoading}
                            className={`${
                                isLoading
                                    ? "bg-gray-400"
                                    : "bg-blue-900 text-white"
                            } text-white px-4 py-2 rounded cursor-pointer `}
                        >
                            {isLoading ? <>Predicting</> : <>Predict Disease</>}
                        </button>
                    </div>

                    {showModal && (
                        <div
                            className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50"
                            onClick={() => setShowModal(false)}
                        >
                            <div
                                className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex flex-row items-center justify-between">
                                    <h2 className="text-xl font-bold mb-4">
                                        Prediction Result
                                    </h2>
                                    <img
                                        src={localIcon?.close}
                                        alt=""
                                        className="cursor-pointer"
                                        onClick={() => setShowModal(false)}
                                    />
                                </div>
                                <p className="text-green-700 text-lg">
                                    Disease may be:{" "}
                                    <strong>
                                        {prediction?.predicted_disease}
                                    </strong>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
