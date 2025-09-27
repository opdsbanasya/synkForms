import React from "react";
import { Settings, Search, LogOut, LogIn, User, View, FileText, FormInput } from "lucide-react";
import { BASE_URL, DEFAULT_USER_ICON } from "../utils/constansts";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, Link } from "react-router";
import { removeUser } from "../store/userSlice";
import { clearForms } from "../store/formsSlice";

const Header = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const result = await axios.post(`${BASE_URL}/logout`, "", {
        withCredentials: true,
      });
      console.log(result);
      if (result.status === 200) {
        dispatch(removeUser());
        dispatch(clearForms());
        alert("Logged out ❌");
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header className="w-full h-[10vh] px-20 flex justify-between items-center bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg border-b border-gray-300">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-2xl font-bold text-white drop-shadow-md hover:text-yellow-300 transition-colors">
          SynkForms
        </Link>
        
      </div>
      {user && (
        <div className="w-1/3 bg-white/90 backdrop-blur-sm text-black rounded-lg overflow-hidden flex shadow-md hover:shadow-lg transition-shadow">
          <input
            type="text"
            placeholder="Search Forms..."
            className="w-[90%] h-10 outline-none px-3 border-r border-gray-300 bg-transparent"
          />
          <button className="w-[10%] h-10 outline-none px-2 bg-transparent text-gray-600 cursor-pointer font-semibold hover:bg-gray-100 hover:text-blue-600 transition-colors">
            <Search />
          </button>
        </div>
      )}
      {user ? (
        <div className="flex items-center justify-center gap-5">
          <div className="size-10 rounded-full overflow-hidden cursor-pointer ring-2 ring-white/50 hover:ring-yellow-300 transition-all duration-300 hover:scale-110">
            <img
              src={DEFAULT_USER_ICON}
              alt="user-photo"
              className="size-full object-cover"
            />
          </div>
          <Settings
            size={26}
            className="cursor-pointer text-white hover:text-yellow-300 hover:rotate-90 transition-transform duration-300"
          />
          <LogOut
            onClick={() => handleLogOut()}
            size={24}
            className="cursor-pointer text-white hover:text-red-500 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center gap-5">
          <LogIn
            size={24}
            className="cursor-pointer text-white hover:text-yellow-300 transition-transform duration-300"
          />
          <User
            size={24}
            className="cursor-pointer text-white hover:text-yellow-300 transition-transform duration-300"
          />
        </div>
      )}
    </header>
  );
};

export default Header;
