const input = document.getElementById("domainInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("domainList");

addBtn.onclick = () => {
  const domain = input.value.trim().toLowerCase();
  if (!domain) return;

  chrome.storage.sync.get({ domains: [] }, ({ domains }) => {
    if (!domains.includes(domain)) {
      domains.push(domain);
      chrome.storage.sync.set({ domains });
    }
    input.value = "";
  });
};

function render() {
  chrome.storage.sync.get({ domains: [] }, ({ domains }) => {
    list.innerHTML = "";

    if (domains.length === 0) {
      const empty = document.createElement("li");
      empty.textContent = "No domains are currently redirected.";
      empty.style.opacity = "0.6";
      list.appendChild(empty);
      return;
    }

    domains.forEach(domain => {
      const li = document.createElement("li");

      const label = document.createElement("span");
      label.textContent = domain;
      label.className = "active";

      const remove = document.createElement("button");
      remove.textContent = "Remove";
      remove.onclick = () => {
        chrome.storage.sync.set({
          domains: domains.filter(d => d !== domain)
        });
      };

      li.appendChild(label);
      li.appendChild(remove);
      list.appendChild(li);
    });
  });
}

chrome.storage.onChanged.addListener(render);
render();

