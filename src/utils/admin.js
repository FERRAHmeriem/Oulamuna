import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER;




// ============================= Scholarssss =========================




export const approveScholar = async (id, notes ,token) => {
  const res = await fetch(`${SERVER_URL}/api/scholars/${id}/approve`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ notes })  // facultatif si attendu
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Erreur lors de l’approbation');
  }

  return res.json();
};



export const rejectScholar = async (id, reason, token, notes) => {
  try {
    const response = await axios.patch(
      `${SERVER_URL}/api/scholars/${id}/reject`,
      {
        reason: reason.trim(),     // Nettoyage facultatif
        notes: notes.trim(),       // Facultatif
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    // Axios gère déjà le parsing du JSON
    const message = error.response?.data?.message || "Erreur lors du rejet du savant";
    throw new Error(message);
  }
};



export const getPendingScholars = async (token, page = 1, limit = 10) => {
  const res = await axios.get(`${SERVER_URL}/api/scholars/admin/pending?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};



// ============================= Articlesss =========================

export const approveArticle = async (id, token ,notes, ) => {
  const res = await fetch(`${SERVER_URL}/api/articles/${id}/approve`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ notes }) // facultatif
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Erreur lors de l’approbation de l’article');
  }

  return res.json();
};



export const rejectArticle = async (id,token , reason, notes ) => {
  try {
    const response = await axios.patch(
      `${SERVER_URL}/api/articles/${id}/reject`,
      {
        reason: reason.trim(),
        notes: notes.trim()
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Erreur lors du rejet de l’article";
    throw new Error(message);
  }
};

export const getArticles = async (token) => {
  const res = await fetch(`${SERVER_URL}/api/articles/admin/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Erreur lors du chargement des articles");
  }
  return res.json();
};


export const fetchGlobalStats = async (token) => {
  const res = await axios.get(`${import.meta.env.VITE_SERVER}/api/articles/admin/global-stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};
export const fetchArticleAnalytics = async (id, token) => {
  const res = await axios.get(`${import.meta.env.VITE_SERVER}/api/articles/${id}/analytics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};



export const archiveArticle = async (articleId, token) => {
  const res = await axios.patch(
    `${import.meta.env.VITE_SERVER}/api/articles/${articleId}/archive`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};