window.VitaNovaApi = (function () {
  const BASE_URL = "https://backend.vnias.org/api";
  const TOKEN = "2|58SdxumWXB8Ggwfgvbcg94lGubnvyMpTiFznuTEw105a7e56";

  async function request(path, options = {}) {
    const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${TOKEN}`,
      ...(options.headers || {}),
    };

    const response = await fetch(url, { ...options, headers });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || "Request failed");
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  function get(path) {
    return request(path, { method: "GET" });
  }

  function postJson(path, payload) {
    return request(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  function postForm(path, formData) {
    return request(path, { method: "POST", body: formData });
  }

  return {
    get,
    postJson,
    postForm,
    request,
  };
})();

window.VitaNovaUI = (function () {
  function ensureToastRoot() {
    let root = document.getElementById("vitanova-toast-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "vitanova-toast-root";
      root.style.position = "fixed";
      root.style.top = "18px";
      root.style.right = "18px";
      root.style.zIndex = "10000";
      root.style.display = "grid";
      root.style.gap = "10px";
      document.body.appendChild(root);
    }
    return root;
  }

  function showToast(type, message) {
    const root = ensureToastRoot();
    const toast = document.createElement("div");
    const colors = {
      success: { bg: "#eafaf1", border: "#2ecc71", text: "#0a3d2e", icon: "fa-check-circle" },
      error: { bg: "#fdecec", border: "#e74c3c", text: "#7a1f1f", icon: "fa-circle-exclamation" },
      info: { bg: "#eaf4ff", border: "#3498db", text: "#1f4b70", icon: "fa-circle-info" },
    };
    const cfg = colors[type] || colors.info;
    toast.style.minWidth = "280px";
    toast.style.maxWidth = "380px";
    toast.style.padding = "12px 14px";
    toast.style.borderLeft = `4px solid ${cfg.border}`;
    toast.style.background = cfg.bg;
    toast.style.color = cfg.text;
    toast.style.borderRadius = "10px";
    toast.style.boxShadow = "0 12px 30px rgba(0,0,0,.12)";
    toast.style.fontSize = "0.92rem";
    toast.style.lineHeight = "1.4";
    toast.style.display = "flex";
    toast.style.alignItems = "flex-start";
    toast.style.gap = "10px";
    toast.style.opacity = "0";
    toast.style.transform = "translateX(10px)";
    toast.style.transition = "all .25s ease";
    toast.innerHTML = `<i class="fas ${cfg.icon}" style="margin-top:2px;"></i><span>${String(message || "")}</span>`;
    root.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(0)";
    });
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(10px)";
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  return {
    toastSuccess(message) {
      showToast("success", message);
    },
    toastError(message) {
      showToast("error", message);
    },
    toastInfo(message) {
      showToast("info", message);
    },
  };
})();
