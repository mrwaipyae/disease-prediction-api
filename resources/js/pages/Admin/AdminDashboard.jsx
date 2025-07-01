import React from "react";
import localIcon from "../../../assets/index";
export default function AdminDashboard() {
    return (
        <div>
            <div className="grid grid-cols-[1fr_3fr] gap-4">
                <div className="col-span-1 bg-white text-white p-4 min-h-screen shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
                    <div className="ml-15">
                        <img src={localIcon.logo} className="w-28 h-28" />
                    </div>
                    <div className="flex flex-row items-center space-x-4 bg-blue-950 shadow-md rounded-md px-2 py-2 cursor-pointer transition duration-200 ease-in-out hover:scale-[1.02]">
                        <img src={localIcon.dashboard} alt="dashboard" />
                        Admin Dashboard
                    </div>
                    <ul className="mt-4 space-y-6">
                        <li className="flex flex-row items-center space-x-4 bg-blue-950 shadow-md rounded-md px-2 py-2 cursor-pointer transition duration-200 ease-in-out hover:scale-[1.02]">
                            <img
                                src={localIcon.microscope}
                                className="text-white"
                                width={20}
                                height={20}
                            />
                            <a href="/patient/results" className="text-white">
                                Manage Doctors
                            </a>
                        </li>

                        <li className="flex flex-row items-center space-x-4 bg-blue-950 shadow-md rounded-md px-2 py-2 cursor-pointer transition duration-200 ease-in-out hover:scale-[1.02]">
                            <img
                                src={localIcon.dock}
                                className="text-white"
                                width={20}
                                height={20}
                            />
                            <a href="/patient/records">Manage Users</a>
                        </li>
                    </ul>
                </div>
                <div className="rounded-md">
                    <table className="p-4 table-fixed border-collapse border border-gray-300 bg-[#FFFFFF] shadow-lg">
                        <thead>
                            <tr className="bg-[#FBE9B8] text-left">
                                <th className="border border-gray-300 lg:w-4xl p-3">
                                    Title
                                </th>
                                <th className="border border-gray-300 w-44 p-3">
                                    Date
                                </th>
                                <th className=" border border-gray-300 w-44 p-3 text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
