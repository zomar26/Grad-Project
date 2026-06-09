import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import bgImage from "../../../assets/mode-background.png";
import vrIcon from "../../../assets/vr-icon.png";
import view3dIcon from "../../../assets/3d-icon.png";
import assessmentIcon from "../../../assets/assessment-icon.png";

import "./simulationMode.css";

const SimulationModeView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDisease = location.state?.disease;
  const [loadingMode, setLoadingMode] = useState(null);

  const handleVR = () => {
    setLoadingMode("vr");

    setTimeout(() => {
      navigate("/simulation/experience", {
        state: {
          disease: selectedDisease,
          mode: "vr",
          assessment: false
        }
      });
    }, 500);
  };

  const handle3D = () => {
    setLoadingMode("3d");

    setTimeout(() => {
      navigate("/simulation/experience", {
        state: {
          disease: selectedDisease,
          mode: "3d",
          assessment: false
        }
      });
    }, 500);
  };

  const handleAssessment = () => {
    setLoadingMode("assessment");

    setTimeout(() => {
      navigate("/simulation/experience", {
        state: {
          disease: selectedDisease,
          mode: "vr",
          assessment: true
        }
      });
    }, 500);
  };

  return (
    <section
      className="mode-page"
      style={{backgroundImage: `url(${bgImage})`}}
    >
      <div className="mode-overlay"></div>
      <div className="mode-content">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>

        <h1 className="mode-title">
          How do you want to experience?
        </h1>

        <div className="mode-options">

          {/* VR CARD */}
          <div className="mode-card" onClick={handleVR}>
            <img src={vrIcon} alt="VR" className="mode-icon"/>
            <button className="mode-select-btn">
              {loadingMode === "vr" ? (
                <><span className="spinner"></span> Loading...</>
              ) : ("Virtual Reality")}
            </button>
          </div>

          {/* 3D CARD */}
          <div className="mode-card" onClick={handle3D}>
            <img src={view3dIcon} alt="3D View" className="mode-icon"/>
            <button className="mode-select-btn">
              {loadingMode === "3d" ? (
                <><span className="spinner"></span> Loading... </>
              ) : ("3D View")}
            </button>
          </div>

          {/* ASSESSMENT CARD */}
          <div className="mode-card" onClick={handleAssessment}>
            <img src={assessmentIcon} alt="Assessment" className="mode-icon"/>
            <button className="mode-select-btn">
              {loadingMode === "assessment" ? (
                <><span className="spinner"></span> Loading... </>
              ) : ("Assessment")}
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SimulationModeView;