// Executes code using your backend API

export async function executeCode(language, code) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/run`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          language,
          code,
        }),
      }
    );

    const data = await response.json();

    console.log("Frontend Response:", data);

    return data;
  } catch (error) {
    console.error("Execution Error:", error);

    return {
      success: false,
      error: error.message,
    };
  }
}