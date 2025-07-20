function saveSettings() {
  localStorage.setItem('skyMoodUnits', document.getElementById('settingsUnits').value);
  localStorage.setItem('skyMoodNotif', document.getElementById('settingsNotif').checked ? "1" : "0");
  localStorage.setItem('skyMoodLang', document.getElementById('settingsLang').value);
  localStorage.setItem('skyMoodArVr', document.getElementById('settingsArVr').checked ? "1" : "0");
}
function loadSettings() {
  document.getElementById('settingsUnits').value = localStorage.getItem('skyMoodUnits') || "metric";
  document.getElementById('settingsNotif').checked = localStorage.getItem('skyMoodNotif') === "1";
  document.getElementById('settingsLang').value = localStorage.getItem('skyMoodLang') || "en";
  document.getElementById('settingsArVr').checked = localStorage.getItem('skyMoodArVr') === "1";
}
document.addEventListener("DOMContentLoaded", ()=>{
  loadSettings();
  document.querySelectorAll('#settingsUnits, #settingsNotif, #settingsLang, #settingsArVr').forEach(el=>{
    el.addEventListener('change', saveSettings);
  });
});
