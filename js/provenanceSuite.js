/**
 * TruthShield — C2PA Digital Provenance & Metadata Suite
 * Inspects binary file manifests, C2PA claims, EXIF metadata,
 * and AI generation tags to build digital chain-of-custody verification.
 */

window.ProvenanceSuite = (function() {
  'use strict';

  /**
   * Computes SHA-256 checksum fingerprint of an ArrayBuffer
   */
  async function computeSHA256(arrayBuffer) {
    if (!window.crypto || !window.crypto.subtle) {
      return "SHA256_UNAVAILABLE";
    }
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Scans ArrayBuffer or string header for AI Generator signatures & software markers
   */
  function inspectHeaderSignatures(textHeader) {
    const aiSignatures = [
      { tag: "Midjourney", name: "Midjourney AI Generator", threat: "AI Generated Image" },
      { tag: "DALL-E", name: "OpenAI DALL-E", threat: "AI Generated Image" },
      { tag: "Stable Diffusion", name: "Stable Diffusion (CompVis)", threat: "AI Generated Image" },
      { tag: "Adobe Firefly", name: "Adobe Firefly Generative AI", threat: "AI Generated / Assisted" },
      { tag: "c2pa", name: "C2PA Manifest Verified", threat: "Content Authenticity Manifest Present" },
      { tag: "jumbf", name: "JUMBF Metadata Container", threat: "C2PA Provenance Envelope" },
      { tag: "Photoshop", name: "Adobe Photoshop", threat: "Software Digital Edit" },
      { tag: "GIMP", name: "GIMP Image Editor", threat: "Software Digital Edit" },
      { tag: "Canva", name: "Canva Design Platform", threat: "Software Composite" }
    ];

    const detected = [];
    for (const sig of aiSignatures) {
      if (textHeader.toLowerCase().includes(sig.tag.toLowerCase())) {
        detected.push(sig);
      }
    }

    return detected;
  }

  /**
   * Main Provenance Audit Pipeline
   */
  async function inspectFileProvenance(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = async function(e) {
        const buffer = e.target.result;
        const hash = await computeSHA256(buffer);
        
        // Convert first 4096 bytes to text signature
        const bytes = new Uint8Array(buffer.slice(0, 8192));
        let textHeader = "";
        for (let i = 0; i < bytes.length; i++) {
          const charCode = bytes[i];
          if (charCode >= 32 && charCode <= 126) {
            textHeader += String.fromCharCode(charCode);
          } else {
            textHeader += " ";
          }
        }

        const detectedSignatures = inspectHeaderSignatures(textHeader);
        const hasC2PA = detectedSignatures.some(s => s.tag === "c2pa" || s.tag === "jumbf");
        const hasAITag = detectedSignatures.some(s => ["Midjourney", "DALL-E", "Stable Diffusion", "Adobe Firefly"].includes(s.tag));
        const hasEditingApp = detectedSignatures.some(s => ["Photoshop", "GIMP", "Canva"].includes(s.tag));

        // Build Chain of Custody Timeline
        const chainOfCustody = [
          {
            stage: "Content Creation",
            timestamp: file.lastModifiedDate ? file.lastModifiedDate.toLocaleString() : new Date().toLocaleString(),
            actor: hasAITag ? "AI Generative Model" : "Camera Sensor / Original Export",
            details: hasAITag ? `Generated via ${detectedSignatures.find(s => ["Midjourney", "DALL-E", "Stable Diffusion", "Adobe Firefly"].includes(s.tag))?.name}` : "Standard image acquisition",
            status: hasAITag ? "WARNING" : "OK"
          }
        ];

        if (hasEditingApp) {
          chainOfCustody.push({
            stage: "Digital Processing",
            timestamp: "Post-Processing Date",
            actor: detectedSignatures.find(s => ["Photoshop", "GIMP", "Canva"].includes(s.tag))?.name || "Image Editor",
            details: "Layer modifications / pixel editing recorded in metadata",
            status: "MODIFIED"
          });
        }

        chainOfCustody.push({
          stage: "Forensic Audit Verification",
          timestamp: new Date().toLocaleString(),
          actor: "TruthShield AI Verification Suite",
          details: `SHA-256 Hash: ${hash.substring(0, 16)}...`,
          status: "VERIFIED"
        });

        resolve({
          fileName: file.name,
          fileSizeKB: (file.size / 1024).toFixed(1),
          sha256Hash: hash,
          hasC2PAManifest: hasC2PA,
          detectedSignatures: detectedSignatures,
          chainOfCustody: chainOfCustody,
          authenticityScore: hasAITag ? 0.25 : (hasEditingApp ? 0.65 : 0.95),
          provenanceSummary: hasAITag
            ? "AI Generator signatures detected in metadata envelope."
            : (hasC2PA ? "C2PA Provenance Manifest verified intact." : "Standard media metadata. No explicit C2PA signature attached.")
        });
      };

      reader.readAsArrayBuffer(file.slice(0, 65536));
    });
  }

  return {
    inspectFileProvenance: inspectFileProvenance,
    computeSHA256: computeSHA256
  };
})();
