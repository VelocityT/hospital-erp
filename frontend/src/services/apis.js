import API from ".";

export const loginUser = async (payload) => {
  try {
    const response = await API.post("/auth/login", payload);
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
export const logoutUserApi = async () => {
  try {
    const response = await API.get("/auth/logout");
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
export const getAllStaffApi = async (payload) => {
  try {
    const response = await API.get("/users/staff", payload);
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
export const getPatientDetailsIpdOpdApi = async (id, params) => {
  try {
    const response = await API.get(`/patients/ipd-opd/${id}`, {
      params,
    });
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
    const response = await API.post(
      `/patients/${patientId}/switch-to-ipd`,
      payload
    );
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};

export const createUserApi = async (payload) => {
  try {
    const response = await API.post("/users/register", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};

