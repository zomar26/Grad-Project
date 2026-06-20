import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "../features/simulation/components/experience.css";
import VRScene from "../features/simulation/components/VRScene";

export default function SimulationExperiencePage() {
  const location = useLocation();
  const disease = location.state?.disease;
  const mode = location.state?.mode;
  const [severity, setSeverity] = useState(0.5);
  const [enabled, setEnabled] = useState(true);
  const gameMode = location.state?.assessment === true;
  const [task, setTask] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [assessmentResult, setAssessmentResult] = useState("");
  const [taskChanged, setTaskChanged] = useState(false);

  useEffect(() => {
  if (!task) return;

  setTaskChanged(true);

  switch (task) {

  case "Assessment started. Locate the Exit Sign":
    playAudio("ExitSign.mp3");
    break;

  case "Find the Fire Extinguisher":
    playAudio("FireExtinguisher.mp3");
    break;

  case "Check the Wall Clock":
    playAudio("WallClock.mp3");
    break;

  case "Read the Room Number":
    playAudio("RoomNumber.mp3");
    break;

  case "You have completed the assessment. Now please answer the Room Number Question":
    playAudio("Completed.mp3");
    break;

  default:
    break;
}

  const timer = setTimeout(() => {
    setTaskChanged(false);
  }, 1000);

  return () => clearTimeout(timer);

}, [task]);

  const diseaseMap = {
    "Age-Related Macular Degeneration (AMD)": "AMD",
    "Macular Pucker": "Pucker",
    "Retinitis Pigmentosa": "RP",
    "Stargardt Disease": "Stargardt",
    "Pathologic Myopia": "Myopia",
    "Choroideremia": "Choroideremia",
    "Acute Central Serous Chorioretinopathy (CSCR)": "CSCR",
    "Hypertensive Retinopathy": "Hypertensive",
    "Cortical Cataract": "Cortical",
    "Nuclear Cataract": "Nuclear",
    "Traumatic Cataract": "Traumatic",
    "Posterior Subcapsular Cataract": "Posterior"
  };

  const selectedDisease = diseaseMap[disease?.title];
  const playAudio = (fileName) => {
  const audio = new Audio(`/audio/${fileName}`);
  audio.play().catch(console.error);
};

  return (
  <>
    <VRScene
      disease={selectedDisease || "AMD"}
      mode={mode}
      severity={severity}
      enabled={enabled}
      gameMode={gameMode}
      setTask={setTask}
      setElapsedTime={setElapsedTime}
      setShowQuestion={setShowQuestion}
    />

    <div className="sim-controls">
      {gameMode && ( <div style={{marginTop: 20, borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 12, color: "white"}}>
    
    <div style={{fontWeight: "bold", marginBottom: 8}}> Assessment</div>

    <div style={{
        padding: "10px 12px",
        borderRadius: 8,
        background: taskChanged
        ? "rgba(15, 235, 66, 0.45)"
        : "rgba(0,123,255,0.25)",
        transition: "all 0.3s ease",
        border: "1px solid rgba(0,123,255,0.5)",
        fontWeight: "600",
        marginBottom: 8
      }}>{task}</div>
    <div style={{fontSize: 13, opacity: 0.9}}>Time: {elapsedTime.toFixed(1)}s </div>
    </div>
  )}

    <div className="sim-header">
      <span className="sim-label">Simulation</span>
      <div className={`sim-toggle ${enabled ? "active" : ""}`} onClick={() => setEnabled(!enabled)}/>
    </div> 
    
    <input className="sim-slider" type="range" min="0" max="1" step="0.01" value={severity} onChange={(e) =>
    setSeverity(parseFloat(e.target.value))}/>
    
    <span className="sim-percent">{Math.round(severity * 100)}%</span>
    </div>
    {showQuestion && (<div style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 420,
      zIndex: 99999,
      background: "rgba(255,255,255,0.12)",
      backdropFilter: "blur(18px)",
      border: "1px solid rgba(255,255,255,0.18)",
      borderRadius: 20,
      padding: 24,
      color: "white",
      boxShadow: "0 10px 40px rgba(0,0,0,0.35)"
    }}>

    <p style={{opacity: 0.9, marginBottom: 20}}>
      What room number was displayed on the door?
    </p>

    {["H6", "H9", "H3", "H8"].map((room) => (
      <label
        key={room}
        style={{
          display: "block",
          marginBottom: 12,
          cursor: "pointer",
          padding: "10px 12px",
          borderRadius: 10,
          background:
            selectedAnswer === room
              ? "rgba(0,123,255,0.25)"
              : "rgba(255,255,255,0.05)",
          border:
            selectedAnswer === room
              ? "1px solid rgba(0,123,255,0.5)"
              : "1px solid transparent"
        }}
      >
        <input
          type="radio"
          name="room"
          value={room}
          checked={selectedAnswer === room}
          onChange={(e) =>
            setSelectedAnswer(e.target.value)
          }
          style={{ marginRight: 8 }}/>Room {room}
        </label>
    ))}

    <button
      style={{
        width: "100%",
        marginTop: 15,
        padding: "12px",
        border: "none",
        borderRadius: 12,
        background: "var(--secondary-color)",
        color: "white",
        fontWeight: 600,
        cursor: "pointer",
        transition: "0.3s"
      }}
      onClick={() => {
        if (selectedAnswer === "H8") {
          playAudio("CorrectAnswer.mp3");
          setAssessmentResult(`✓ Correct Answer - Time: ${elapsedTime.toFixed(1)}s`);
        } else {
          playAudio("IncorrectAnswer.mp3");
          setAssessmentResult( `✗ Incorrect Answer - Time: ${elapsedTime.toFixed(1)}s`); 
        }
        setShowQuestion(false);
      }}
    > Submit Answer </button>
  </div>
)}
    {assessmentResult && (<div style={{
      position: "fixed",
      bottom: 20,
      left: 20,
      zIndex: 99999,
      padding: 16,
      borderRadius: 8,
      color: "#fff",
      background: assessmentResult.includes("Correct")
      ? "rgba(40,167,69,0.25)"
      : "rgba(220,53,69,0.25)",
      backdropFilter: "blur(18px)",
      border: "1px solid rgba(255,255,255,0.18)"
    }}> {assessmentResult}
    </div>
  )}
  </>
  );
}