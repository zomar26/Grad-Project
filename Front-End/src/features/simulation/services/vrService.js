export const saveVRSession = async (
  diseaseName,
  severityLevel
) => {

  const token =
    localStorage.getItem(
      "token"
    );

  const response =
    await fetch(
      "http://localhost:5284/api/vr/session",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`
        },

        body: JSON.stringify({
          diseaseName,
          severityLevel
        })
      }
    );

  if (!response.ok)
  {
    throw new Error(
      "Failed to save VR session"
    );
  }

  return await response.json();
};