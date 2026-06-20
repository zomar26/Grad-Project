import { apiFetch }
from "../../../config/apiConfig";

export const uploadVoice = async (audioBlob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "voice.webm");

  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:5284/api/voice/upload", {
    method: "POST", 
    headers: {Authorization:`Bearer ${token}`}, 
    body: formData});

  if (!response.ok){
    throw new Error("Voice upload failed");
  }
  return await response.json();
};