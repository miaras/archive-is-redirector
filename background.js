const RULE_ID_BASE = 1000;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get({ domains: [] }, ({ domains }) => {
    updateRules(domains);
  });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.domains) {
    updateRules(changes.domains.newValue || []);
  }
});

function updateRules(domains) {
  const rules = domains.map((domain, i) => ({
    id: RULE_ID_BASE + i,
    priority: 1,
    action: {
      type: "redirect",
      redirect: {
        regexSubstitution: "https://archive.is/\\0"
      }
    },
    condition: {
      regexFilter: `^https?://([^/]+\\.)?${escapeRegex(domain)}/.+`,
      resourceTypes: ["main_frame"]
    }
  }));

  chrome.declarativeNetRequest.getDynamicRules(existing => {
    const removeIds = existing.map(r => r.id);

    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: removeIds,
      addRules: rules
    });
  });
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

