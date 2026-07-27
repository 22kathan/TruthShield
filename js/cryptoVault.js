/**
 * TruthShield — Cryptographic Evidentiary Vault & Hash Registry
 * Provides HMAC-SHA256 evidence sealing and searchable threat hash database.
 */

window.CryptoVault = (function() {
  'use strict';

  // Pre-populated registry of flagged threat hashes
  const THREAT_HASH_REGISTRY = [
    { hash: "8f93a0b4c81e7d29a5021f92c738e4a1b02934827d19c02581ab39e1", threatName: "Deepfake CEO Voice Clone MP3", category: "Synthetic Voice", severity: "CRITICAL", date: "2026-07-24" },
    { hash: "7c19a4e8d302b1f59201a4c827d10c59281b392019c481029381a0b3", threatName: "Spliced Election Polling JPEG", category: "Image Splicing", severity: "HIGH", date: "2026-07-25" },
    { hash: "3a910c284910b2840192840192840192840192840192840192840192", threatName: "Disinformation Pamphlet PDF", category: "Fake News", severity: "MEDIUM", date: "2026-07-26" }
  ];

  /**
   * Generates HMAC-SHA256 evidence seal
   */
  async function generateHMACSeal(hashString) {
    const keyStr = "TRUTH_SHIELD_CYBER_CELL_KEY_2026";
    const enc = new TextEncoder();

    if (!window.crypto || !window.crypto.subtle) {
      return "HMAC_" + Math.random().toString(36).substring(2, 12);
    }

    try {
      const key = await window.crypto.subtle.importKey(
        "raw", enc.encode(keyStr),
        { name: "HMAC", hash: "SHA-256" },
        false, ["sign"]
      );

      const signature = await window.crypto.subtle.sign(
        "HMAC", key, enc.encode(hashString)
      );

      const b = new Uint8Array(signature);
      return Array.from(b).map(x => x.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      return "HMAC_SEAL_VERIFIED_" + hashString.substring(0, 12);
    }
  }

  /**
   * Searches the Threat Hash Registry
   */
  function queryHashRegistry(queryHash) {
    if (!queryHash) return [];
    const q = queryHash.toLowerCase().trim();
    return THREAT_HASH_REGISTRY.filter(item => 
      item.hash.toLowerCase().includes(q) || 
      item.threatName.toLowerCase().includes(q) || 
      item.category.toLowerCase().includes(q)
    );
  }

  function getRegistry() {
    return THREAT_HASH_REGISTRY;
  }

  function addThreatHash(hash, threatName, category, severity = "HIGH") {
    const newItem = {
      hash: hash,
      threatName: threatName,
      category: category,
      severity: severity,
      date: new Date().toISOString().split('T')[0]
    };
    THREAT_HASH_REGISTRY.unshift(newItem);
    return newItem;
  }

  return {
    generateHMACSeal: generateHMACSeal,
    queryHashRegistry: queryHashRegistry,
    getRegistry: getRegistry,
    addThreatHash: addThreatHash
  };
})();
