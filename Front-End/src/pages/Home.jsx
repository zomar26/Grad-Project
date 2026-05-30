import React from 'react';
import Navbar from '../components/Layout/Navbar/Navbar';
import Hero from '../features/home/components/Hero/Hero';
import VisionMission from '../features/home/components/VisionMission/VisionMission';
import CoreFeatures from '../features/home/components/CoreFeatures/CoreFeatures';
import HowItWorks from '../features/home/components/HowItWorks/HowItWorks';
import SupportedDiseases from '../features/home/components/SupportedDiseases/SupportedDiseases';
import Footer from '../components/Layout/Footer/Footer';

const Home = () => {
  return (
    <div className="home-page">
      <Navbar />
      
      <main>
        <Hero /> 
        <VisionMission />
        <CoreFeatures /> 
        <HowItWorks /> 
        <SupportedDiseases /> 
      </main>

     <Footer />
    </div>
  );
};

export default Home;