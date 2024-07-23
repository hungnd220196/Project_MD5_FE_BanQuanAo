import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function PrivateRoute({ element }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = Cookies.get('token');

    if (userData && token) {
      const parsedUserData = JSON.parse(userData);
      setUser(parsedUserData);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      navigate("/login"); 
    }
  }, [navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      if (user && user.roles.includes("ROLE_ADMIN")) {
      } else {
        navigate("/login");
      }
    }
  }, [isAuthenticated, user, navigate]);

  return isAuthenticated && user?.roles.includes("ROLE_ADMIN") ? element : null;
}
