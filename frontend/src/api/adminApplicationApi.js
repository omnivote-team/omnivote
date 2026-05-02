import API from "./api";


export const getAdminApplicationDetails = async (applicationId) => {
  const response = await API.get(
    `/candidate-applications/admin/${applicationId}`
  );

  return response.data;
};