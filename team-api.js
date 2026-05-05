document.addEventListener("DOMContentLoaded", async () => {
  if (!window.VitaNovaApi) return;

  try {
    const data = await window.VitaNovaApi.get("/users");
    if (!data || !data.success || !Array.isArray(data.groups)) return;

    const total = data.groups.reduce((sum, group) => sum + (group.count || 0), 0);
    const header = document.querySelector(".page-header .container");
    if (!header) return;

    const stats = document.createElement("p");
    stats.style.marginTop = "12px";
    stats.style.fontWeight = "600";
    stats.style.color = "#0a3d2e";
    stats.textContent = `Live team members: ${total} across ${data.groups.length} units`;
    header.appendChild(stats);
  } catch (error) {
    console.error("Unable to load team members:", error);
  }
});

