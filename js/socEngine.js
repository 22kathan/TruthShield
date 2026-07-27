/**
 * TruthShield — SOC Threat Intelligence & MITRE ATT&CK Engine
 * Handles real-time threat streaming, MITRE technique mapping,
 * and Threat Actor Attribution matrix calculation.
 */

window.SOCEngine = (function() {
  'use strict';

  const MITRE_MAPPINGS = {
    "Deepfake Phishing": { id: "T1566.002", name: "Spearphishing Link", tactic: "Initial Access", severity: "CRITICAL" },
    "GAN Image Manipulation": { id: "T1584.001", name: "Compromise Infrastructure: Domains", tactic: "Resource Development", severity: "HIGH" },
    "Synthetic Voice Cloning": { id: "T1566.003", name: "Spearphishing Voice", tactic: "Initial Access", severity: "CRITICAL" },
    "C2PA Signature Forgery": { id: "T1588.003", name: "Obtain Capabilities: Code Signing", tactic: "Resource Development", severity: "HIGH" },
    "Disinformation Botnet": { id: "T1583.001", name: "Acquire Infrastructure: Social Accounts", tactic: "Resource Development", severity: "MEDIUM" }
  };

  const THREAT_ACTORS = [
    { name: "APT-41 Disinfo Group", origin: "Eastern Europe", focus: "Financial & Political Deepfakes", confidence: "88%" },
    { name: "Synthetics Syndicate", origin: "East Asia", focus: "GAN Image Splicing & Phishing", confidence: "79%" },
    { name: "ShadowLark Audio Labs", origin: "Unknown/Tor", focus: "Voice Cloning & Audio Impersonation", confidence: "92%" }
  ];

  let threatListeners = [];

  /**
   * Generates a simulated real-time threat intelligence event
   */
  function generateThreatEvent() {
    const keys = Object.keys(MITRE_MAPPINGS);
    const threatType = keys[Math.floor(Math.random() * keys.length)];
    const mitre = MITRE_MAPPINGS[threatType];
    const actor = THREAT_ACTORS[Math.floor(Math.random() * THREAT_ACTORS.length)];

    const event = {
      eventId: "THREAT-" + Math.floor(10000 + Math.random() * 90000),
      timestamp: new Date().toLocaleTimeString(),
      type: threatType,
      mitreId: mitre.id,
      mitreName: mitre.name,
      tactic: mitre.tactic,
      severity: mitre.severity,
      threatActor: actor.name,
      confidence: actor.confidence,
      targetRegion: ["Mumbai", "Delhi", "Bangalore", "Global"][Math.floor(Math.random() * 4)],
      ipAddress: `${Math.floor(Math.random()*200+10)}.${Math.floor(Math.random()*250)}.${Math.floor(Math.random()*250)}.${Math.floor(Math.random()*250)}`
    };

    threatListeners.forEach(cb => cb(event));
    return event;
  }

  function subscribeThreats(callback) {
    if (typeof callback === 'function') {
      threatListeners.push(callback);
    }
  }

  function getMitreMapping(threatType) {
    return MITRE_MAPPINGS[threatType] || { id: "T1566", name: "Phishing", tactic: "Initial Access", severity: "MEDIUM" };
  }

  function getThreatActors() {
    return THREAT_ACTORS;
  }

  return {
    generateThreatEvent: generateThreatEvent,
    subscribeThreats: subscribeThreats,
    getMitreMapping: getMitreMapping,
    getThreatActors: getThreatActors
  };
})();
