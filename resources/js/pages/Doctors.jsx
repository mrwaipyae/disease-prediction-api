import { useState } from "react";
import doctorImage from "../../assets/images/doctor.png";
import localIcon from "../../assets/index";
import PatientDashboardHeader from "../components/PatientDashboardHeader";
import SideBar from "../components/SideBar";
import { useGetLoggedInUserQuery } from "../apps/features/apiSlice";
export default function Doctors() {
    const { data: user } = useGetLoggedInUserQuery({});
    const [showMenu, setShowMenu] = useState();
    const doctors = [
        {
            name: "Dr. Alice Johnson",
            email: "alice@example.com",
            specialization: "Cardiology",
            phone: "+1 555 123 4567",
            address: "123 Main Street, City",
            workingHours: "9:00 AM – 5:00 PM",
            image: doctorImage,
        },
        {
            name: "Dr. Bob Smith",
            email: "bob@example.com",
            specialization: "Neurology",
            phone: "+1 555 987 6543",
            address: "456 Elm Street, City",
            workingHours: "10:00 AM – 6:00 PM",
            image: doctorImage,
        },
    ];

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
                    className={`bg-gray-900 text-white p-4 min-h-screen transition-all duration-300 w-64`}
                >
                    <SideBar />
                </div>
                <div>
                    <div className="p-6 mx-auto">
                        <h2 className="text-2xl font-bold mb-6 text-[#1c398e] text-center">
                            Doctors
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {doctors.map((doc, index) => (
                                <div
                                    key={index}
                                    className="border p-4 rounded shadow bg-white flex items-center gap-4"
                                >
                                    <img
                                        src={doc.image}
                                        alt={doc.name}
                                        className="w-24 h-24 object-cover rounded-full border"
                                    />
                                    <div>
                                        <h3 className="text-xl font-semibold text-[#1c398e]">
                                            {doc.name}
                                        </h3>
                                        <p>Email: {doc.email}</p>
                                        <p>
                                            Specialization: {doc.specialization}
                                        </p>
                                        <p>Phone: {doc.phone}</p>
                                        <p>Address: {doc.address}</p>
                                        <p>Working Hours: {doc.workingHours}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
