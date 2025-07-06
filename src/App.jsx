import React from "react";
import { Routes, Route } from "react-router-dom";
import { PrivateRoute, HomeRedirect } from "./utils/routes";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Savant from "./pages/Savant";
import SavantListe from "./pages/SavantListe";
import ArticleListe from "./pages/ArticleListe";
import AddArticle from "./pages/AddArticle";
import Profile from "./pages/Profile";
import Article from "./pages/Article";
import AddSavant from "./pages/AddSavant";
import AdminHome from "./pages/AdminPages/AdminHome";
import AdminArticles from "./pages/AdminPages/AdminArticles";
import AdminSavant from "./pages/AdminPages/AdminSavants";
import Notfound from "./pages/Notfound";
import SavedArticle from "./pages/SavedArticle";
import EditProfile from "./pages/editProfile";
import AdminStatistiques from "./pages/AdminPages/AdminStatistiques";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/savants" element={<SavantListe />} />
      <Route path="/savant/:id" element={<Savant />} />
      <Route path="/articles" element={<ArticleListe />} />
      <Route path="/article/:id" element={<Article />} />
      <Route path="/not-found" element={<Notfound />} />
      <Route path="*" element={<Notfound />} />

      <Route element={<PrivateRoute />}>
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/edit_profile" element={<EditProfile />} />
        <Route path="/articles_sauvgardées" element={<SavedArticle />} />
      </Route>

      <Route element={<PrivateRoute userOnly={true} />}>
        <Route path="/ajouter_article" element={<AddArticle />} />
        <Route path="/ajouter_savant" element={<AddSavant />} />
      </Route>

      <Route element={<PrivateRoute adminOnly={true} />}>
        <Route path="/admin_home" element={<AdminHome />} />
        <Route path="/admin_articles" element={<AdminArticles />} />
        <Route path="/admin_savants" element={<AdminSavant />} />
        <Route path="/admin_statistique" element={<AdminStatistiques />} />
      </Route>
    </Routes>
  );
}

export default App;
