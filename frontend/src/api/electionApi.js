import API from "./api";

export const getAdminElections = async () => {
  const response = await API.get("/admin/elections/");
  return response.data;
};

export const getAdminElectionDetails = async (electionId) => {
  const response = await API.get(`/admin/elections/${electionId}`);
  return response.data;
};

export const createElection = async (data) => {
  const response = await API.post("/admin/elections/", data);
  return response.data;
};

export const deleteElection = async (electionId) => {
  const response = await API.delete(`/admin/elections/${electionId}`);
  return response.data;
};

export const openElection = async (electionId) => {
  const response = await API.put(`/admin/elections/${electionId}/open`);
  return response.data;
};

export const closeElection = async (electionId) => {
  const response = await API.put(`/admin/elections/${electionId}/close`);
  return response.data;
};

export const updateElection = async (electionId, data) => {
  const response = await API.put(`/admin/elections/${electionId}`, data);
  return response.data;
};