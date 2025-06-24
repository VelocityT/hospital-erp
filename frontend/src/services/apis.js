import API from ".";

export const loginUser = async (payload) => {
  try {
    const response = await API.post("/auth/login", payload);
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
export const getAllPatientsApi = async (payload) => {
  try {
    const response = await API.get("/patients", payload);
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
export const createPatientApi = async (payload) => {
  try {
    const response = await API.post("/patients", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
export const getUsersApi = async (payload) => {
  try {
    const response = await API.get("/users", {
      params: payload,
    });
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
export const createUserApi = async (payload) => {
  try {
    const response = await API.post("/users/register", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};

export const getDoctorsApi = async (payload) => {
  try {
    const response = await API.get("/doctor", payload);
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
export const getOpdPatientsApi = async () => {
  try {
    const response = await API.get("/opd");
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
export const getIpdPatientsApi = async () => {
  try {
    const response = await API.get("/ipd");
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};

export const getPatientDetailsApi = async (id, payload) => {
  try {
    const response = await API.get(`/patients/${id}`);
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
export const updatePatientApi = async (id, payload) => {
  try {
    const response = await API.put(`/patients/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
export const switchToIpdApi = async (patientId, payload) => {
  try {
    const response = await API.post(`/patients/${patientId}/switch-to-ipd`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
