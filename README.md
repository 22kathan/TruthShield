# 🛡️ TruthShield: Enterprise Cyber-SOC & Threat Intelligence Suite

**An advanced, enterprise-grade Cyber Security Operations Center (SOC), Threat Intelligence Engine, and AI Media Verification Suite.**

TruthShield is a unified, privacy-first cybersecurity platform designed to combat digital misinformation, deepfake videos, C2PA provenance forgery, and coordinated disinfo botnet attacks. Developed under the conceptual requirements of the Cyber Crime Branch, Ahmedabad City Police.

---

## ✨ Key Enterprise Cyber-Security Pillars

### 1. 📡 Cyber SOC Command Center & Live Threat Radar (`js/socEngine.js`)
*   **Real-Time Threat Ticker**: Streams live media threats (Deepfake Spear Phishing, GAN Manipulation, Synthetic Voice Cloning, C2PA Forgery).
*   **MITRE ATT&CK Mapping**: Maps every media threat directly to official MITRE ATT&CK techniques (`T1566`, `T1584`, `T1588`).
*   **Threat Actor Attribution Matrix**: Calculates attribution confidence scores for known adversary groups (e.g. *APT-41 Disinfo Group*, *Synthetics Syndicate*).

### 2. ⚙️ SOAR Automated Incident Response Playbooks (`js/soarPlaybooks.js`)
*   **`PB-101: Emergency Campaign Isolation`**: Quarantines media hashes, blocks domains, and broadcasts DNS sinkholes.
*   **`PB-102: Police Cyber Cell Evidence Export`**: Compiles formal police FIR evidentiary bundles with HMAC-SHA256 digital seals.
*   **`PB-103: Automated CERT-In Takedown Dispatch`**: Issues RFC-compliant abuse & takedown notices to domain registrars.
*   **`PB-104: Botnet Vector Analysis`**: Filters viral redistribution vectors across social networks.

### 3. 🔐 Cryptographic Evidentiary Vault (`js/cryptoVault.js`)
*   **HMAC-SHA256 Evidence Sealing**: Generates tamper-evident cryptographic seals for digital media evidence.
*   **Searchable Threat Hash Registry**: Queryable database of flagged SHA-256 deepfake and malware hashes.

### 4. 🖼️ Vision Transformer & Frequency Forensics (`js/transformerEngine.js`)
*   **DCT Spectrum Anomaly Scanner**: Analyzes 8x8 Discrete Cosine Transform matrices for GAN/Diffusion grid noise.
*   **C2PA Manifest Inspector (`provenanceSuite.js`)**: Verifies digital chain-of-custody envelopes.

### 5. 📹 Facial & Audio Deepfake Inspection (`js/audioDeepfakeDetector.js`)
*   **Facial Landmark Morphing & Blinking Stability**: Detects eye rhythm anomalies across video frames.
*   **Web Audio API FFT Analyzer**: Inspects audio tracks for synthetic voice cloning frequency dropoffs.

---

## 🛠️ Technology Stack

*   **Frontend**: HTML5, Vanilla CSS (Cyberpunk dark SOC aesthetic), JavaScript (ES6+).
*   **Neural & Signal Processing Backend**: TensorFlow.js (WebGL), Web Audio API (FFT), Discrete Cosine Transform (DCT-II).
*   **Security Standard Mappings**: MITRE ATT&CK Matrix, CERT-In RFC Takedown Protocols, HMAC-SHA256 Evidentiary Seals.

---

## 📂 Project Structure

*   `index.html` — SOC Operations Portal, Tab Navigation, and Dashboards.
*   `css/style.css` — High-tech SOC Command Center theme, radar canvas, terminal logs, and printable report CSS.
*   `js/socEngine.js` — SOC Threat Intelligence Feed & MITRE ATT&CK mapping engine.
*   `js/soarPlaybooks.js` — SOAR automated incident response playbooks execution engine.
*   `js/cryptoVault.js` — HMAC-SHA256 evidence sealing & searchable threat hash vault.
*   `js/transformerEngine.js` — DCT frequency domain spectrum & ViT feature analyzer.
*   `js/provenanceSuite.js` — C2PA manifest, EXIF metadata, and digital chain-of-custody suite.
*   `js/audioDeepfakeDetector.js` — Facial landmark morphing & audio FFT voice cloning detector.
*   `js/reportGenerator.js` — Downloadable & printable Forensic Audit Report modal.
*   `js/app.js` — Application controller & Public API.

---

## 🚀 Running Locally

```bash
# Navigate to project directory
cd TruthShield

# Launch local HTTP server
python -m http.server 8008
```
Open your browser and navigate to `http://localhost:8008`.
