import API from "./api";


export const getAdminDashboardSummary = async () => {
  const response = await API.get("/admin/dashboard/summary");

  return response.data;
};