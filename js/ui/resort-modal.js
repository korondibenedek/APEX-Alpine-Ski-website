/* ═══════════════════════════════════════════════════════════════════
   resort-modal.js — Real-World Ski Resort Library & AI Image Importer
   ═══════════════════════════════════════════════════════════════════
   Features:
   - Preset catalog search with instant 1-click loading
   - 📸 Image-based Resort Generator (Gemini Multimodal Vision & Offline CV)
   - Drag-and-drop / file upload support for PNG, JPG, WEBP maps
   - Custom resort management (persistent storage, delete, badges)
   ═══════════════════════════════════════════════════════════════════ */

import {
  getAllPresets,
  searchPresetResorts,
  generateProceduralResort,
  generateResortFromImage,
  getCustomResorts,
  deleteCustomResort,
  extractResortNameFromFilename,
  applyResort,
  getActiveResortId
} from '../data/resort-loader.js';
import { REAL_RESORTS } from '../data/resorts-db.js';
import { activeResortMeta } from '../data/resort-graph.js';

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function renderResortsList(container, { activeId, resorts = null, onSelectResort, onDeleteResort }) {
  if (!container) return;
  const list = resorts || getAllPresets();

  if (list.length === 0) {
    container.innerHTML = `
      <div class="col-span-2 py-8 text-center text-xs font-mono text-hud-text/40 border border-dashed border-hud-border/40 rounded-xl">
        Nincs találat a keresési feltételekre.
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(resort => {
    const isActive = resort.id === activeId;
    const runsCount = resort.edges.filter(e => e.type !== 'lift').length;
    const liftsCount = resort.edges.filter(e => e.type === 'lift').length;
    const isCustom = resort.sourceImage || (resort.id && (resort.id.startsWith('img_') || resort.id.startsWith('custom_') || resort.id.startsWith('proc_')));

    let badgeHtml = '';
    if (resort.sourceMode === 'gemini-vision') {
      badgeHtml = '<span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">✨ GEMINI VISION</span>';
    } else if (resort.sourceImage) {
      badgeHtml = '<span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-hud-cyan/20 text-hud-cyan border border-hud-cyan/40 font-bold">📸 KÉPBŐL GENERÁLVA</span>';
    }

    return `
      <div class="resort-card p-3 rounded-xl border ${isActive ? 'border-hud-cyan bg-hud-cyan/15 shadow-lg shadow-hud-cyan/10' : 'border-hud-border/70 bg-hud-bg/70 hover:border-hud-cyan/50 hover:bg-hud-card/80'} transition cursor-pointer flex flex-col justify-between" data-resort-id="${resort.id}">
        <div>
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-bold text-white flex items-center gap-1.5 truncate max-w-[200px]">
              <span>${resort.flag || '🏔️'}</span>
              <span class="truncate">${resort.name}</span>
            </span>
            <div class="flex items-center gap-1.5">
              ${badgeHtml}
              ${isCustom ? `
                <button class="btn-delete-resort text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/30 border border-red-500/30 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 transition cursor-pointer" title="Félrement? Generált síterep törlése" data-resort-id="${resort.id}">
                  <span class="text-xs">🗑️</span>
                  <span class="hidden sm:inline">TÖRLÉS</span>
                </button>
              ` : ''}
              ${isActive
                ? '<span class="text-[9px] font-mono px-2 py-0.5 rounded bg-hud-cyan text-black font-extrabold uppercase">AKTÍV</span>'
                : `<button class="btn-load-resort text-[10px] font-mono px-2.5 py-0.5 rounded border border-hud-cyan/40 bg-hud-cyan/10 text-hud-cyan hover:bg-hud-cyan/30 hover:border-hud-cyan transition font-bold" data-resort-id="${resort.id}">BETÖLTÉS</button>`
              }
            </div>
          </div>
          <p class="text-[10px] text-hud-text/60 line-clamp-1 mb-1.5 font-mono">${resort.country}</p>
          <p class="text-[10px] text-hud-text/50 line-clamp-2 mb-2 leading-relaxed">${resort.description || ''}</p>
        </div>
        <div class="flex items-center justify-between text-[10px] font-mono text-hud-text/50 pt-2 border-t border-hud-border/30">
          <span>CSÚCS: <b class="text-white">${resort.altitude}m</b></span>
          <span>ÁLLOMÁS: <b class="text-white">${Object.keys(resort.nodes).length}</b></span>
          <span>PÁLYÁK: <b class="text-hud-cyan">${runsCount}</b></span>
          <span>LIFTEK: <b class="text-yellow-400">${liftsCount}</b></span>
        </div>
      </div>
    `;
  }).join('');

  // Attach delete handlers
  container.querySelectorAll('.btn-delete-resort').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.resortId;
      if (id && onDeleteResort) {
        onDeleteResort(id);
      }
    });
  });

  // Attach select handlers
  container.querySelectorAll('.resort-card, .btn-load-resort').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.btn-delete-resort')) return;
      const card = el.closest('.resort-card');
      const id = card?.dataset?.resortId;
      if (id && onSelectResort) {
        onSelectResort(id);
      }
    });
  });

  if (typeof window !== 'undefined' && window.lucide) {
    window.lucide.createIcons();
  }
}

export function initResortSearchUI({
  resortModal,
  resortSearchInput,
  resortsListContainer,
  btnAiGenerateResort,
  resortStatusMessage,
  onResortChanged
}) {
  let selectedCountry = 'all';
  let currentSelectedFile = null;

  // DOM Elements
  const tabBtnResortList = document.getElementById('tabBtnResortList');
  const tabBtnResortImage = document.getElementById('tabBtnResortImage');
  const tabContentResortList = document.getElementById('tabContentResortList');
  const tabContentResortImage = document.getElementById('tabContentResortImage');

  const imageDropZone = document.getElementById('imageDropZone');
  const resortImageFileInput = document.getElementById('resortImageFileInput');
  const dropZonePrompt = document.getElementById('dropZonePrompt');
  const imagePreviewContainer = document.getElementById('imagePreviewContainer');
  const imagePreviewThumb = document.getElementById('imagePreviewThumb');
  const imageFileName = document.getElementById('imageFileName');
  const imageFileSize = document.getElementById('imageFileSize');
  const btnRemoveImage = document.getElementById('btnRemoveImage');
  const resortCustomNameInput = document.getElementById('resortCustomNameInput');
  const resortCustomCountryInput = document.getElementById('resortCustomCountryInput');
  const btnBuildFromImage = document.getElementById('btnBuildFromImage');
  const imageBuildProgress = document.getElementById('imageBuildProgress');
  const imageBuildStatusText = document.getElementById('imageBuildStatusText');
  const imageModeText = document.getElementById('imageModeText');
  const imageKeyBadge = document.getElementById('imageKeyBadge');

  const activeGeneratedResortBox = document.getElementById('activeGeneratedResortBox');
  const activeGenName = document.getElementById('activeGenName');
  const btnDeleteActiveGenerated = document.getElementById('btnDeleteActiveGenerated');

  const updateActiveGeneratedBox = () => {
    const activeId = getActiveResortId();
    const isCustom = activeId.startsWith('img_') || activeId.startsWith('custom_') || activeId.startsWith('proc_') || getCustomResorts().some(r => r.id === activeId);

    if (isCustom && activeGeneratedResortBox) {
      activeGeneratedResortBox.classList.remove('hidden');
      if (activeGenName) {
        activeGenName.textContent = activeResortMeta.name || activeId;
      }
    } else if (activeGeneratedResortBox) {
      activeGeneratedResortBox.classList.add('hidden');
    }
  };

  // Filter & Render Presets
  const filterAndRender = () => {
    const activeId = getActiveResortId();
    const query = (resortSearchInput?.value || '').trim().toLowerCase();
    let presets = getAllPresets();

    // 1. Country filter
    if (selectedCountry !== 'all') {
      const regex = new RegExp(selectedCountry, 'i');
      presets = presets.filter(p => regex.test(p.country) || regex.test(p.name));
    }

    // 2. Query filter
    if (query) {
      presets = presets.filter(r => (
        r.name.toLowerCase().includes(query) ||
        (r.country && r.country.toLowerCase().includes(query)) ||
        r.id.toLowerCase().includes(query) ||
        (r.nodes && Object.values(r.nodes).some(n => n.name && n.name.toLowerCase().includes(query)))
      ));
    }

    renderResortsList(resortsListContainer, {
      activeId,
      resorts: presets,
      onSelectResort: (id) => handleSelectResort(id),
      onDeleteResort: (id) => handleDeleteResort(id)
    });

    updateActiveGeneratedBox();

    // Handle custom resort generation button
    if (btnAiGenerateResort) {
      if (query && presets.length === 0) {
        btnAiGenerateResort.classList.remove('hidden');
        const spanTarget = btnAiGenerateResort.querySelector('.ai-target-resort');
        if (spanTarget) spanTarget.textContent = query;
      } else {
        btnAiGenerateResort.classList.add('hidden');
      }
    }
  };

  const handleSelectResort = (resortId) => {
    const presets = getAllPresets();
    const target = presets.find(p => p.id === resortId);
    if (target) {
      applyResort(target);
      resortModal?.classList.add('hidden');
      if (onResortChanged) onResortChanged(target);
      updateActiveGeneratedBox();
    }
  };

  const handleDeleteResort = (resortId) => {
    const presets = getAllPresets();
    const target = presets.find(p => p.id === resortId);
    const targetName = target ? target.name : 'generált';

    if (confirm(`Félrement a generálás? Biztosan törölni szeretnéd a(z) "${targetName}" síterepet?\n(A rendszer azonnal visszaállítja az eredeti Mount Apex terepet.)`)) {
      const activeId = getActiveResortId();
      const wasActive = (activeId === resortId);

      deleteCustomResort(resortId);

      if (wasActive) {
        const fallback = REAL_RESORTS.mountApex;
        applyResort(fallback);
        if (onResortChanged) {
          onResortChanged(fallback);
        }
      }

      filterAndRender();
      updateActiveGeneratedBox();
    }
  };

  btnDeleteActiveGenerated?.addEventListener('click', () => {
    const activeId = getActiveResortId();
    if (activeId) {
      handleDeleteResort(activeId);
    }
  });

  // Instant 100% offline procedural import for custom text queries
  const handleInstantImportCustom = () => {
    const query = (resortSearchInput?.value || '').trim();
    if (!query) return;

    const generated = generateProceduralResort(query);
    applyResort(generated);
    resortModal?.classList.add('hidden');
    if (onResortChanged) onResortChanged(generated);
  };

  // Tab switching
  const switchTab = (tab) => {
    if (tab === 'image') {
      tabBtnResortList?.classList.remove('border-hud-cyan', 'text-hud-cyan', 'font-bold');
      tabBtnResortList?.classList.add('border-transparent', 'text-hud-text/60');
      tabBtnResortImage?.classList.add('border-hud-cyan', 'text-hud-cyan', 'font-bold');
      tabBtnResortImage?.classList.remove('border-transparent', 'text-hud-text/60');

      tabContentResortList?.classList.add('hidden');
      tabContentResortImage?.classList.remove('hidden');
      updateImageModeIndicator();
      updateActiveGeneratedBox();
    } else {
      tabBtnResortImage?.classList.remove('border-hud-cyan', 'text-hud-cyan', 'font-bold');
      tabBtnResortImage?.classList.add('border-transparent', 'text-hud-text/60');
      tabBtnResortList?.classList.add('border-hud-cyan', 'text-hud-cyan', 'font-bold');
      tabBtnResortList?.classList.remove('border-transparent', 'text-hud-text/60');

      tabContentResortImage?.classList.add('hidden');
      tabContentResortList?.classList.remove('hidden');
      filterAndRender();
    }
    if (typeof window !== 'undefined' && window.lucide) {
      window.lucide.createIcons();
    }
  };

  const updateImageModeIndicator = () => {
    const geminiKey = (typeof localStorage !== 'undefined' && localStorage.getItem('apex_gemini_key')) || '';
    if (geminiKey.trim()) {
      if (imageKeyBadge) {
        imageKeyBadge.textContent = '✨ GEMINI VISION AI AKTÍV';
        imageKeyBadge.className = 'text-hud-cyan font-bold';
      }
      if (imageModeText) imageModeText.textContent = 'Multimodális Képelemzés és Helyszínfelismerés';
    } else {
      if (imageKeyBadge) {
        imageKeyBadge.textContent = '⚡ OFFLINE CV MOTOR AKTÍV';
        imageKeyBadge.className = 'text-hud-green font-bold';
      }
      if (imageModeText) imageModeText.textContent = '100% Offline Képelemző (Nincs szükség API kulcsra)';
    }
  };

  // File Upload & Preview
  const setFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Kérlek érvényes képfájlt válassz (PNG, JPG, WEBP)!');
      return;
    }
    currentSelectedFile = file;

    if (dropZonePrompt) dropZonePrompt.classList.add('hidden');
    if (imagePreviewContainer) imagePreviewContainer.classList.remove('hidden');

    if (imagePreviewThumb) {
      const objectUrl = URL.createObjectURL(file);
      imagePreviewThumb.src = objectUrl;
    }
    if (imageFileName) imageFileName.textContent = file.name;
    if (imageFileSize) imageFileSize.textContent = formatBytes(file.size);

    // Auto-prefill custom name from filename if empty
    if (resortCustomNameInput && !resortCustomNameInput.value.trim()) {
      const inferred = extractResortNameFromFilename(file.name);
      if (inferred) resortCustomNameInput.value = inferred;
    }

    if (btnBuildFromImage) {
      btnBuildFromImage.disabled = false;
    }
    if (typeof window !== 'undefined' && window.lucide) {
      window.lucide.createIcons();
    }
  };

  const clearFile = () => {
    currentSelectedFile = null;
    if (resortImageFileInput) resortImageFileInput.value = '';
    if (imagePreviewThumb) imagePreviewThumb.src = '';
    if (imagePreviewContainer) imagePreviewContainer.classList.add('hidden');
    if (dropZonePrompt) dropZonePrompt.classList.remove('hidden');
    if (btnBuildFromImage) btnBuildFromImage.disabled = true;
    if (typeof window !== 'undefined' && window.lucide) {
      window.lucide.createIcons();
    }
  };

  // Wire up tabs
  tabBtnResortList?.addEventListener('click', () => switchTab('list'));
  tabBtnResortImage?.addEventListener('click', () => switchTab('image'));

  // Wire up file picker & drop zone
  imageDropZone?.addEventListener('click', (e) => {
    if (e.target === btnRemoveImage || btnRemoveImage?.contains(e.target)) return;
    resortImageFileInput?.click();
  });

  resortImageFileInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) setFile(file);
  });

  btnRemoveImage?.addEventListener('click', (e) => {
    e.stopPropagation();
    clearFile();
  });

  // Drag-and-drop
  ['dragenter', 'dragover'].forEach(eventName => {
    imageDropZone?.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      imageDropZone.classList.add('border-hud-cyan', 'bg-hud-cyan/15');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    imageDropZone?.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      imageDropZone.classList.remove('border-hud-cyan', 'bg-hud-cyan/15');
    });
  });

  imageDropZone?.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const file = dt?.files?.[0];
    if (file) setFile(file);
  });

  // Build from Image Action
  btnBuildFromImage?.addEventListener('click', async () => {
    if (!currentSelectedFile) return;

    const customName = (resortCustomNameInput?.value || '').trim();
    const customCountry = (resortCustomCountryInput?.value || '').trim();

    btnBuildFromImage.disabled = true;
    if (imageBuildProgress) {
      imageBuildProgress.classList.remove('hidden');
      if (imageBuildStatusText) {
        imageBuildStatusText.textContent = 'Kép elemzése, kontúrok és csúcsok felismerése...';
      }
    }

    try {
      const resort = await generateResortFromImage(currentSelectedFile, customName, customCountry);

      if (imageBuildStatusText) {
        const modeLabel = resort.sourceMode === 'gemini-vision' ? 'Gemini AI Vision' : 'Offline CV';
        imageBuildStatusText.textContent = `✅ Sikeres felismerés (${modeLabel})! Terep betöltése...`;
      }

      applyResort(resort);

      if (onResortChanged) {
        onResortChanged(resort);
      }

      setTimeout(() => {
        switchTab('list');
        filterAndRender();
        if (imageBuildProgress) imageBuildProgress.classList.add('hidden');
        btnBuildFromImage.disabled = false;
        resortModal?.classList.add('hidden');
      }, 700);

    } catch (err) {
      console.error('Image resort generation failed:', err);
      if (imageBuildStatusText) {
        imageBuildStatusText.textContent = `Hiba a generálás során: ${err.message || 'Ismeretlen hiba'}`;
      }
      btnBuildFromImage.disabled = false;
    }
  });

  // Setup Country Filter Buttons
  const countryFilterButtons = document.querySelectorAll('.resort-filter-btn');
  countryFilterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      countryFilterButtons.forEach(b => {
        b.classList.remove('active', 'border-hud-cyan', 'bg-hud-cyan/20', 'text-hud-cyan', 'font-bold');
        b.classList.add('border-hud-border', 'bg-hud-card/60', 'text-hud-text/70');
      });
      btn.classList.add('active', 'border-hud-cyan', 'bg-hud-cyan/20', 'text-hud-cyan', 'font-bold');
      btn.classList.remove('border-hud-border', 'bg-hud-card/60', 'text-hud-text/70');
      selectedCountry = btn.dataset.country || 'all';
      filterAndRender();
    });
  });

  // Search input live filtering
  resortSearchInput?.addEventListener('input', () => {
    filterAndRender();
  });

  resortSearchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = (resortSearchInput?.value || '').trim();
      const matched = searchPresetResorts(query);
      if (matched.length > 0) {
        handleSelectResort(matched[0].id);
      } else if (query) {
        handleInstantImportCustom();
      }
    }
  });

  btnAiGenerateResort?.addEventListener('click', handleInstantImportCustom);

  return {
    refreshList: (text = '') => {
      selectedCountry = 'all';
      countryFilterButtons.forEach((b, idx) => {
        if (idx === 0) {
          b.classList.add('active', 'border-hud-cyan', 'bg-hud-cyan/20', 'text-hud-cyan', 'font-bold');
        } else {
          b.classList.remove('active', 'border-hud-cyan', 'bg-hud-cyan/20', 'text-hud-cyan', 'font-bold');
          b.classList.add('border-hud-border', 'bg-hud-card/60', 'text-hud-text/70');
        }
      });
      if (resortSearchInput) resortSearchInput.value = text;
      updateImageModeIndicator();
      filterAndRender();
    },
    switchTab
  };
}
