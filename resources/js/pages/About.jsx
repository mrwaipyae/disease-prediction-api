import React from "react";
import localIcon from "../../assets/index";

export default function About() {
    return (
        <div>
            {/* Banner with breadcrumb */}
            <div className="bg-gray-100 relative ">
                <nav className="text-sm text-gray-600 absolute top-1/2 -translate-y-1/2 right-20">
                    <ol className="list-reset flex">
                        <li>
                            <a
                                href="/"
                                className="hover:text-blue-600 hover:underline font-bold"
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <span className="mx-2">/</span>
                        </li>
                        <li className="text-blue-800 font-bold">About Us</li>
                    </ol>
                </nav>
                <img
                    src={localIcon.about}
                    alt=""
                    className="w-full h-[300px] z-10"
                />
                <h2 className="text-4xl font-semibold mb-2 absolute top-1/2 left-20 transform  -translate-y-1/2 text-center">
                    About Us
                </h2>
                <p></p>
            </div>

            {/* Main About Content */}
            <div className="flex flex-row items-center justify-center gap-8 p-4">
                <div className="w-1/2">
                    <img src={localIcon.about_us} alt="about us" />
                </div>
                <div className="w-1/2 p-4">
                    <h3 className="text-xl font-bold">
                        About Disease Prediction System
                    </h3>
                    <p className="text-md mt-4 text-gray-800">
                        Our Disease Prediction System is designed to help users
                        understand potential health risks by analyzing their
                        symptoms and providing likely disease predictions. Built
                        with advanced data algorithms, the system uses the ID3
                        decision tree model to assess user input and deliver
                        predictions with high accuracy. The system works by
                        asking users to select or input symptoms they are
                        experiencing. These symptoms are then compared against a
                        large dataset of known disease patterns. Based on this,
                        the system predicts possible conditions and offers
                        recommendations on whether professional medical advice
                        should be sought.
                    </p>
                </div>
            </div>
        </div>
    );
}
