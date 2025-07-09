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
export const getAllStaffApi = async () => {
  try {
    const response = await API.get("/user/all-staff");
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
export const getAllPatientsApi = async () => {
  try {
    const response = await API.get("/patient/all-patients");
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
export const createPatientApi = async (payload) => {
  try {
    const response = await API.post("/patient/patient-registration", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
export const getUsersApi = async (params) => {
  try {
    const response = await API.get("/user/all-users", {
      params,
    });
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
export const getStaffByIdApi = async (id) => {
  try {
    const response = await API.get(`/user/get-user/${id}`);
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
export const getDoctorsApi = async () => {
  try {
    const response = await API.get("/doctor/all-doctors");
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
export const getOpdPatientsApi = async () => {
  try {
    const response = await API.get("/opd/all-opd-patients");
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
export const getIpdPatientsApi = async () => {
  try {
    const response = await API.get("/ipd/all-ipd-patients");
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};

export const getPatientDetailsApi = async (id) => {
  try {
    const response = await API.get(`/patient/patient-details/${id}`);
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
export const getPatientDetailsIpdOpdApi = async (id, params) => {
  try {
    const response = await API.get(`/patient/ipd-opd-details/${id}`, {
      params,
    });
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
export const updatePatientRegistrationApi = async (id, payload) => {
  try {
    const response = await API.put(
      `/patient/patient-registration/edit/${id}`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
export const updateIpdDetailsApi = async (ipdId, payload) => {
  try {
    const response = await API.put(`/ipd/update-ipd/${ipdId}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
};
export const updateOpdDetailsApi = async (opdId, payload) => {
  try {
    const response = await API.put(`/opd/update-opd/${opdId}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
};

export const switchToIpdApi = async (patientId, payload) => {
  try {
    const response = await API.post(
      `/patient/${patientId}/patient-switch-to-ipd`,
      payload
    );
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};

export const updateOrCreateUserApi = async (payload) => {
  try {
    const response = await API.post("/user/register-update-user", payload, {
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
export const createAndUpdateWardApi = async (wardData) => {
  try {
    const response = await API.post("/ward/create-update-ward", wardData);
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
// export const updateWardApi = async (wardId, updatedData) => {
//   try {
//     const response = await API.put(`/ward/update-ward/${wardId}`, updatedData);
//     return response.data;
//   } catch (error) {
//     return error.response?.data || error.message;
//   }
// };
export const getAllWardsApi = async () => {
  try {
    const response = await API.get("/ward/all-wards");
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
    return (
      error.response?.data || { success: false, message: "Request failed" }
    );
  }
};
export const deleteWardApi = async (wardId) => {
  try {
    const res = await API.delete(`/ward/delete-ward/${wardId}`);
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
export const getAvailableWardsAndBedsApi = async (params) => {
  try {
    const response = await API.get("/ipd/available-wards-beds", {
      params,
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
};
export const changeBedStatusApi = async (payload) => {
  try {
    const response = await API.put("/ward/bed/status", payload);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
};

export const createOrUpdateMedicineApi = async (payload) => {
  try {
    const response = await API.post(
      `/pharmacy/create-update-medicine`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};

export const getAllMedicinesApi = async () => {
  try {
    const res = await API.get("/pharmacy/all-medicines");
    return res.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "API Error" };
  }
};

export const deleteMedicineApi = async (id) => {
  try {
    const res = await API.delete(`/pharmacy/delete-medicine/${id}`);
    return res.data;
  } catch (error) {
    return error.response?.data || { code: 500, message: "API Error" };
  }
};
export const dischargePatientApi = async (payload) => {
  try {
    const res = await API.put("/ipd/discharge-ipd-patient", payload);
    return res.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "API Error" };
  }
};
export const getPatientFullDetailsApi = async (patientId) => {
  try {
    const response = await API.get(`/patient/patient-full-details/${patientId}`);
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
export const addOpdOrIpdApi = async (payload) => {
  try {
    const res = await API.post("/patient/add-opd-ipd", payload);
    return res.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "API Error" };
  }
};
export const searchPatientApi = async (query) => {
  try {
    const res = await API.get(`/patient/patient-search?q=${query}`);
    return res.data;
  } catch (err) {
    return { success: false, message: "Search failed" };
  }
};
export const payPatientIpdBillApi = async (payload) => {
  try {
    const res = await API.post("/pay/patient-ipd-bill",payload);
    return res.data;
  } catch (err) {
    return { success: false, message: "Search failed" };
  }
};
export const payPatientOpdBillApi = async (payload) => {
  try {
    const res = await API.post("/pay/patient-opd-bill",payload);
    return res.data;
  } catch (err) {
    return { success: false, message: "Search failed" };
  }
};
export const uploadMedicineExcelApi = async (formData) => {
  return await API.post("/pharmacy/import-medicines", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
};
