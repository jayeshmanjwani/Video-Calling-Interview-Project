export async function executeCode(req, res) {
  try {
    const { language, code } = req.body;

    if (!language || !code) {
      return res.status(400).json({
        success: false,
        error: "Language and code are required",
      });
    }

    const LANGUAGE_VERSIONS = {
      javascript: { language: "javascript", version: "18.15.0" },
      python: { language: "python", version: "3.10.0" },
      java: { language: "java", version: "15.0.2" },
    };

    const languageConfig = LANGUAGE_VERSIONS[language];

    if (!languageConfig) {
      return res.status(400).json({
        success: false,
        error: `Unsupported language: ${language}`,
      });
    }

    const response = await fetch("https://emkc.org/api/v2/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: languageConfig.language,
        version: languageConfig.version,
        files: [
          {
            name: `main.${getFileExtension(language)}`,
            content: code,
          },
        ],
      }),
    });

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: `Piston API error: ${response.status}`,
      });
    }

    const data = await response.json();

    const output = data.run.output || "";
    const stderr = data.run.stderr || "";

    if (stderr) {
      return res.status(200).json({
        success: false,
        output: output,
        error: stderr,
      });
    }

    return res.status(200).json({
      success: true,
      output: output || "No output",
    });
  } catch (error) {
    console.log("Error in executeCode controller:", error.message);
    res.status(500).json({
      success: false,
      error: `Failed to execute code: ${error.message}`,
    });
  }
}

function getFileExtension(language) {
  const extensions = {
    javascript: "js",
    python: "py",
    java: "java",
  };

  return extensions[language] || "txt";
}
