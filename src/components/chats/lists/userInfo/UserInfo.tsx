import "./userinfo.css";
import { useAuth } from "@/context/AuthContext";

export default function UserInfo() {
  const { user } = useAuth();

  return (
    <div className="userInfo">
      <div className="user">
        <img
          src={`${import.meta.env.BASE_URL}icons/avatars/avatar-boy2.svg`}
          alt=""
        />
        <h2>{user?.username}</h2>
      </div>
      <div className="icons">
        <img src={`${import.meta.env.BASE_URL}icons/more.svg`} alt="" />
      </div>
    </div>
  );
}
