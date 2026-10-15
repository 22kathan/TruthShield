# 🛡️ TruthShield: Enterprise Cyber-SOC & Threat Intelligence Suite

**An advanced, enterprise-grade Cyber Security Operations Center (SOC), Threat Intelligence Engine, and AI Media Verification Suite.**

TruthShield is a unified, privacy-first cybersecurity platform designed to combat digital misinformation, deepfake videos, C2PA provenance forgery, and coordinated disinfo botnet attacks. Developed under the conceptual requirements of the Cyber Crime Branch, Ahmedabad City Police.

<div align="center">

[![Download Android APK](https://img.shields.io/badge/Download-Android%20APK-00E5FF?style=for-the-badge&logo=android&logoColor=0B1324)](https://github.com/22kathan/TruthShield/releases/latest)
[![Install Mobile PWA](https://img.shields.io/badge/Install-Mobile%20PWA-00FFA3?style=for-the-badge&logo=pwa&logoColor=0B1324)](https://22kathan.github.io/TruthShield/)
[![GitHub Release](https://img.shields.io/badge/Release-v1.2.0-7928CA?style=for-the-badge&logo=github&logoColor=white)](https://github.com/22kathan/TruthShield/releases)
[![Repository ZIP](https://img.shields.io/badge/Download-Source%20.ZIP-FF007A?style=for-the-badge&logo=github&logoColor=white)](https://github.com/22kathan/TruthShield/archive/refs/heads/main.zip)

</div>

---

## 📲 Phone Application Download & Quick Links

TruthShield is available as a **Native Android Application (.APK)** and an **Instant Progressive Web App (PWA)** for both Android and iOS devices:

| Method | Link | Platform | Description |
| :--- | :--- | :--- | :--- |
| 🤖 **Android APK** | [📥 **Download TruthShield APK**](https://github.com/22kathan/TruthShield/releases/latest) | Android 8.0+ | Direct APK install package with offline AI models & native camera reticle |
| 🌐 **Mobile PWA** | [🚀 **Launch & Install PWA**](https://22kathan.github.io/TruthShield/) | Android / iOS / Tablet | Instant install without downloading files — tap *Add to Home Screen* |
| 🏷️ **GitHub Releases** | [📦 **View All Releases**](https://github.com/22kathan/TruthShield/releases) | All Platforms | Official release tags, changelogs, checksums, and assets |
| 💻 **Source Archive** | [🗜️ **Download Source (.ZIP)**](https://github.com/22kathan/TruthShield/archive/refs/heads/main.zip) | Developer | Full source code with Capacitor Android project files |

> [!TIP]
> **Fastest Way on Mobile**:
> Open [**https://22kathan.github.io/TruthShield/**](https://22kathan.github.io/TruthShield/) in Google Chrome (Android) or Safari (iOS) and tap **Add to Home screen** / **Install App**. The app installs in 2 seconds, takes less than 2 MB of storage, and works fully offline with on-device hardware acceleration!

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
*   `manifest.json` — PWA Web Application Manifest (standalone, theme colors, icons, shortcuts, share target).
*   `sw.js` — Service Worker providing offline caching (`truthshield-v1.2.0`) and fast mobile lifecycle.
*   `capacitor.config.json` — Native Android application configuration.
*   `js/mobileApp.js` — Mobile app lifecycle, bottom navigation, in-app camera reticle scanner, and haptics.
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

---

## 📱 Mobile Phone Application Guide

TruthShield is engineered as a full-featured mobile phone application with one-handed bottom ergonomics, in-app camera verification, and native packaging:

### 📥 Download Links
* **Download Android APK**: [**TruthShield APK on GitHub Releases**](https://github.com/22kathan/TruthShield/releases/latest)
* **Launch Mobile PWA**: [**https://22kathan.github.io/TruthShield/**](https://22kathan.github.io/TruthShield/)
* **Direct Source Code**: [**TruthShield main.zip**](https://github.com/22kathan/TruthShield/archive/refs/heads/main.zip)

---

### 1. 📲 Installing as a Progressive Web App (PWA)
* **Android (Chrome, Edge, Brave, Samsung Internet)**:
  1. Open [https://22kathan.github.io/TruthShield/](https://22kathan.github.io/TruthShield/) on your phone.
  2. Tap the floating **Install TruthShield** banner at the bottom or open browser menu (`⋮`) and select **Install App** / **Add to Home screen**.
  3. The TruthShield icon will appear on your home screen and app launcher.
* **iOS (Apple Safari on iPhone & iPad)**:
  1. Open [https://22kathan.github.io/TruthShield/](https://22kathan.github.io/TruthShield/) in Safari.
  2. Tap the **Share** button (`⎙` at the bottom of the screen).
  3. Scroll down and tap **Add to Home Screen**.
* **Offline Capabilities**:
  - TruthShield caches all core forensics modules locally using `sw.js`. It runs with full functionality even when airplane mode is enabled or without an internet connection.

---

### 2. 🤖 Installing via Android APK File (.apk)
1. Download the latest `.apk` from the [TruthShield GitHub Releases](https://github.com/22kathan/TruthShield/releases/latest) page.
2. Open the downloaded file from your **Downloads** folder or notification shade.
3. If this is your first time sideloading, enable **Allow from this source** in your Android Settings when prompted.
4. Tap **Install**. TruthShield will install as a native Android app.

---

### 3. 📸 In-App Live Forensic Camera Scanner
* Tap the center **Scan** button on the bottom navigation bar or click **Live Camera Scan** to open the full-screen forensic viewfinder.
* Toggle between **Photo Snap** and **Video Clip Recording (max 10s)** with real-time HUD scanning reticles.
* Captured media is piped directly into the AI verification pipeline without leaving the app.

---

### 4. 📳 Haptic Feedback & Native Share Target
* **Haptic Vibration Feedback**: Distinct vibration patterns on verification completion (double pulse for authentic, urgent warning sequence for flagged deepfakes/misinformation).
* **Native Web Share Target**: Supports the OS system share sheet (`manifest.json` `share_target`), allowing users to share text, links, or media directly from WhatsApp, Telegram, or Twitter into TruthShield for instant analysis.
* **One-Tap Share Result**: Forensic verdict cards include a **Share Result** button triggering the native OS share sheet.

---

### 5. 🛠️ Packaging Native Android APK via Capacitor
To build your own signed release APK or debug build using Android Studio:

```bash
# 1. Install dependencies
npm install

# 2. Add Android platform project
npm run cap:add:android

# 3. Synchronize web assets into Android project
npm run cap:sync

# 4. Open in Android Studio to build APK or run on connected device
npm run cap:open:android
```

Once opened in Android Studio:
1. Go to **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
2. Android Studio will output `app-debug.apk` in `android/app/build/outputs/apk/debug/`.
3. Transfer `app-debug.apk` to any Android device or sign it for release on Google Play.

