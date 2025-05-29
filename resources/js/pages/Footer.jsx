import React from "react";
import {
    FaInstagram,
    FaFacebook,
    FaTwitter,
    FaHome,
    FaAddressCard,
    FaUser,
    FaRegistered,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
} from "react-icons/fa";
import localIcon from "../../assets/index";

export default function Footer() {
    return (
        <>
            <div className="grid grid-cols-3 space-x-4 bg-blue-200  justify-items-center p-4">
                <div className="space-y-2">
                    <h3 className="text-blue-800 text-xl">Contact Info</h3>
                    <ul className="text-blue-800 text-justify space-y-4">
                        <li className="flex items-start gap-2 ">
                            <FaMapMarkerAlt className="mt-1 text-[#1c398e]" />
                            <span className="text-justify">
                                1234 Main Street, Hlaing Township, Yangon
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <FaPhoneAlt className="mt-1 text-[#1c398e]" />
                            <span className="text-justify">
                                +95 (09) 123-4567
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <FaEnvelope className="mt-1 text-[#1c398e]" />
                            <span className="text-justify">
                                info@example.com
                            </span>
                        </li>
                    </ul>
                </div>
                <div className="space-y-2">
                    <h3 className="text-blue-800 text-xl">Quick Links</h3>
                    <ul className="text-blue-800 space-y-4 cursor-pointer">
                        <li className="flex flex-row items-center space-x-2">
                            <FaHome size={20} color="#1c398e" />

                            <span>Home</span>
                        </li>
                        <li className="flex flex-row items-center space-x-2">
                            <FaAddressCard size={20} color="#1c398e" />
                            <span>About</span>
                        </li>
                        <li className="flex flex-row items-center space-x-2">
                            <FaUser size={20} color="#1c398e" />
                            <span>Doctors</span>
                        </li>
                        <li className="flex flex-row items-center space-x-2">
                            <FaRegistered size={20} color="#1c398e" />
                            <span>Login</span>
                        </li>
                    </ul>
                </div>
                <div className="space-y-2">
                    <h3 className="text-blue-800 text-xl">Social Media</h3>
                    <ul className="text-blue-800 space-y-4 cursor-pointer">
                        <li className="flex flex-row items-center space-x-2">
                            <FaFacebook size={20} color="#1c398e" />
                            <span>Facebook</span>
                        </li>
                        <li className="flex flex-row items-center space-x-2">
                            <FaTwitter size={20} color="#1c398e" />
                            <span>Twitter</span>
                        </li>
                        <li className="flex flex-row items-center space-x-2">
                            <FaInstagram size={20} color="#1c398e" />
                            <span>Instagram</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="p-2 bg-gray-100 text-center">
                <p>© {new Date().getFullYear()} Thesis. All rights reserved.</p>
            </div>
        </>
    );
}
