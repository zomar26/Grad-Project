import React, { useState } from 'react';
import SimulationCard from './components/SimulationCard';
import './simulation.css';

// Import all 12 ophthalmology images matching asset filenames
import AMD from '../../assets/eye photos/AMD.png';
import MacularPucker from '../../assets/eye photos/MacularPucker.png';
import RetinitisPigmentosa from '../../assets/eye photos/RetinitisPigmentosa.png';
import StargardtDisease from '../../assets/eye photos/StargardtDisease.png';
import PathologicMyopia from '../../assets/eye photos/PathologicMyopia.png';
import Choroideremia from '../../assets/eye photos/Choroideremia.png';
import CSCR from '../../assets/eye photos/CSCR.png';
import HypertensiveRetinopathy from '../../assets/eye photos/HypertensiveRetinopathy.png';
import CorticalCataract from '../../assets/eye photos/CorticalCataract.png';
import NuclearCataract from '../../assets/eye photos/NuclearCataract.png';
import TraumaticCataract from '../../assets/eye photos/TraumaticCataract.png';
import PosteriorSubcapsularCataract from '../../assets/eye photos/PosteriorSubcapsularCataract.png';

const SimulationView = () => {
    const simulationData = [
        { id: 1, image: AMD, title: 'Age-Related Macular Degeneration (AMD)' },
        { id: 2, image: MacularPucker, title: 'Macular Pucker' },
        { id: 3, image: RetinitisPigmentosa, title: 'Retinitis Pigmentosa' },
        { id: 4, image: StargardtDisease, title: 'Stargardt Disease' },
        { id: 5, image: PathologicMyopia, title: 'Pathologic Myopia' },
        { id: 6, image: Choroideremia, title: 'Choroideremia' },
        { id: 7, image: CSCR, title: 'Acute Central Serous Chorioretinopathy (CSCR)' },
        { id: 8, image: HypertensiveRetinopathy, title: 'Hypertensive Retinopathy' },
        { id: 9, image: CorticalCataract, title: 'Cortical Cataract' },
        { id: 10, image: NuclearCataract, title: 'Nuclear Cataract' },
        { id: 11, image: TraumaticCataract, title: 'Traumatic Cataract' },
        { id: 12, image: PosteriorSubcapsularCataract, title: 'Posterior Subcapsular Cataract' }
    ];

    const [activeIndex, setActiveIndex] = useState(0);

    const handlePrev = () => {
        setActiveIndex((prev) => (prev === 0 ? simulationData.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev === simulationData.length - 1 ? 0 : prev + 1));
    };

    return (
        /* استخدمنا كلاس مخصص simulation-container عشان نتحكم في الـ padding والـ background من الـ CSS بأمان */
        <section className="simulation-container">
            
            {/* Hero & Checklist Section */}
            <div className="simulation-hero">
                <h1 className="simulation-title">
                    Understanding Vision,<br />One Simulation at a Time
                </h1>
                
                <ul className="simulation-checklist">
                    <li className="checklist-item">
                        Step into the challenges of living with eye diseases.
                    </li>
                    <li className="checklist-item">
                        Learn key facts and prevention tips about common eye conditions.
                    </li>
                    <li className="checklist-item">
                        A tool for education, awareness, and empathy.
                    </li>
                </ul>
            </div>

            {/* 3D Carousel Section */}
            <div className="carousel-wrapper">
                <button className="carousel-arrow left" onClick={handlePrev}></button>

                <div className="carousel-track">
                    {simulationData.map((item, index) => {
                        let cardClass = 'inactive';
                        const total = simulationData.length;
                        const diff = (index - activeIndex + total) % total;

                        if (diff === 0) cardClass = 'active';
                        else if (diff === 1) cardClass = 'next1';
                        else if (diff === 2) cardClass = 'next2';
                        else if (diff === 3) cardClass = 'next3';
                        else if (diff === total - 1) cardClass = 'prev1';
                        else if (diff === total - 2) cardClass = 'prev2';
                        else if (diff === total - 3) cardClass = 'prev3';

                        if (cardClass === 'inactive') return null;

                        return (
                            <div key={item.id} className={`track-slot ${cardClass}`}>
                                <SimulationCard
                                    image={item.image}
                                    title={item.title}
                                    isActive={index === activeIndex}
                                />
                            </div>
                        );
                    })}
                </div>

                <button className="carousel-arrow right" onClick={handleNext}></button>
            </div>

            {/* Action Call to Action */}
            <div className="simulation-action-wrapper">
                <button className="simulation-btn">
                    Get Started
                </button>
            </div>
        </section>
    );
};

export default SimulationView;