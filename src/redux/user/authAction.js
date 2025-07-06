import axios from 'axios';
import { registerStart, registerStepSuccess, registerFailure } from './authSlice';
import { toast } from 'react-toastify';
const SERVER_URL = import.meta.env.VITE_SERVER;

export const submitFullRegister = (formData) => async (dispatch) => {
  try {
    dispatch(registerStart());

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    const res = await axios.post(`${SERVER_URL}/api/users/signup`, formData, config);

    dispatch(registerStepSuccess(res.data));
    toast.success("Compte créé avec succès !");
    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Erreur lors de l\'inscription';
    dispatch(registerFailure(errorMessage));
    toast.error(errorMessage);
    return { success: false };
  }
};
