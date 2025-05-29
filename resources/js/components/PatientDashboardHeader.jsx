import { useNavigate } from "react-router-dom";
import localIcon from "../../assets/index";
export default function PatientDashboardHeader({
    user,
    showMenu,
    setShowMenu,
}) {
    const navigate = useNavigate();

    return (
        <div>
            <div className="flex flex-row items-center justify-between w-full h-20 bg-gray-800 text-white shadow-lg sticky top-0 z-50">
                <h1 className="text-xl font-bold px-4">Welcome {user?.name}</h1>
                <div className="ml-auto mr-4">
                    <img
                        src={localIcon?.profile}
                        width={40}
                        height={40}
                        className="cursor-pointer"
                        onClick={() => setShowMenu((prev) => !prev)}
                    />
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-10">
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-blue-950 mr-2"
                                onClick={() => {
                                    setShowMenu(false);
                                }}
                            >
                                Change Password
                            </button>
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-blue-950"
                                onClick={() => {
                                    localStorage.removeItem("persist:auth"); // Clear auth data
                                    navigate("/");
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
