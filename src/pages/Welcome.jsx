import React from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import moon from "../assets/crescentmoon.png"
import mosque from "../assets/Mosque.png"
import scientists from "../assets/scientists.png"
import moons from "../assets/moon.png"
import welcomes from "../assets/welcome.png"
import design from "../assets/design.png"
import facebook from "../assets/facebook.png"
import instagram from "../assets/instagram.png"
import linkedin from "../assets/linkedin.png"
import twitter from "../assets/twitter.png"
import youtube from "../assets/youtube.png"
function Welcome() {
  return (
    <div  className="flex flex-col justify-center">
    <div className="flex flex-col justify-center bg-[#1A3A34] ">
        <Header/>
        <div className="flex flex-col justify-center items-center pt-[175px] pb-[70px] text-[#FAF2E1] ">
          <h1 className="text-7xl pb-3 ">Oulamuna</h1>
          <p className="text-xl pb-9">En l'honneur des savants algériens</p>
          <Link to='/register' className="text-xl bg-[#FAF2E1] text-[#1A3A34] px-5 py-1.5 rounded-lg">Commencer</Link>
        </div>
        <span className=" px-[200px] text-xl pb-[175px] text-[#FAF2E1] text-center">Célébrant l'héritage des savants algériens dont le dévouement au savoir, à la culture 
           et aux sciences a façonné notre société. Cette initiative rend hommage à leurs contributions,
           inspirant les futures générations à poursuivre l'excellence et à préserver le riche patrimoine
           intellectuel de l'Algérie
        </span>
        <img src={moon} alt="moon" className="w-72 absolute top-24 left-96" />
    </div>
    <div className="px-[40px] py-[100px] flex flex-row justify-between items-center bg-[#274C4A]">
      <div className="flex flex-col items-center justify-center gap-3">
        <img src={scientists} className="w-64" alt="scientist" />
        <p className="text-[#FAF2E1]  text-3xl">les savants algériens</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-3">
        <img src={mosque} className="w-64" alt="mosque" />
        <p className="text-[#FAF2E1] text-3xl "> Héritage algérien</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-3">
        <img src={moons} className="w-64" alt="moons" />
        <p className="text-[#FAF2E1] text-3xl ">Culture</p>
      </div>
    </div>
    <div className="flex flex-row items-center justify-start gap-44 bg-[#1A3A34] ">
      <img src={welcomes} alt="" className="h-screen" />
      <div className="text-left text-8xl font-serif">
        <p className="text-left text-[#FFF1D2] uppercase pb-6">Préserver</p>
        <p className="text-left text-[#D8CDB4] uppercase pb-6 ">Notre passé</p>
        <p className="text-left text-[#FFF1D2] uppercase pb-6">Pour les</p>
        <p className="text-left text-[#FFF1D2] uppercase pb-6">Générations</p>
        <p className="text-right text-[#FFF1D2] uppercase ">Futures</p>
      </div>
    </div>
    <div  className="bg-[#4B6153] flex items-center justify-center p-[50px] ">
    <div  className="bg-[#EBE3CB] flex items-center justify-between shadow-[#25302993] shadow-lg rounded-lg p-[100px] ">
      <img src={design} alt="" className="w-56"/>
      <div className="flex flex-col items-center justify-center pr-3 ">
        <p className="text-2xl pb-3 font-semibold">Nous préservons les mémoires du passé</p>
        <h1 className="text-[#3B4A3B] text-9xl pb-9">Oulamuna</h1>
        <p className="text-2xl  pb-3">Mémoire et héritage préservés</p>
        <div className="flex items-center justify-center gap-6 ">
          <Link><img src={facebook} alt="" className="w-16"/></Link>
          <Link><img src={instagram} alt="" className="w-16"/></Link>
          <Link><img src={youtube} alt="" className="w-16"/></Link>
          <Link><img src={linkedin} alt="" className="w-16"/></Link>
          <Link><img src={twitter} alt="" className="w-16"/></Link>
        </div>
      </div>
      <img src={design} alt="" className="w-56" />
    </div>
    </div>
    </div>
  )
}

export default Welcome