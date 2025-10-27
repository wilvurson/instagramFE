import realAxios from "axios";
import { useUser } from "../providers/UserProvider";

export const useAxios = () => {
  const { token } = useUser();

  const axios = realAxios.create({
    baseURL: "https://instagram-be-seven.vercel.app",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  return axios;
};
