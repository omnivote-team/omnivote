import API from "./api";

export const signupUser = async (data) => {
  const response = await API.post("/auth/signup", data);
  return response.data;
};