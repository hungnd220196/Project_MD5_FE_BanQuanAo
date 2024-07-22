import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function PrivateRoute({ element }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const parsedUserData = userData ? JSON.parse(userData) : null;

    const token = Cookies.get('token');

    if (parsedUserData && token) {
      setUser(parsedUserData);
    } else {
      setUser(null);
    }
  }, []);

  const isLogin = () => {
  return parsedUserData.roles.some(item => item === 'ROLE_ADMIN');
  };

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    } else if (user?.roles && !user.roles.includes("ROLE_ADMIN")) {
      navigate("/");
    }
  }, [isLogin, user, navigate]);

  return isLogin && user?.roles.includes("ROLE_ADMIN") ? element : null;
}
