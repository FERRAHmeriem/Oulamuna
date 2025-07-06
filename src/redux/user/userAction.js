import axios from 'axios';
import {
  signInStart,
  signInSuccess,
  signInFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from './userSlice';
import { toast } from 'react-toastify';

const SERVER_URL = import.meta.env.VITE_SERVER;

export const loginUser = ({ userName, password }) => async (dispatch) => {
  try {
    dispatch(signInStart());

    const res = await axios.post(`${SERVER_URL}/api/users/login`, { userName, password });
    const { user, token, message } = res.data;
    const userWithToken = { ...user, token };

    dispatch(signInSuccess(userWithToken));
    toast.success(message || "Connexion réussie !");
    return { success: true };
  } catch (error) {
    const message = error.response?.data?.message || "Nom d'utilisateur ou mot de passe incorrect";
    dispatch(signInFailure(message));
    toast.error(message);
    return { success: false };
  }
};


export const logoutUser = () => async (dispatch) => {
  try {
    dispatch(signOutUserStart());

    await axios.post(`${SERVER_URL}/api/users/logout`, {}, { withCredentials: true });

    dispatch(signOutUserSuccess());
    toast.success("Déconnexion réussie !");
  } catch (error) {
    const message = error.response?.data?.message || "Erreur lors de la déconnexion";
    dispatch(signOutUserFailure(message));
    toast.error(message);
  }
};