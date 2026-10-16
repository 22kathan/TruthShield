/**
 * TruthShield Mobile Phone Application Controller
 * Handles PWA lifecycle, Service Worker registration, Bottom Navigation,
 * In-App Camera Viewfinder, Haptic Feedback, and Native Share Target APIs.
 */

class MobileAppManager {
  constructor() {
    this.deferredInstallPrompt = null;
    this.cameraStream = null;
    this.currentFacingMode = 'environment'; // 'environment' (back) or 'user' (front)
    this.activeRecording = null;
    this.mediaRecorder = null;
    this.recordedChunks = [];

    this.init();
  }

  init() {
    this.registerServiceWorker();
    this.setupInstallPrompt();

    const onReady = () => {
      this.setupBottomNav();
      this.setupShareTarget();
      this.setupCameraModal();
      this.checkDeepLinks();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', onReady);
    } else {
      onReady();
    }
  }

  // ═══════════════════════════════════════════════
  // 1. PWA SERVICE WORKER & INSTALLATION
  // ═══════════════════════════════════════════════

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then((reg) => {
            console.log('[TruthShield Mobile] Service Worker registered with scope:', reg.scope);
          })
          .catch((err) => {
            console.warn('[TruthShield Mobile] Service Worker registration failed:', err);
          });
      });
    }
  }

  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent automatic browser mini-infobar
      e.preventDefault();
      this.deferredInstallPrompt = e;

      // Check if user already dismissed in this session
      if (sessionStorage.getItem('ts_pwa_dismissed') === 'true') return;

      // Show floating mobile install banner
      const banner = document.getElementById('pwaInstallBanner');
      if (banner) {
        banner.style.display = 'flex';

        // Auto-dismiss after 10 seconds so it never obstructs reading content
        setTimeout(() => {
          if (banner.style.display === 'flex') {
            this.dismissInstallBanner(false);
          }
        }, 10000);
      }
    });

    window.addEventListener('appinstalled', () => {
      this.deferredInstallPrompt = null;
      const banner = document.getElementById('pwaInstallBanner');
      if (banner) banner.style.display = 'none';
      if (window.TruthShield && window.TruthShield.toast) {
        window.TruthShield.toast('TruthShield installed to your home screen!', 'success');
      }
      this.haptic('success');
    });
  }

  promptInstall() {
    this.haptic('tap');
    if (!this.deferredInstallPrompt) {
      if (window.TruthShield && window.TruthShield.toast) {
        window.TruthShield.toast('To install: tap your browser menu (⋮ or Share) and select "Add to Home Screen".', 'info');
      }
      return;
    }

    this.deferredInstallPrompt.prompt();
    this.deferredInstallPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('[TruthShield Mobile] User accepted install prompt');
      }
      this.deferredInstallPrompt = null;
      this.dismissInstallBanner(false);
    });
  }

  dismissInstallBanner(manual = true) {
    if (manual) this.haptic('tap');
    const banner = document.getElementById('pwaInstallBanner');
    if (banner) {
      banner.style.animation = 'pwaSlideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      setTimeout(() => {
        banner.style.display = 'none';
        banner.style.animation = '';
      }, 300);
    }
    // Remember dismissal for this session
    sessionStorage.setItem('ts_pwa_dismissed', 'true');
  }

  // ═══════════════════════════════════════════════
  // 2. HAPTIC FEEDBACK ENGINE
  // ═══════════════════════════════════════════════

  haptic(type = 'tap') {
    if (!('vibrate' in navigator)) return;

    try {
      switch (type) {
        case 'tap':
          navigator.vibrate(15);
          break;
        case 'nav':
          navigator.vibrate(20);
          break;
        case 'scan':
          navigator.vibrate([25, 40, 25]);
          break;
        case 'success':
          // Crisp double-pulse for verified authentic content
          navigator.vibrate([35, 50, 65]);
          break;
        case 'alert':
          // Urgent triple warning pattern for detected fake / deepfake / threat
          navigator.vibrate([80, 40, 80, 40, 120]);
          break;
        case 'error':
          navigator.vibrate([50, 80, 50]);
          break;
        default:
          navigator.vibrate(15);
      }
    } catch (e) {
      // Ignore vibration errors if blocked by browser policy
    }
  }

  // ═══════════════════════════════════════════════
  // 3. MOBILE BOTTOM NAVIGATION
  // ═══════════════════════════════════════════════

  navigateFromBottom(section) {
    this.haptic('nav');
    if (window.TruthShield && typeof window.TruthShield.navigate === 'function') {
      window.TruthShield.navigate(section);
    } else {
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      const secEl = document.getElementById(section);
      if (secEl) secEl.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.syncBottomNav(section);
  }

  openCameraFromBottom() {
    this.haptic('tap');
    this.openCameraModal('photo');
  }

  setupBottomNav() {
    const navItems = document.querySelectorAll('.bottom-nav-item');
    navItems.forEach((btn) => {
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (btn.id === 'bnav-camera') {
          this.openCameraFromBottom();
          return;
        }
        const section = btn.dataset.section;
        if (section) {
          this.navigateFromBottom(section);
        }
      };
    });
  }

  syncBottomNav(activeSection) {
    const navItems = document.querySelectorAll('.bottom-nav-item');
    navItems.forEach((item) => {
      if (item.dataset.section === activeSection) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // ═══════════════════════════════════════════════
  // 4. IN-APP MOBILE CAMERA VIEWFINDER & SCANNER
  // ═══════════════════════════════════════════════

  setupCameraModal() {
    const modal = document.getElementById('cameraModal');
    if (!modal) return;

    const closeBtn = document.getElementById('cameraCloseBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeCameraModal());
    }

    const switchBtn = document.getElementById('cameraSwitchBtn');
    if (switchBtn) {
      switchBtn.addEventListener('click', () => this.switchCamera());
    }

    const capturePhotoBtn = document.getElementById('cameraSnapBtn');
    if (capturePhotoBtn) {
      capturePhotoBtn.addEventListener('click', () => this.capturePhoto());
    }

    const recordVideoBtn = document.getElementById('cameraRecordBtn');
    if (recordVideoBtn) {
      recordVideoBtn.addEventListener('click', () => this.toggleVideoRecording());
    }
  }

  async openCameraModal(mode = 'photo') {
    const modal = document.getElementById('cameraModal');
    if (!modal) return;

    modal.style.display = 'flex';
    document.body.classList.add('camera-open');

    // Switch photo or video mode UI
    const photoControls = document.getElementById('cameraPhotoControls');
    const videoControls = document.getElementById('cameraVideoControls');
    if (photoControls && videoControls) {
      photoControls.style.display = mode === 'photo' ? 'flex' : 'none';
      videoControls.style.display = mode === 'video' ? 'flex' : 'none';
    }

    await this.startCameraStream();
  }

  closeCameraModal() {
    this.haptic('tap');
    const modal = document.getElementById('cameraModal');
    if (modal) modal.style.display = 'none';
    document.body.classList.remove('camera-open');

    this.stopCameraStream();

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }

  async startCameraStream() {
    const videoEl = document.getElementById('cameraPreview');
    if (!videoEl) return;

    this.stopCameraStream();

    try {
      const constraints = {
        video: {
          facingMode: { ideal: this.currentFacingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      this.cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
      videoEl.srcObject = this.cameraStream;
      await videoEl.play();
    } catch (err) {
      console.warn('[TruthShield Camera] getUserMedia error:', err);
      // Fallback: trigger native OS file camera picker
      if (window.TruthShield && window.TruthShield.toast) {
        window.TruthShield.toast('Live camera stream unavailable or blocked. Opening system camera...', 'info');
      }
      this.closeCameraModal();
      this.triggerNativeFileCamera();
    }
  }

  stopCameraStream() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach((t) => t.stop());
      this.cameraStream = null;
    }
  }

  async switchCamera() {
    this.haptic('tap');
    this.currentFacingMode = this.currentFacingMode === 'environment' ? 'user' : 'environment';
    await this.startCameraStream();
  }

  capturePhoto() {
    this.haptic('scan');
    const videoEl = document.getElementById('cameraPreview');
    if (!videoEl || !this.cameraStream) {
      this.triggerNativeFileCamera();
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoEl.videoWidth || 1280;
    canvas.height = videoEl.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `camera_capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
      this.closeCameraModal();

      // Navigate to Image Analysis section and feed the file
      if (window.TruthShield && window.TruthShield.navigate) {
        window.TruthShield.navigate('image-analysis');
        this.syncBottomNav('image-analysis');
      }

      // Populate file into image input and trigger analysis
      const fileInput = document.getElementById('imageFileInput');
      if (fileInput) {
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInput.files = dt.files;
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, 'image/jpeg', 0.95);
  }

  toggleVideoRecording() {
    const recordBtn = document.getElementById('cameraRecordBtn');
    const videoEl = document.getElementById('cameraPreview');
    if (!videoEl || !this.cameraStream) return;

    if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
      // Start recording
      this.haptic('alert');
      this.recordedChunks = [];
      try {
        const options = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? { mimeType: 'video/webm;codecs=vp9' }
          : { mimeType: 'video/webm' };
        this.mediaRecorder = new MediaRecorder(this.cameraStream, options);
      } catch (e) {
        this.mediaRecorder = new MediaRecorder(this.cameraStream);
      }

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) this.recordedChunks.push(e.data);
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const file = new File([blob], `camera_video_${Date.now()}.webm`, { type: 'video/webm' });
        this.closeCameraModal();

        if (window.TruthShield && window.TruthShield.navigate) {
          window.TruthShield.navigate('video-analysis');
          this.syncBottomNav('video-analysis');
        }

        const videoFileInput = document.getElementById('videoFileInput');
        if (videoFileInput) {
          const dt = new DataTransfer();
          dt.items.add(file);
          videoFileInput.files = dt.files;
          videoFileInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      };

      this.mediaRecorder.start();
      if (recordBtn) {
        recordBtn.classList.add('recording');
        recordBtn.innerHTML = '<i class="fas fa-stop"></i> <span>Stop (Max 10s)</span>';
      }

      // Auto-stop after 10s for fast on-device analysis
      setTimeout(() => {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
          this.mediaRecorder.stop();
        }
      }, 10000);
    } else {
      // Stop recording
      this.haptic('tap');
      this.mediaRecorder.stop();
      if (recordBtn) {
        recordBtn.classList.remove('recording');
        recordBtn.innerHTML = '<i class="fas fa-circle-dot"></i> <span>Record Clip</span>';
      }
    }
  }

  triggerNativeFileCamera(accept = 'image/*') {
    let input = document.getElementById('nativeCameraInput');
    if (!input) {
      input = document.createElement('input');
      input.id = 'nativeCameraInput';
      input.type = 'file';
      input.style.display = 'none';
      document.body.appendChild(input);
    }
    input.accept = accept;
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = e.target.files[0];
      input.value = ''; // Reset input so subsequent captures trigger onchange
      if (!file) return;

      if (file.type.startsWith('image/')) {
        window.TruthShield.navigate('image-analysis');
        this.syncBottomNav('image-analysis');
        const imgInput = document.getElementById('imageFileInput');
        if (imgInput) {
          const dt = new DataTransfer();
          dt.items.add(file);
          imgInput.files = dt.files;
          imgInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      } else if (file.type.startsWith('video/')) {
        window.TruthShield.navigate('video-analysis');
        this.syncBottomNav('video-analysis');
        const vidInput = document.getElementById('videoFileInput');
        if (vidInput) {
          const dt = new DataTransfer();
          dt.items.add(file);
          vidInput.files = dt.files;
          vidInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    };
    input.click();
  }

  // ═══════════════════════════════════════════════
  // 5. NATIVE SHARE TARGET & OUTBOUND SHARE
  // ═══════════════════════════════════════════════

  setupShareTarget() {
    // Check if TruthShield was opened via Android/iOS Share Sheet
    const params = new URLSearchParams(window.location.search);
    const sharedText = params.get('text');
    const sharedUrl = params.get('url');
    const sharedTitle = params.get('title');

    if (sharedText || sharedUrl) {
      console.log('[TruthShield Mobile] Received share target input');
      window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          if (window.TruthShield && window.TruthShield.navigate) {
            window.TruthShield.navigate('text-analysis');
            this.syncBottomNav('text-analysis');
          }

          if (sharedUrl) {
            const urlTab = document.getElementById('tab-enter-url');
            if (urlTab) urlTab.click();
            const urlInput = document.getElementById('urlInput');
            if (urlInput) urlInput.value = sharedUrl;
            if (window.TruthShield && window.TruthShield.analyzeText) {
              window.TruthShield.analyzeText();
            }
          } else if (sharedText) {
            const textTab = document.getElementById('tab-paste-text');
            if (textTab) textTab.click();
            const textInput = document.getElementById('textInput');
            if (textInput) textInput.value = sharedText;
            if (window.TruthShield && window.TruthShield.analyzeText) {
              window.TruthShield.analyzeText();
            }
          }
        }, 800);
      });
    }
  }

  shareVerdict(title, text, url = window.location.href) {
    this.haptic('tap');
    if (navigator.share) {
      navigator.share({
        title: title || 'TruthShield Forensic Verdict',
        text: text || 'Media verified using TruthShield AI Forensics Suite.',
        url: url
      }).catch((err) => {
        if (err.name !== 'AbortError') console.warn('Share error:', err);
      });
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(`${title}\n${text}\nVerified with TruthShield: ${url}`)
        .then(() => {
          if (window.TruthShield && window.TruthShield.toast) {
            window.TruthShield.toast('Forensic summary copied to clipboard!', 'success');
          }
        });
    }
  }

  checkDeepLinks() {
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    const tab = params.get('tab');

    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        if (action === 'camera') {
          this.openCameraModal();
        } else if (tab && window.TruthShield && window.TruthShield.navigate) {
          window.TruthShield.navigate(tab);
          this.syncBottomNav(tab);
        }
      }, 500);
    });
  }
}

// Instantiate globally
window.TruthShieldMobile = new MobileAppManager();
