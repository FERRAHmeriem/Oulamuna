import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER;

export const fetchAllArticles = async ({ page , limit , sortBy = 'name', sortOrder = 'asc' } = {}) => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/articles`, {
      params: { page, limit, sortBy, sortOrder }
    });

    return response.data; 
  } catch (error) {
    console.error("Erreur lors de la récupération des savants :", error);
    throw error;
  }
};
export const getArticle = async (id , token ) => {
  try {
    const res = await axios.get(`${SERVER_URL}/api/articles/${id}` , {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return res.data.data;
  } catch (err) {
    console.error("Erreur lors de la récupération du savant :", err);
    throw err;
  }
};
export const submitArticle = async (formData, token) => {
  try {
    const response = await axios.post(
      `${SERVER_URL}/api/articles/create`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la soumission de l'article :", error);
    throw error.response?.data || { message: "Erreur inconnue" };
  }
};

export const fetchScholarArticles = async ({ id , page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc' } = {}) => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/articles/scholar/${id}`, {
      params: { page, limit, sortBy, sortOrder }
    });

    return response.data.data; // { success, data, pagination }
  } catch (error) {
    console.error("Erreur lors de la récupération des savants :", error);
    throw error;
  }
};

export const searchArticles = async (filters) => {
  const params = new URLSearchParams(filters).toString();
  const res = await axios.get(`${import.meta.env.VITE_SERVER}/api/articles/search/advanced?${params}`);
  return res.data;
};



export const toggleLike = async (articleId, token) => {
  const res = await axios.post(
    `${import.meta.env.VITE_SERVER}/api/articles/${articleId}/like`,
    {}, // corps vide car ce POST n'envoie pas de data
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const addComment = async (articleId, content, parentComment = null , token, ) => {
  const res = await axios.post(
    `${import.meta.env.VITE_SERVER}/api/articles/${articleId}/comments`,
    { content, parentComment },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getArticlesByAuthor = async (authorId, page = 1, limit = 6, token) => {
  try {
    const res = await axios.get(`${SERVER_URL}/api/articles/author/${authorId}?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err) {
    console.error("Erreur lors de la récupération des articles de l'utilisateur :", err);
    throw err;
  }
};
export const fetchArticleAnalytics = async (id, token) => {
  const res = await axios.get(`${import.meta.env.VITE_SERVER}/api/articles/article/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};