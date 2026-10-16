# 🛡️ TruthShield: Enterprise Cyber-SOC & Threat Intelligence Suite

**An advanced, enterprise-grade Cyber Security Operations Center (SOC), Threat Intelligence Engine, and AI Media Verification Suite.**

TruthShield is a unified, privacy-first cybersecurity platform designed to combat digital misinformation, deepfake videos, C2PA provenance forgery, and coordinated disinfo botnet attacks. Developed under the conceptual requirements of the Cyber Crime Branch, Ahmedabad City Police.

<div align="center">

[![Download Android APK](https://img.shields.io/badge/Download-TruthShield.apk%20(v1.3.0)-00E5FF?style=for-the-badge&logo=android&logoColor=0B1324)](https://github.com/22kathan/TruthShield/releases/download/v1.3.0/TruthShield.apk)
[![Download ZIP Mirror](https://img.shields.io/badge/Download-Android%20ZIP%20Package-00FFA3?style=for-the-badge&logo=files&logoColor=0B1324)](https://github.com/22kathan/TruthShield/releases/download/v1.3.0/TruthShield-Android.zip)
[![GitHub Release](https://img.shields.io/badge/Release-v1.3.0-7928CA?style=for-the-badge&logo=github&logoColor=white)](https://github.com/22kathan/TruthShield/releases/tag/v1.3.0)
[![Mobile Download Portal](https://img.shields.io/badge/Mobile-Download%20Center-FF007A?style=for-the-badge&logo=googlechrome&logoColor=white)](download.html)

</div>

---

## 📲 Phone Application Download & Installation (v1.3.0)

TruthShield provides multiple download mirrors and zero-install options so you can run the app on any phone:

| Method | Link | Format | When to Use |
| :--- | :--- | :--- | :--- |
| 🤖 **Direct Android APK** | [📥 **Download TruthShield.apk**](https://github.com/22kathan/TruthShield/releases/download/v1.3.0/TruthShield.apk) | `.apk` (~4.5 MB) | Recommended for standard Android phones (Samsung, OnePlus, Pixel, Motorola) |
| 📦 **Alternative ZIP Package** | [🗜️ **Download TruthShield-Android.zip**](https://github.com/22kathan/TruthShield/releases/download/v1.3.0/TruthShield-Android.zip) | `.zip` (~4.5 MB) | **Use if your phone browser says "Download Failed"** — ZIP files bypass APK download filters |
| 🌐 **Dedicated Download Portal** | [📱 **Open Mobile Download Center**](download.html) | Web Portal | Mobile-optimized download page with 1-tap install buttons and visual steps |
| 🚀 **Instant Mobile Web App** | [⚡ **Launch Web App / PWA**](index.html) | Instant PWA | Zero download required — works on both **Android & iPhone (iOS)** |
| 🏷️ **All GitHub Releases** | [📦 **View Release v1.3.0 Assets**](https://github.com/22kathan/TruthShield/releases/tag/v1.3.0) | All Formats | Release changelogs, checksums, and source bundles |

---

### ⚠️ Phone Browser Troubleshooting: "Download Failed" or "File might be harmful"

If your phone browser gives an error when downloading:

1. **Error: "Download failed" in Phone Browser**:
   * **Fix**: Certain phone browsers (like Xiaomi/Mi, Vivo, Oppo, or in-app WhatsApp/Instagram browsers) block direct `.apk` downloads.
   * **Solution A**: Tap **[Download TruthShield-Android.zip](https://github.com/22kathan/TruthShield/releases/download/v1.3.0/TruthShield-Android.zip)**. Once downloaded, tap Extract/Unzip and install `TruthShield.apk`.
   * **Solution B**: Open the link in **Google Chrome** instead of the built-in browser. Long-press the APK link and select **Download link**.
   * **Solution C**: Open [**Instant Web App (index.html)**](index.html) &rarr; tap **⋮ (Menu) &rarr; Add to Home screen / Install app**.

2. **Warning: "File might be harmful"**:
   * **Fix**: This is Google Chrome's standard warning for ANY app installed directly outside the Google Play Store.
   * Tap **Download anyway** &rarr; open the file &rarr; tap **Install**.
   * If Google Play Protect displays a prompt, tap **More details** &rarr; **Install anyway**. TruthShield is 100% open-source and privacy-safe.

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
* **Direct Android APK**: [**TruthShield.apk Download (v1.3.0)**](https://github.com/22kathan/TruthShield/releases/download/v1.3.0/TruthShield.apk)
* **Alternative ZIP Mirror**: [**TruthShield-Android.zip (Bypasses browser blocks)**](https://github.com/22kathan/TruthShield/releases/download/v1.3.0/TruthShield-Android.zip)
* **Official v1.3.0 Release**: [**TruthShield v1.3.0 Release Assets**](https://github.com/22kathan/TruthShield/releases/tag/v1.3.0)
* **Mobile Download Portal**: [**download.html**](download.html)
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

