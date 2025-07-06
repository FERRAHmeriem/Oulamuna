import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER;

export const addScholar = async (formData, token) => {
  const response = await axios.post(
    `${SERVER_URL}/api/scholars/submit-scholar`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`, // ✅ Include token here
      },
    }
  );
  return response.data;
};

export const getScholarById = async (id) => {
  try {
    const res = await axios.get(`${SERVER_URL}/api/scholars/${id}`);
    return res.data.data;
  } catch (err) {
    console.error("Erreur lors de la récupération du savant :", err);
    throw err;
  }
};



export const getAllScholars = async ({ page , limit , sortBy = 'name', sortOrder = 'asc' } = {}) => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/scholars`, {
      params: { page, limit, sortBy, sortOrder }
    });

    return response.data; // { success, data, pagination }
  } catch (error) {
    console.error("Erreur lors de la récupération des savants :", error);
    throw error;
  }
};



export const searchScholars = async (filters) => {
  const params = new URLSearchParams(filters).toString();
  const res = await axios.get(`${import.meta.env.VITE_SERVER}/api/scholars/search/advanced?${params}`);
  return res.data;
};



export const fetchScholarList = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_SERVER}/api/scholars/list`);
    return response.data.data; // array of { _id, name }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Erreur lors de la récupération des savants.");
  }
};