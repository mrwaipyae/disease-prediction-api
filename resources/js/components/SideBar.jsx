import React, { useState } from "react";
import localIcon from "../../assets/index";

export default function SideBar() {
    return (
        <div>
            <div className="flex flex-row items-center space-x-4 mb-6">
                <img src={localIcon.dashboard} alt="dashboard" />
                <h1 className="text-xl font-bold">User Dashboard</h1>
            </div>
            <ul className="space-y-6">
                <li className="flex items-center space-x-4">
                    <img src={localIcon.microscope} width={20} height={20} />

                    <a href="/patient/results">Make Diagnosis</a>
                </li>
                <li className="flex items-center space-x-4">
                    <img src={localIcon.dock} width={20} height={20} />

                    <a href="/patient/records">Diagnosis Results</a>
                </li>

                <li className="flex flex-row items-center space-x-4">
                    <img
                        src={localIcon.appointment}
                        className="text-white"
                        width={20}
                        height={20}
                    />

                    <a href="/patient/doctors">Doctor's Informations</a>
                </li>
            </ul>
        </div>
    );
}
