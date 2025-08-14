import React, { useState } from "react";
import {
    useGetLoggedInUserQuery,
    useGetPredictionHistoryQuery,
} from "../../apps/features/apiSlice";
import PatientDashboardHeader from "../../components/PatientDashboardHeader";
import localIcon from "../../../assets/index";

export default function Records() {
    const [showMenu, setShowMenu] = useState(false);
    const [sidebarExpanded, setSidebarExpanded] = useState(true);

    const { data: user } = useGetLoggedInUserQuery({});
    const { data: records, error, isLoading } = useGetPredictionHistoryQuery();
    console.log(records);
    const printTable = () => {
        const printContent = document.getElementById("print-section").innerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload(); // Optional: reload to restore event listeners
    };

    return (
        <>
            <PatientDashboardHeader
                user={user}
                showMenu={showMenu}
                setShowMenu={setShowMenu}
            />
            <div className="flex flex-row items-start w-full overflow-auto">
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
                        </ul>
                    </>
                </div>
                <div className="flex-1 p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold mb-2">
                            Prediction History
                        </h2>
                        <button
                            onClick={printTable}
                            className="mb-4 px-4 py-2 rounded border border-gray-500 cursor-pointer"
                        >
                            <img src={localIcon.print} />
                        </button>
                    </div>
                    <div
                        id="print-section"
                        className="max-h-[calc(100vh-100px)] overflow-y-auto"
                    >
                        <table className="table-auto w-full border border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2">Date</th>
                                    <th className="border p-2">Symptoms</th>
                                    <th className="border p-2">Disease</th>
                                    <th className="border p-2">Confidence</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records?.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="border p-2">
                                            {new Date(
                                                item.predicted_at
                                            ).toLocaleString()}
                                        </td>
                                        <td className="border p-2">
                                            {item.symptoms.join(", ")}
                                        </td>
                                        <td className="border p-2">
                                            {item.predicted_disease}
                                        </td>
                                        <td className="border p-2">
                                            {item.confidence}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
