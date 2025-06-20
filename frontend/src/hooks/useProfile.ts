import axiosInstance from "@/lib/axios/axiosInstance";
import { useEffect, useState } from "react";


const useProfile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("auth/user/");
        setProfile(res.data);
      } catch (err) {
        console.error("Profile fetch failed");
      }
    };
    fetchUser();
  }, []);

  return profile;
};

export default useProfile;
