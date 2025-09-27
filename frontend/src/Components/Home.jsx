import React, { useEffect, useState, useCallback } from "react";
import Header from "./Header";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constansts";
import { addUser } from "../store/userSlice";

const allowedRoutes = ["login", "register", "form"];

const Home = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const isAllowedRoute = useCallback((pathname) => {
    return allowedRoutes.some(route => {
      if (`/${route}` === pathname) return true;
      
      // Handle dynamic routes like /form/:id
      if (pathname.startsWith(`/${route}/`)) {
        return true;
      }
      
      return false;
    });
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/profile/me`, {
          withCredentials: true,
        });
        dispatch(addUser(response.data.data));
      } catch (error) {
        console.log("User not authenticated:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    // Don't redirect while still loading user data
    if (isLoading) return;

    const isAllowed = isAllowedRoute(location.pathname);
    
    // If user is not logged in and trying to access protected route
    if (!user && !isAllowed) {
      navigate("/login", { replace: true });
      return;
    }

    // If user is logged in and on login/register page, redirect to dashboard
    if (user && (location.pathname === "/login" || location.pathname === "/register")) {
      navigate("/", { replace: true });
    }
  }, [user, location.pathname, navigate, isLoading, isAllowedRoute]);

  return (
    <section className="w-screen h-screen overflow-x-hidden">
      <Header />
      <Outlet />
    </section>
  );
};

export default Home;
