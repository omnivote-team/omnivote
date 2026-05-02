import API from "./api";


export const getAdminCandidateApplications = async (filters = {}) => {
  const response = await API.get("/candidate-applications/admin/filter", {
    params: filters,
  });

  return response.data;
};


export const decideCandidateApplication = async (
  applicationId,
  decisionData
) => {
  const response = await API.put(
    `/candidate-applications/${applicationId}/decision`,
    decisionData
  );

  return response.data;
};