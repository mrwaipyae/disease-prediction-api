import React from "react";
import localIcon from "../../assets/index";

export default function Home() {
    return (
        <>
            <div className="relative w-full h-[500px] bg-blue-200 overflow-hidden">
                {/* Doctor Image */}
                <img
                    src={localIcon.doctor}
                    alt="Doctor"
                    className="object-contain h-full w-auto absolute left-10 bottom-0 z-0"
                />

                {/* Overlay Text */}
                <div className="absolute top-1/2 right-2 transform -translate-y-1/2 text-right max-w-xl z-10">
                    <h1 className="text-4xl font-bold text-blue-900 drop-shadow-md text-center">
                        Disease Prediction System
                    </h1>
                    <p className="text-lg mt-4 text-blue-800 drop-shadow-sm text-justify p-8 right-10">
                        Our Disease Prediction System uses intelligent
                        algorithms to help you identify possible diseases based
                        on symptoms you provide. With the power of the ID3
                        Decision Tree Algorithm, we aim to assist users and
                        healthcare professionals in making quicker, data-driven
                        health assessments.
                    </p>
                </div>
            </div>

            <div className="p-4">
                <div className="grid grid-cols-2 items-center justify-center space-x-4 mb-4">
                    <div className="flex justify-end">
                        <img src={localIcon.banner1} width={500} height={400} />
                    </div>
                    <div className="w-3/4">
                        <h3 className="text-xl font-semibold  text-gray-800 text-left mb-4">
                            How it works?
                        </h3>
                        <ul className="leading-6 text-gray-800 text-justify">
                            <li>
                                <b>Input Your Symptoms</b> – Select the symptoms
                                you're experiencing from our easy-to-use
                                interface.
                            </li>
                            <li>
                                <b> Get Predictions</b> – Our system analyzes
                                your inputs using a trained decision tree model.
                            </li>
                            <li>
                                <b> View Doctor's Information</b> – Our system
                                can view doctors of informations corresponding
                                to results.
                            </li>
                            {/* <li>
                                <b>View Possible Diseases</b> – Receive a list
                                of likely diseases along with details and
                                recommendations.
                            </li> */}
                        </ul>
                    </div>
                </div>
                <div className="grid grid-cols-2 items-center justify-center space-x-4 mb-4">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">
                            Why Use This System?
                        </h3>
                        <ul className="leading-6 text-gray-800 text-justify ml-20">
                            <li>✅ Fast and accurate predictions</li>
                            <li>
                                ✅ Easy to use for both patients and
                                professionals
                            </li>
                            <li>
                                ✅ Built using modern technologies: Laravel
                                (backend) & React (frontend)
                            </li>
                            <li>
                                ✅ Aims to assist early diagnosis and raise
                                awareness
                            </li>
                        </ul>
                    </div>
                    <div className="flex justify-start">
                        <img src={localIcon.banner4} width={500} height={400} />
                    </div>
                </div>
            </div>
        </>
    );
}
