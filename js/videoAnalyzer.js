/**
 * TruthShield Video Analyzer
 * Extracts frames, analyzes temporal consistency, and detects deepfake artifacts
 */
class VideoAnalyzer {
  constructor() {
    this.frameCount = 10;
  }

  /**
   * Resilient, multi-stage video loader.
   * Handles Android Scoped Storage / ContentProvider stream stalls,
   * mobile autoplay/inline decoding policies, and hardware decoder cold starts on the 1st attempt.
   */
  async loadVideoSource(video, file) {
    if (video.src && video.src.startsWith('blob:')) {
      try { URL.revokeObjectURL(video.src); } catch (e) {}
    }
    video.removeAttribute('src');

    // Configure mobile & media engine attributes
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.preload = 'auto';
    video.crossOrigin = 'anonymous';

    const waitForMetadata = (targetVideo, timeoutMs = 3500) => {
      return new Promise((resolve, reject) => {
        if (targetVideo.readyState >= 1 && (targetVideo.duration > 0 || targetVideo.videoWidth > 0)) {
          resolve();
          return;
        }

        let settled = false;
        let timer = null;

        const onReady = () => {
          if (!settled) {
            settled = true;
            cleanup();
            resolve();
          }
        };

        const onError = (e) => {
          if (!settled) {
            settled = true;
            cleanup();
            const err = targetVideo.error;
            reject(new Error(`Video decode error (code: ${err ? err.code : 'unknown'})`));
          }
        };

        const cleanup = () => {
          if (timer) clearTimeout(timer);
          targetVideo.removeEventListener('loadedmetadata', onReady);
          targetVideo.removeEventListener('loadeddata', onReady);
          targetVideo.removeEventListener('canplay', onReady);
          targetVideo.removeEventListener('durationchange', onReady);
          targetVideo.removeEventListener('error', onError);
        };

        targetVideo.addEventListener('loadedmetadata', onReady);
        targetVideo.addEventListener('loadeddata', onReady);
        targetVideo.addEventListener('canplay', onReady);
        targetVideo.addEventListener('durationchange', onReady);
        targetVideo.addEventListener('error', onError);

        timer = setTimeout(() => {
          if (!settled) {
            if (targetVideo.readyState >= 1 || targetVideo.duration > 0 || targetVideo.videoWidth > 0) {
              settled = true;
              cleanup();
              resolve();
            } else {
              settled = true;
              cleanup();
              reject(new Error('Video metadata timeout'));
            }
          }
        }, timeoutMs);
      });
    };

    // Strategy 1: URL.createObjectURL directly on file (Fast path)
    let fastUrl = null;
    try {
      fastUrl = URL.createObjectURL(file);
      video.src = fastUrl;
      video.load();
      await waitForMetadata(video, 3000);
      return;
    } catch (err1) {
      console.warn('TruthShield VideoLoader: Fast path URL.createObjectURL failed, falling back to in-memory Blob:', err1);
      if (fastUrl) {
        try { URL.revokeObjectURL(fastUrl); } catch (e) {}
      }
    }

    // Strategy 2: In-Memory Blob buffer (completely avoids Android Scoped Storage / ContentProvider stream stalls)
    try {
      const sliceSize = Math.min(file.size, 80 * 1024 * 1024);
      const buffer = await file.slice(0, sliceSize).arrayBuffer();
      const inMemoryBlob = new Blob([buffer], { type: file.type || 'video/mp4' });
      const memUrl = URL.createObjectURL(inMemoryBlob);
      video.src = memUrl;
      video.load();
      await waitForMetadata(video, 4500);
      return;
    } catch (err2) {
      console.warn('TruthShield VideoLoader: In-memory Blob fallback failed, trying FileReader:', err2);
    }

    // Strategy 3: FileReader DataURL (for videos under 30MB)
    if (file.size < 30 * 1024 * 1024) {
      try {
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error('FileReader failed'));
          reader.readAsDataURL(file);
        });
        video.src = dataUrl;
        video.load();
        await waitForMetadata(video, 4500);
        return;
      } catch (err3) {
        console.warn('TruthShield VideoLoader: FileReader Data URL fallback failed:', err3);
      }
    }

    throw new Error('Failed to load video from storage. Please verify the video format (MP4, WebM, MOV).');
  }

  async analyze(file) {
    const video = document.getElementById('videoPlayer');
    await this.loadVideoSource(video, file);

    const rawDuration = video.duration;
    const duration = (!rawDuration || isNaN(rawDuration) || !isFinite(rawDuration) || rawDuration <= 0) ? 3.0 : rawDuration;
    const frames = await this.extractFrames(video, duration);
    const consistency = this.analyzeFrameConsistency(frames);
    const faceAnalysis = this.analyzeFaceRegions(frames);
    const temporalArtifacts = this.detectTemporalArtifacts(frames);

    // Run Audio Spectrum FFT Analysis (Web Audio API with direct PCM decoding)
    let audioDeepfake = null;
    if (window.AudioDeepfakeDetector) {
      try {
        audioDeepfake = await window.AudioDeepfakeDetector.analyzeAudioTrack(video, file);
      } catch (err) {
        console.warn("AudioDeepfakeDetector audio track warning:", err);
      }
    }

    // Run Facial Landmark & Blinking Stability Detection
    let facialDynamics = null;
    if (window.AudioDeepfakeDetector) {
      try {
        facialDynamics = window.AudioDeepfakeDetector.analyzeFacialLandmarks(frames);
      } catch (err) {
        console.warn("AudioDeepfakeDetector facial dynamics warning:", err);
      }
    }

    // Run Cryptographic C2PA & Header Provenance Suite
    let c2paProvenance = null;
    if (window.ProvenanceSuite) {
      try {
        c2paProvenance = await window.ProvenanceSuite.inspectFileProvenance(file);
      } catch (err) {
        console.warn("ProvenanceSuite inspection warning:", err);
      }
    }

    const audioSync = {
      audioAnalyzed: audioDeepfake ? audioDeepfake.audioAnalyzed : false,
      videoDuration: duration.toFixed(1) + 's',
      framesAnalyzed: frames.length,
      voiceVerdict: audioDeepfake ? audioDeepfake.voiceVerdict : 'Standard audio track profile',
      syntheticVoiceProbability: audioDeepfake ? audioDeepfake.syntheticVoiceProbability : 0.20
    };

    // Run Neural Checks FIRST if MLCore is active (before provenance)
    let temporalStability = null;
    if (window.MLCore && window.MLCore.loaded) {
      try {
        temporalStability = await window.MLCore.analyzeVideoTemporalStability(frames);
      } catch (mlErr) {
        console.warn("MLCore video temporal stability check warning:", mlErr);
      }
    }

    // Calculate deepfake confidence (higher = more likely deepfake)
    const consistencyScore = consistency.score;
    const faceScore = faceAnalysis.score;
    const temporalScore = temporalArtifacts.score;
    const consistencyRisk = 100 - consistencyScore;
    const faceRisk = 100 - faceScore;
    const temporalRisk = 100 - temporalScore;
    const voiceRisk = audioDeepfake ? Math.round(audioDeepfake.syntheticVoiceProbability * 100) : 20;
    const facialMorphRisk = facialDynamics ? Math.round((1 - facialDynamics.facialStabilityScore) * 100) : 20;
    const c2paRisk = c2paProvenance ? (c2paProvenance.hasAITag ? 85 : (c2paProvenance.hasC2PAManifest ? 5 : 25)) : 25;

    let deepfakeConfidence;
    if (temporalStability) {
      const neuralTemporalRisk = 100 - temporalStability.stabilityScore;
      const rawDeepfake = (
        neuralTemporalRisk * 0.20 +
        consistencyRisk * 0.15 +
        faceRisk * 0.15 +
        voiceRisk * 0.20 +
        facialMorphRisk * 0.15 +
        c2paRisk * 0.15
      );
      deepfakeConfidence = Math.round(Math.max(0, Math.min(100, rawDeepfake)));
    } else {
      const rawDeepfake = (
        consistencyRisk * 0.20 +
        faceRisk * 0.20 +
        temporalRisk * 0.15 +
        voiceRisk * 0.20 +
        facialMorphRisk * 0.15 +
        c2paRisk * 0.10
      );
      deepfakeConfidence = Math.round(Math.max(0, Math.min(100, rawDeepfake)));
    }

    // Run Provenance detection AFTER neural checks
    let provenance = null;
    if (window.ProvenanceDetector) {
      try {
        provenance = await window.ProvenanceDetector.analyzeVideo(file, consistency);
      } catch (provErr) {
        console.warn("ProvenanceDetector video analysis warning:", provErr);
      }

      // Override provenance scores with neural-enhanced deepfake analysis
      if (provenance && provenance.scores) {
        // Derive authenticity from deepfake confidence (inverse relationship)
        const neuralReal = 100 - deepfakeConfidence;
        const heuristicReal = provenance.scores.raw;
        
        // Weighted blend: 60% neural, 40% heuristic
        const blendedReal = Math.round(neuralReal * 0.6 + heuristicReal * 0.4);
        const blendedFake = 100 - blendedReal;
        
        // Redistribute fake portion between edit and ai using heuristic ratios
        const heuristicFakeTotal = provenance.scores.edit + provenance.scores.ai;
        let newEdit, newAi;
        if (heuristicFakeTotal > 0) {
          newEdit = Math.round(blendedFake * (provenance.scores.edit / heuristicFakeTotal));
          newAi = blendedFake - newEdit;
        } else {
          newEdit = Math.round(blendedFake * 0.5);
          newAi = blendedFake - newEdit;
        }
        
        provenance.scores = {
          raw: blendedReal,
          edit: Math.max(0, newEdit),
          ai: Math.max(0, newAi)
        };
      }
    }

    let verdict, verdictClass;
    if (deepfakeConfidence <= 25) { verdict = 'Likely Authentic'; verdictClass = 'success'; }
    else if (deepfakeConfidence <= 50) { verdict = 'Low Risk'; verdictClass = 'warning'; }
    else if (deepfakeConfidence <= 75) { verdict = 'Suspicious'; verdictClass = 'warning'; }
    else { verdict = 'Likely Deepfake'; verdictClass = 'danger'; }

    // Generate flags
    const flags = this.generateFlags(consistency, faceAnalysis, temporalArtifacts, deepfakeConfidence);

    if (audioDeepfake) {
      if (audioDeepfake.syntheticVoiceProbability > 0.60) {
        flags.push({
          type: 'danger',
          icon: 'fas fa-microphone-slash',
          text: `${audioDeepfake.voiceVerdict} (Spectral ratio: ${audioDeepfake.highFreqRatio})`
        });
      } else {
        flags.push({
          type: 'success',
          icon: 'fas fa-waveform-lines',
          text: `Audio FFT Analysis: ${audioDeepfake.voiceVerdict}`
        });
      }
    }

    if (facialDynamics) {
      if (facialDynamics.facialMorphingDetected) {
        flags.push({
          type: 'danger',
          icon: 'fas fa-face-viewfinder',
          text: `${facialDynamics.verdict} (Facial stability: ${Math.round(facialDynamics.facialStabilityScore * 100)}%, Blinking variance: ${facialDynamics.blinkRhythmVariance})`
        });
      } else {
        flags.push({
          type: 'success',
          icon: 'fas fa-face-smile',
          text: `Facial dynamics & eye blinking rhythm within natural physiological boundaries.`
        });
      }
    }

    if (c2paProvenance) {
      if (c2paProvenance.hasC2PAManifest) {
        flags.push({
          type: 'success',
          icon: 'fas fa-certificate',
          text: `C2PA Video Provenance Manifest validated intact.`
        });
      }
      if (c2paProvenance.hasAITag) {
        const sigNames = c2paProvenance.detectedSignatures.map(s => s.name).join(', ');
        flags.push({
          type: 'danger',
          icon: 'fas fa-film',
          text: `Binary metadata signatures match AI video synthesis / voice model: ${sigNames}.`
        });
      }
    }

    if (temporalStability) {
      if (temporalStability.stabilityScore < 75) {
        flags.push({
          type: 'danger',
          icon: 'fas fa-dna',
          text: `Neural Temporal Stability is low (${temporalStability.stabilityScore}%). Class predictions flicker significantly across frames—common in deepfakes.`
        });
      } else {
        flags.push({
          type: 'success',
          icon: 'fas fa-circle-check',
          text: `Neural Temporal Stability check passed (${temporalStability.stabilityScore}% prediction consistency).`
        });
      }
    }

    return {
      deepfakeConfidence, verdict, verdictClass, duration: duration.toFixed(1),
      fileSize: this.formatSize(file.size),
      frames, consistency, faceAnalysis, temporalArtifacts, audioSync,
      temporalStability, audioDeepfake, facialDynamics, c2paProvenance, provenance,
      flags
    };
  }

  async extractFrames(video, duration) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const frames = [];

    // Ensure valid width & aspect ratio
    let vidW = video.videoWidth;
    let vidH = video.videoHeight;

    if (!vidW || vidW <= 0 || isNaN(vidW)) {
      // Short delay if hardware decoder is initializing dimensions
      await new Promise(r => setTimeout(r, 200));
      vidW = video.videoWidth || 640;
      vidH = video.videoHeight || 480;
    }

    const targetWidth = 320;
    const aspect = (vidW > 0 && vidH > 0) ? (vidH / vidW) : 0.75;
    canvas.width = targetWidth;
    canvas.height = Math.round(targetWidth * aspect);

    for (let i = 0; i < this.frameCount; i++) {
      const time = (duration * (i + 0.5)) / this.frameCount;
      
      try {
        video.currentTime = Math.min(time, Math.max(0, duration - 0.1));
      } catch (e) {
        console.warn('Video seek warning:', e);
      }

      await new Promise(resolve => {
        let timer = null;
        const onSeeked = () => {
          if (timer) clearTimeout(timer);
          video.removeEventListener('seeked', onSeeked);
          resolve();
        };
        video.addEventListener('seeked', onSeeked);
        timer = setTimeout(onSeeked, 800); // 800ms safety timeout prevents infinite hang
      });

      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      } catch (drawErr) {
        console.warn('Frame drawImage warning:', drawErr);
        // Fallback: draw dark neutral frame
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      let imageData;
      try {
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      } catch (imgDataErr) {
        imageData = ctx.createImageData(canvas.width, canvas.height);
      }

      frames.push({
        time: time.toFixed(2),
        imageData,
        dataUrl: canvas.toDataURL('image/jpeg', 0.8),
        stats: this.getFrameStats(imageData)
      });
    }

    return frames;
  }

  getFrameStats(imageData) {
    const data = imageData.data;
    let rSum = 0, gSum = 0, bSum = 0, brightness = 0;
    const pixelCount = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      rSum += data[i];
      gSum += data[i + 1];
      bSum += data[i + 2];
      brightness += (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
    }

    return {
      avgR: rSum / pixelCount,
      avgG: gSum / pixelCount,
      avgB: bSum / pixelCount,
      brightness: brightness / pixelCount
    };
  }

  analyzeFrameConsistency(frames) {
    if (frames.length < 2) return { score: 50, details: [] };

    const details = [];
    let totalDiff = 0;
    let maxDiff = 0;
    const brightnessValues = frames.map(f => f.stats.brightness);

    for (let i = 1; i < frames.length; i++) {
      const prev = frames[i - 1].stats;
      const curr = frames[i].stats;

      const colorDiff = Math.abs(prev.avgR - curr.avgR) + Math.abs(prev.avgG - curr.avgG) + Math.abs(prev.avgB - curr.avgB);
      const brightDiff = Math.abs(prev.brightness - curr.brightness);

      totalDiff += colorDiff;
      maxDiff = Math.max(maxDiff, colorDiff);

      details.push({
        frame: i,
        time: frames[i].time,
        colorDiff: colorDiff.toFixed(1),
        brightDiff: brightDiff.toFixed(1),
        suspicious: colorDiff > 60 || brightDiff > 30
      });
    }

    const avgDiff = totalDiff / (frames.length - 1);

    // Check brightness variance
    const avgBright = brightnessValues.reduce((a, b) => a + b, 0) / brightnessValues.length;
    let brightVar = 0;
    brightnessValues.forEach(b => brightVar += (b - avgBright) ** 2);
    brightVar = Math.sqrt(brightVar / brightnessValues.length);

    // Score: high consistency = high score = likely authentic
    let score;
    if (avgDiff < 20 && brightVar < 10) score = 85;
    else if (avgDiff < 40 && brightVar < 20) score = 70;
    else if (avgDiff < 80) score = 50;
    else score = 30;

    return { score, avgDiff: avgDiff.toFixed(1), maxDiff: maxDiff.toFixed(1), brightVar: brightVar.toFixed(1), details };
  }

  analyzeFaceRegions(frames) {
    // Simulate face region analysis by checking skin-tone pixel consistency
    const skinToneData = [];

    frames.forEach((frame, idx) => {
      const data = frame.imageData.data;
      let skinPixels = 0;
      let totalSkinR = 0, totalSkinG = 0, totalSkinB = 0;
      const pixelCount = data.length / 4;

      for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel for speed
        const r = data[i], g = data[i + 1], b = data[i + 2];
        // Simple skin detection in RGB
        if (r > 95 && g > 40 && b > 20 && r > g && r > b &&
          Math.abs(r - g) > 15 && r - b > 15) {
          skinPixels++;
          totalSkinR += r;
          totalSkinG += g;
          totalSkinB += b;
        }
      }

      const sampleCount = pixelCount / 4;
      const skinRatio = skinPixels / sampleCount;

      skinToneData.push({
        frame: idx,
        skinRatio: (skinRatio * 100).toFixed(1),
        avgTone: skinPixels > 0 ? {
          r: (totalSkinR / skinPixels).toFixed(0),
          g: (totalSkinG / skinPixels).toFixed(0),
          b: (totalSkinB / skinPixels).toFixed(0)
        } : null
      });
    });

    // Check consistency of skin tones across frames
    const withSkin = skinToneData.filter(d => d.avgTone);
    let skinConsistency = 80;
    if (withSkin.length >= 2) {
      let maxToneDiff = 0;
      for (let i = 1; i < withSkin.length; i++) {
        const diff = Math.abs(withSkin[i].avgTone.r - withSkin[i - 1].avgTone.r) +
          Math.abs(withSkin[i].avgTone.g - withSkin[i - 1].avgTone.g) +
          Math.abs(withSkin[i].avgTone.b - withSkin[i - 1].avgTone.b);
        maxToneDiff = Math.max(maxToneDiff, diff);
      }
      if (maxToneDiff > 60) skinConsistency = 30;
      else if (maxToneDiff > 30) skinConsistency = 50;
      else if (maxToneDiff > 15) skinConsistency = 65;
    }

    return {
      score: skinConsistency,
      skinData: skinToneData,
      hasFaceRegions: withSkin.length > 0,
      details: [
        { label: 'Frames with skin tones', value: `${withSkin.length}/${frames.length}` },
        { label: 'Skin tone consistency', value: `${skinConsistency}%` },
        { label: 'Avg skin coverage', value: `${(skinToneData.reduce((a, d) => a + parseFloat(d.skinRatio), 0) / skinToneData.length).toFixed(1)}%` }
      ]
    };
  }

  detectTemporalArtifacts(frames) {
    if (frames.length < 3) return { score: 70, anomalies: [] };

    const anomalies = [];
    // Check for sudden jumps in frame statistics
    for (let i = 1; i < frames.length - 1; i++) {
      const prev = frames[i - 1].stats;
      const curr = frames[i].stats;
      const next = frames[i + 1].stats;

      // Check if current frame is significantly different from both neighbors
      const diffPrev = Math.abs(curr.brightness - prev.brightness);
      const diffNext = Math.abs(curr.brightness - next.brightness);
      const neighborDiff = Math.abs(prev.brightness - next.brightness);

      if (diffPrev > 20 && diffNext > 20 && neighborDiff < 10) {
        anomalies.push({
          frame: i,
          time: frames[i].time,
          type: 'brightness_spike',
          description: `Sudden brightness change at frame ${i + 1} (t=${frames[i].time}s)`
        });
      }

      // Check color shift
      const colorShift = Math.abs(curr.avgR - prev.avgR) + Math.abs(curr.avgG - prev.avgG) + Math.abs(curr.avgB - prev.avgB);
      if (colorShift > 80) {
        anomalies.push({
          frame: i,
          time: frames[i].time,
          type: 'color_shift',
          description: `Abnormal color shift at frame ${i + 1} (shift: ${colorShift.toFixed(0)})`
        });
      }
    }

    const score = anomalies.length === 0 ? 85 :
      anomalies.length <= 2 ? 60 :
        anomalies.length <= 4 ? 40 : 20;

    return { score, anomalies };
  }

  analyzeAudioSync(duration, frameCount) {
    // Note: Full audio-visual sync requires Web Audio API analysis
    return {
      note: 'Full audio-lip sync analysis requires advanced ML models',
      videoDuration: duration.toFixed(1) + 's',
      framesAnalyzed: frameCount,
      recommendation: 'For comprehensive audio analysis, use dedicated deepfake detection APIs'
    };
  }

  generateFlags(consistency, face, temporal, confidence) {
    const flags = [];

    if (confidence > 70) {
      flags.push({ type: 'danger', icon: 'fas fa-robot', text: 'High deepfake confidence detected. Multiple analysis dimensions show suspicious patterns.' });
    } else if (confidence > 40) {
      flags.push({ type: 'warning', icon: 'fas fa-robot', text: 'Moderate deepfake indicators present. Manual review recommended.' });
    } else {
      flags.push({ type: 'success', icon: 'fas fa-check-circle', text: 'Low deepfake probability. Video appears consistent across analyzed frames.' });
    }

    if (consistency.score < 50) {
      flags.push({ type: 'warning', icon: 'fas fa-chart-line', text: `Frame consistency is low (${consistency.avgDiff} avg color difference). Possible splicing or manipulation.` });
    }

    if (face.score < 50) {
      flags.push({ type: 'warning', icon: 'fas fa-face-grin-beam', text: 'Skin tone inconsistencies detected across frames — common in face-swap deepfakes.' });
    }

    temporal.anomalies.forEach(a => {
      flags.push({ type: 'warning', icon: 'fas fa-bolt', text: a.description });
    });

    return flags;
  }

  formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }
}

window.VideoAnalyzerEngine = VideoAnalyzer;
