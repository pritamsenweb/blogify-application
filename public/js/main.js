/**
 * BLOGIFY — CLIENT-SIDE INTERACTIVITY & MICRO-ANIMATIONS
 */

document.addEventListener('DOMContentLoaded', () => {
  initSearchAndFilter();
  initReadingProgressBar();
  initClapButton();
  initShareActions();
  initImageUploadPreview();
  initEditorStats();
  initPasswordToggles();
});

/* --------------------------------------------------------------------------
   1. Live Search & Category Filtering
   -------------------------------------------------------------------------- */
function initSearchAndFilter() {
  const searchInput = document.getElementById('blogSearchInput');
  const cards = document.querySelectorAll('.blog-card');
  const categoryChips = document.querySelectorAll('.category-chip');
  const emptyState = document.getElementById('searchEmptyState');
  const resultsCount = document.getElementById('searchResultCount');
  const featuredCard = document.querySelector('.featured-card');

  if (!searchInput && categoryChips.length === 0) return;

  let activeCategory = 'all';

  function filterBlogs() {
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    let visibleCount = 0;

    cards.forEach(card => {
      const title = (card.getAttribute('data-title') || '').toLowerCase();
      const body = (card.getAttribute('data-body') || '').toLowerCase();
      const author = (card.getAttribute('data-author') || '').toLowerCase();
      const category = (card.getAttribute('data-category') || 'technology').toLowerCase();

      const matchesSearch = !query || title.includes(query) || body.includes(query) || author.includes(query);
      const matchesCategory = activeCategory === 'all' || category === activeCategory;

      if (matchesSearch && matchesCategory) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Also handle featured card if present
    if (featuredCard) {
      if (query.length > 0 || activeCategory !== 'all') {
        featuredCard.style.display = 'none';
      } else {
        featuredCard.style.display = 'block';
      }
    }

    if (resultsCount) {
      resultsCount.textContent = `${visibleCount} ${visibleCount === 1 ? 'article' : 'articles'}`;
    }

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterBlogs);
  }

  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      categoryChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.getAttribute('data-category') || 'all';
      filterBlogs();
    });
  });
}

/* --------------------------------------------------------------------------
   2. Reading Progress Bar
   -------------------------------------------------------------------------- */
function initReadingProgressBar() {
  const progressBar = document.getElementById('readingProgress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  });
}

/* --------------------------------------------------------------------------
   3. Interactive Like / Clap Button
   -------------------------------------------------------------------------- */
function initClapButton() {
  const clapBtn = document.getElementById('clapBtn');
  const clapCountEl = document.getElementById('clapCount');
  if (!clapBtn || !clapCountEl) return;

  const blogId = clapBtn.getAttribute('data-blog-id');
  const storageKey = `blogify_claps_${blogId}`;
  
  // Load saved claps
  let count = parseInt(localStorage.getItem(storageKey), 10) || 12;
  clapCountEl.textContent = count;

  clapBtn.addEventListener('click', () => {
    count++;
    clapCountEl.textContent = count;
    localStorage.setItem(storageKey, count);
    clapBtn.classList.add('clapped');

    // Micro pop animation
    clapBtn.style.transform = 'scale(1.15)';
    setTimeout(() => {
      clapBtn.style.transform = '';
    }, 180);

    showToast('👏 Thanks for appreciating this story!');
  });
}

/* --------------------------------------------------------------------------
   4. Share Actions & Toast
   -------------------------------------------------------------------------- */
function initShareActions() {
  const copyBtn = document.getElementById('copyLinkBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('🔗 Link copied to clipboard!');
      } catch (err) {
        // Fallback
        const dummy = document.createElement('input');
        dummy.value = window.location.href;
        document.body.appendChild(dummy);
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        showToast('🔗 Link copied to clipboard!');
      }
    });
  }

  const twitterBtn = document.getElementById('shareTwitterBtn');
  if (twitterBtn) {
    twitterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = document.title;
      const url = encodeURIComponent(window.location.href);
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${url}`, '_blank', 'width=600,height=400');
    });
  }

  const linkedinBtn = document.getElementById('shareLinkedinBtn');
  if (linkedinBtn) {
    linkedinBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=500');
    });
  }
}

function showToast(message) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }
  toast.innerHTML = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* --------------------------------------------------------------------------
   5. Live Image Upload Preview
   -------------------------------------------------------------------------- */
function initImageUploadPreview() {
  const fileInput = document.getElementById('coverImgInput');
  const previewWrapper = document.getElementById('previewWrapper');
  const previewImg = document.getElementById('previewImg');
  const removeBtn = document.getElementById('removePreviewBtn');
  const dropzone = document.getElementById('uploadDropzone');

  if (!fileInput || !previewWrapper || !previewImg) return;

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      previewWrapper.style.display = 'block';
      if (dropzone) dropzone.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    handleFile(file);
  });

  if (dropzone) {
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        fileInput.files = e.dataTransfer.files;
        handleFile(e.dataTransfer.files[0]);
      }
    });
  }

  if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      fileInput.value = '';
      previewImg.src = '';
      previewWrapper.style.display = 'none';
      if (dropzone) dropzone.style.display = 'block';
    });
  }
}

/* --------------------------------------------------------------------------
   6. Editor Word Count & Read Time Calculation
   -------------------------------------------------------------------------- */
function initEditorStats() {
  const bodyInput = document.getElementById('body');
  const wordCountEl = document.getElementById('editorWordCount');
  const readTimeEl = document.getElementById('editorReadTime');

  if (!bodyInput) return;

  bodyInput.addEventListener('input', () => {
    const text = bodyInput.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    const readTime = Math.max(1, Math.ceil(words / 200));

    if (wordCountEl) wordCountEl.textContent = `${words} words`;
    if (readTimeEl) readTimeEl.textContent = `~${readTime} min read`;
  });
}

/* --------------------------------------------------------------------------
   7. Password Visibility Toggles
   -------------------------------------------------------------------------- */
function initPasswordToggles() {
  const toggleButtons = document.querySelectorAll('.password-toggle-btn');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = isPassword ? 'bi bi-eye-slash' : 'bi bi-eye';
      }
    });
  });
}
