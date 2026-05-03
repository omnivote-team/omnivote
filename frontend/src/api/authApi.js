import API from "./api";

export const signupUser = async (data) => {
  const response = await API.post("/auth/signup", data);
  return response.data;
};

export const getMyProfile = async () => {
  const response = await API.get("/auth/me/profile");
  return response.data;
};

export const updateMyProfile = async (profileData) => {
  const response = await API.put("/auth/me/profile", profileData);
  return response.data;
};