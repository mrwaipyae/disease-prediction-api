import { useEffect, useState } from "react";
import {
    useGetSymptomsQuery,
    useLazyPredictDiseaseQuery,
} from "../../apps/features/apiSlice";
import OneSelect from "../../components/OneSelect";
import localIcon from "../../../assets/index";
export default function Results() {
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
        }
    };

    useEffect(() => {
        if (prediction) {
            setShowModal(true);
        }
    }, [prediction]);

    return (
        <>
            <div className="flex flex-row items-center justify-between w-full h-20 bg-gray-800 text-white shadow-lg sticky top-0 z-50">
                <div className="flex flex-row items-center space-x-4">
                    <h1 className="text-xl font-bold px-4">
                        Welcome to the Patient Dashboard
                    </h1>
                    <button
                        className=" text-white"
                        onClick={() => setSidebarExpanded((prev) => !prev)}
                    >
                        {sidebarExpanded ? (
                            <img
                                src={localIcon?.menu}
                                alt="menu"
                                className="cursor-pointer"
                            />
                        ) : (
                            <img
                                src={localIcon?.menu}
                                alt="menu"
                                className="cursor-pointer"
                            />
                        )}
                    </button>
                </div>

                <div className="ml-auto mr-4">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Logout
                    </button>
                </div>
            </div>
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
                            <h1 className="text-xl">Patient Dashboard</h1>
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
                            <li className="flex items-center space-x-4">
                                <img
                                    src={localIcon.appointment}
                                    width={20}
                                    height={20}
                                />
                                {sidebarExpanded && (
                                    <a href="/patient/appointments">
                                        Appointments
                                    </a>
                                )}
                            </li>
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
                                    Predicted Disease:{" "}
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
