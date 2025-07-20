function saveSettings() {
  localStorage.setItem('skyMoodUnits', document.getElementById('settingsUnits').value);
  localStorage.setItem('skyMoodLang', document.getElementById('settingsLang').value);
  localStorage.setItem('skyMoodArVr', document.getElementById('settingsArVr').checked ? "1" : "0");
  localStorage.setItem('skyMoodNotif', document.getElementById('settingsNotif').checked ? "1" : "0");
  localStorage.setItem('skyMoodTheme', document.getElementById('settingsTheme').value);
  localStorage.setItem('skyMoodDefaultCity', document.getElementById('settingsDefaultCity').value);
  localStorage.setItem('skyMoodAlertLevel', document.getElementById('settingsAlertLevel').value);
  localStorage.setItem('skyMoodSource', document.getElementById('settingsSource').value);
  localStorage.setItem('skyMoodContrast', document.getElementById('settingsContrast').checked ? "1" : "0");
}
function loadSettings() {
  document.getElementById('settingsUnits').value = localStorage.getItem('skyMoodUnits') || "metric";
  document.getElementById('settingsLang').value = localStorage.getItem('skyMoodLang') || "en";
  document.getElementById('settingsArVr').checked = localStorage.getItem('skyMoodArVr') === "1";
  document.getElementById('settingsNotif').checked = localStorage.getItem('skyMoodNotif') === "1";
  document.getElementById('settingsTheme').value = localStorage.getItem('skyMoodTheme') || "dynamic";
  document.getElementById('settingsDefaultCity').value = localStorage.getItem('skyMoodDefaultCity') || "";
  document.getElementById('settingsAlertLevel').value = localStorage.getItem('skyMoodAlertLevel') || "all";
  document.getElementById('settingsSource').value = localStorage.getItem('skyMoodSource') || "owm";
  document.getElementById('settingsContrast').checked = localStorage.getItem('skyMoodContrast') === "1";
}
document.addEventListener("DOMContentLoaded", ()=>{
  loadSettings();
  document.querySelectorAll(
    '#settingsUnits, #settingsLang, #settingsArVr, #settingsNotif, #settingsTheme, #settingsDefaultCity, #settingsAlertLevel, #settingsSource, #settingsContrast'
  ).forEach(el=>{
    el.addEventListener('change', saveSettings);
    el.addEventListener('input', saveSettings);
  });
  // Optional: reload to apply language change everywhere
  document.getElementById('settingsLang').addEventListener('change', () => location.reload());
});
