function saveSettings() {
  localStorage.setItem('skyMoodUnits', document.getElementById('settingsUnits').value);
  localStorage.setItem('skyMoodNotif', document.getElementById('settingsNotif').checked ? "1" : "0");
  localStorage.setItem('skyMoodLang', document.getElementById('settingsLang').value);
}
function loadSettings() {
  document.getElementById('settingsUnits').value = localStorage.getItem('skyMoodUnits') || "metric";
  document.getElementById('settingsNotif').checked = localStorage.getItem('skyMoodNotif') === "1";
  document.getElementById('settingsLang').value = localStorage.getItem('skyMoodLang') || "en";
}
document.addEventListener("DOMContentLoaded", ()=>{
  loadSettings();
  document.querySelectorAll('#settingsUnits, #settingsNotif, #settingsLang').forEach(el=>{
    el.addEventListener('change', saveSettings);
  });
});
