'use client'
import { useEffect } from "react";
import { Img } from "remotion";
import countryList from '../data/countries.json';

export const YourVideoComponent = () => {


const getRandomCountry = () => {
  const randomIndex = Math.floor(Math.random() * countryList.length);
  return countryList[randomIndex];
};
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Img src="../public/download (2).jpg" />
      <h1 className="absolute top-10 left-1/2 transform -translate-x-1/2 text-white text-3xl font-bold">
        Country Scramble Quiz
      </h1>
    </div>
  );
};
