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
    const response = await API.get("/patients/all-patients", payload);
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
export const createPatientApi = async (payload) => {
  try {
    const response = await API.post("/patients/patient-registration", payload, {
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
    const response = await API.put(`/patients/registration/edit/${id}`, payload, {
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
export const getAllWardTypesApi = async () => {
  try {
    const response = await API.get(`/ward/wardTypes/all`);
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
export const createWardTypesApi = async (payload) => {
  try {
    const response = await API.post("/ward/wardTypes/create", payload);
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
export const createWardApi = async (wardData) => {
  try {
    const response = await API.post("/ward/create", wardData);
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
// export const updateWardApi = async (wardId, updatedData) => {
//   try {
//     const response = await API.put(`/ward/update/${wardId}`, updatedData);
//     return response.data;
//   } catch (error) {
//     return error.response?.data || error.message;
//   }
// };
export const getAllWardsApi = async () => {
  try {
    const response = await API.get("/ward/all");
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
};
export const createBedsApi = async (payload) => {
  try {
    const response = await API.post("/ward/create-beds", payload);
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};

export const getBedsByWardIdApi = async (wardId) => {
  try {
    const response = await API.get(`/ward/beds/${wardId}`);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "Request failed" };
  }
};
export const deleteWardApi = async (wardId) => {
  try {
    const res = await API.delete(`/ward/delete/${wardId}`);
    return res.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
};

export const deleteLastBedApi = async (wardId) => {
  try {
    const res = await API.delete(`/ward/delete-last-bed/${wardId}`);
    return res.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
};
