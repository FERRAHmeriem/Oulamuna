import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from  "./pages/Login";
import Register from "./pages/Register";
import Welcome from "./pages/welcome";
import PrivateRoute from "./components/PrivateRoute";
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
function App() {
  return (
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Savants" element={<SavantListe />} />
        <Route path="/Savant/:id" element={<Savant />} />
        <Route path="/articles" element={<ArticleListe />} />
        <Route path="/article/:id" element={<Article />} />
        <Route path="/ajouter_article" element={<AddArticle />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path='/add_savant' element={<AddSavant/>}/>
        <Route path='/admin_home' element={<AdminHome/>}/>
        <Route path='/admin_articles' element={<AdminArticles/>}/>
        <Route path='/admin_savants' element={<AdminSavant/>}/>
        <Route element={<PrivateRoute/>}>
        
        </Route>
      </Routes>
  );
}

export default App;