document.getElementById("filterSelect").addEventListener("change", async (e) => {
  const mode = e.target.value;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(tab.id, {
    type: "applyColorAidFilter",
    visionType: mode
  });
});

document.getElementById("labelSwatches").addEventListener("change", async (e) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, {
    type: "toggleLabelSwatches",
    enabled: e.target.checked
  });
});

document.getElementById("detectCharts").addEventListener("change", async (e) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, {
    type: "toggleChartEnhancer",
    enabled: e.target.checked
  });
});

const darkToggle = document.getElementById("darkModeToggle");
darkToggle.addEventListener("change", (e) => {
  const isDark = e.target.checked;
  document.body.className = isDark ? "dark" : "light";
});

document.getElementById("voiceBtn").addEventListener("click", () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (transcript.includes("protanopia")) {
      chrome.tabs.sendMessage(tab.id, { type: "applyColorAidFilter", visionType: "protanopia" });
    } else if (transcript.includes("deuteranopia")) {
      chrome.tabs.sendMessage(tab.id, { type: "applyColorAidFilter", visionType: "deuteranopia" });
    } else if (transcript.includes("tritanopia")) {
      chrome.tabs.sendMessage(tab.id, { type: "applyColorAidFilter", visionType: "tritanopia" });
    } else if (transcript.includes("normal") || transcript.includes("off")) {
      chrome.tabs.sendMessage(tab.id, { type: "applyColorAidFilter", visionType: "none" });
    } else if (transcript.includes("label")) {
      chrome.tabs.sendMessage(tab.id, { type: "toggleLabelSwatches", enabled: true });
    } else if (transcript.includes("chart")) {
      chrome.tabs.sendMessage(tab.id, { type: "toggleChartEnhancer", enabled: true });
    } else {
      alert("Voice command not recognized.");
    }
  };

  recognition.onerror = (e) => alert("Voice recognition error: " + e.error);
  recognition.start();
});