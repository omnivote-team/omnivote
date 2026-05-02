import API from "./api";

export const getInstitutions = async () => {
  const response = await API.get("/references/institutions");
  return response.data;
};

export const getDepartments = async (institutionId) => {
  const response = await API.get(`/references/departments/${institutionId}`);
  return response.data;
};

export const getBatches = async (institutionId) => {
  const response = await API.get(`/references/batches/${institutionId}`);
  return response.data;
};

export const getSections = async (institutionId, departmentId, batchId) => {
  const response = await API.get("/references/sections", {
    params: {
      institution_id: institutionId,
      department_id: departmentId,
      batch_id: batchId,
    },
  });

  return response.data;
};