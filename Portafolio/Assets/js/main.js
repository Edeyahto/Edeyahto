console.log("Portafolio cargado.");

// Lightbox/modal para ampliar imágenes de proyectos
(function () {
	function createModal() {
		const modal = document.createElement('div');
		modal.className = 'image-modal';
		modal.innerHTML = `
			<div class="image-modal__content" role="dialog" aria-modal="true">
				<img class="image-modal__img" src="" alt="">
			</div>
			<button class="image-modal__close" aria-label="Cerrar">✕</button>
		`;
		document.body.appendChild(modal);
		return modal;
	}

	const modal = createModal();
	const modalImg = modal.querySelector('.image-modal__img');
	const closeBtn = modal.querySelector('.image-modal__close');

	function openImage(src, alt) {
		modalImg.src = src;
		modalImg.alt = alt || '';
		modal.classList.add('open');
		document.body.style.overflow = 'hidden';
		closeBtn.focus();
	}

	function closeImage() {
		modal.classList.remove('open');
		modalImg.src = '';
		document.body.style.overflow = '';
	}

	document.addEventListener('click', function (e) {
		const img = e.target.closest && e.target.closest('.project-image');
		if (img) {
			openImage(img.src, img.alt);
		}
	});

	// Close interactions
	closeBtn.addEventListener('click', closeImage);
	modal.addEventListener('click', function (e) {
		if (e.target === modal) closeImage();
	});
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') closeImage();
	});
})();

/* ============================
 	 Process lightbox system
 	 (isolated, interacts only with elements that have `data-project`)
 	 ============================ */
(function () {
	// Objeto con rutas completas: la primera entrada es la ilustración final
	// ubicada en `Assets/img/Curis/`, seguida por
	// las 5 imágenes de proceso en `Assets/img/Curis/Procesos/`.
	const processProjects = {
		curi1: {
			files: [
				'Assets/img/Curis/ML Curi1.png',
				'Assets/img/Curis/Procesos/ML_Curi1_1.png',
				'Assets/img/Curis/Procesos/ML_Curi1_2.png',
				'Assets/img/Curis/Procesos/ML_Curi1_3.png',
				'Assets/img/Curis/Procesos/ML_Curi1_4.png'
			]
		},
		curi2: {
			files: [
				'Assets/img/Curis/ML Curi2.png',
				'Assets/img/Curis/Procesos/ML_Curi2_1.png',
				'Assets/img/Curis/Procesos/ML_Curi2_2.png',
				'Assets/img/Curis/Procesos/ML_Curi2_3.png',
				'Assets/img/Curis/Procesos/ML_Curi2_4.png'
			]
		},
		curi3: {
			files: [
				'Assets/img/Curis/ML Curi3.png',
				'Assets/img/Curis/Procesos/ML_Curi3_1.png'
			]
		},
		baxia: {
			files: [
				'Assets/img/Curis/ML Curi4.png',
				'Assets/img/Curis/Procesos/ML_Curi4_1.png',
				'Assets/img/Curis/Procesos/ML_Curi4_2.png',
				'Assets/img/Curis/Procesos/ML_Curi4_3.png',
				'Assets/img/Curis/Procesos/ML_Curi4_4.png',
				'Assets/img/Curis/Procesos/ML_Curi4_5.png'
			]
		}
	};

	const plBox = document.getElementById('process-lightbox');
	if (!plBox) return; 

	const plBackdrop = plBox.querySelector('.process-lightbox__backdrop');
	const plPanel = plBox.querySelector('.process-lightbox__panel');
	const plImg = plBox.querySelector('.process-lightbox__img');
	const plClose = plBox.querySelector('.process-lightbox__close');
	const plPrev = plBox.querySelector('.process-lightbox__prev');
	const plNext = plBox.querySelector('.process-lightbox__next');
	const plCounter = plBox.querySelector('.process-lightbox__counter');

	let currentProject = null;
	let currentIndex = 0;

	function setAriaOpen(open) {
		plBox.setAttribute('aria-hidden', open ? 'false' : 'true');
	}

	function openProcess(projKey) {
		const proj = processProjects[projKey];
		if (!proj) return;
		currentProject = proj;
		currentIndex = 0;
		loadImage();
		setAriaOpen(true);
		document.body.style.overflow = 'hidden';
		plClose.focus();
		document.addEventListener('keydown', onKey);
	}

	function closeProcess() {
		setAriaOpen(false);
		plImg.src = '';
		plImg.alt = '';
		document.body.style.overflow = '';
		currentProject = null;
		document.removeEventListener('keydown', onKey);
	}

	function loadImage() {
		if (!currentProject) return;
		const file = currentProject.files[currentIndex];
		const url = encodeURI(file);
		plImg.src = url;
		plImg.alt = file.split('/').pop();
		plCounter.textContent = (currentIndex + 1) + ' / ' + currentProject.files.length;
		plImg.onerror = function () {
			console.warn('No se pudo cargar:', url);
			plImg.style.display = 'none';
			plCounter.textContent = '— / ' + currentProject.files.length;
		};
		plImg.onload = function () {
			plImg.style.display = '';
		};
	}

	function prev() {
		if (!currentProject) return;
		currentIndex = (currentIndex - 1 + currentProject.files.length) % currentProject.files.length;
		loadImage();
	}

	function next() {
		if (!currentProject) return;
		currentIndex = (currentIndex + 1) % currentProject.files.length;
		loadImage();
	}

	function onKey(e) {
		if (!currentProject) return;
		if (e.key === 'Escape') closeProcess();
		if (e.key === 'ArrowLeft') prev();
		if (e.key === 'ArrowRight') next();
	}

	// UI handlers
	if (plClose) plClose.addEventListener('click', function (e) { e.stopPropagation(); closeProcess(); });
	if (plBackdrop) plBackdrop.addEventListener('click', function (e) {
		// Si se hace click fuera del panel, cerrar
		if (e.target === plBackdrop) closeProcess();
	});
	if (plPrev) plPrev.addEventListener('click', function (e) { e.stopPropagation(); prev(); });
	if (plNext) plNext.addEventListener('click', function (e) { e.stopPropagation(); next(); });

	// Interactuar sólo con elementos que tengan atributo data-project
	const dataEls = document.querySelectorAll('[data-project]');
	dataEls.forEach(function (el) {
		const key = el.getAttribute('data-project');
		if (!key) return;
		// Si el proyecto no tiene proceso definido, no añadimos comportamiento
		if (!processProjects.hasOwnProperty(key)) return;

		el.addEventListener('click', function (e) {
			e.preventDefault();
			e.stopPropagation();
			openProcess(key);
		});
	});

})();

/* ============================
   Projects carousel initializer
   - Wraps any .projects-grid in a .project-carousel
   - Adds prev/next buttons and makes the grid slide by a "page" (visible count)
   - Works for current and future grids by applying to all .projects-grid nodes
   ============================ */
(function () {
	function initCarousels() {
		const grids = document.querySelectorAll('.projects-grid');
		grids.forEach((grid) => {
			// avoid initializing twice
			if (grid.closest('.project-carousel')) return;

			const cards = Array.from(grid.querySelectorAll('.project-card'));
			const total = cards.length;
			// create carousel wrapper
			const slider = document.createElement('div');
			slider.className = 'projects-slider';
			// create left arrow area
			const leftArea = document.createElement('div');
			leftArea.className = 'projects-arrow projects-arrow-left';
			const leftBtn = document.createElement('button');
			leftBtn.className = 'project-carousel__btn project-carousel__prev';
			leftBtn.innerHTML = '‹';
			leftArea.appendChild(leftBtn);

			// create right arrow area
			const rightArea = document.createElement('div');
			rightArea.className = 'projects-arrow projects-arrow-right';
			const rightBtn = document.createElement('button');
			rightBtn.className = 'project-carousel__btn project-carousel__next';
			rightBtn.innerHTML = '›';
			rightArea.appendChild(rightBtn);

			// create track area and move grid inside
			const track = document.createElement('div');
			track.className = 'projects-track';
			grid.parentNode.insertBefore(slider, grid);
			slider.appendChild(leftArea);
			slider.appendChild(track);
			slider.appendChild(rightArea);
			track.appendChild(grid);

			// create fade overlays inside track
			const fadeLeft = document.createElement('div');
			fadeLeft.className = 'projects-fade-left';
			const fadeRight = document.createElement('div');
			fadeRight.className = 'projects-fade-right';
			track.appendChild(fadeLeft);
			track.appendChild(fadeRight);

			// state
			let index = 0; // current starting index
			let visibleCount = getVisibleCount();

			function getVisibleCount() {
				const w = window.innerWidth;
				if (w <= 640) return 1;
				if (w <= 1024) return 2;
				return 4;
			}

			function update() {
				visibleCount = getVisibleCount();
				const gapStr = window.getComputedStyle(grid).gap || window.getComputedStyle(grid).columnGap || '24px';
				const gap = parseFloat(gapStr);
				const cardEl = grid.querySelector('.project-card');
				if (!cardEl) return;
				const cardWidth = cardEl.getBoundingClientRect().width;
				const move = (cardWidth + gap) * index;
				grid.style.transform = `translateX(-${move}px)`;
				// hide controls if not enough items
				if (total <= visibleCount) {
					leftBtn.style.display = 'none';
					rightBtn.style.display = 'none';
					fadeLeft.style.display = 'none';
					fadeRight.style.display = 'none';
				} else {
					leftBtn.style.display = '';
					rightBtn.style.display = '';
					// fades
					fadeLeft.style.display = index > 0 ? '' : 'none';
					fadeRight.style.display = (index + visibleCount) < total ? '' : 'none';
				}
			}

			function clampIndex(i) {
				const maxIndex = Math.max(0, total - visibleCount);
				if (i < 0) return maxIndex; // wrap
				if (i > maxIndex) return 0; // wrap
				return i;
			}

			function prev() {
				visibleCount = getVisibleCount();
				index = clampIndex(index - visibleCount);
				update();
			}

			function next() {
				visibleCount = getVisibleCount();
				index = clampIndex(index + visibleCount);
				update();
			}

			// Swap handlers so '<' slides the content left and '>' slides it right
			leftBtn.setAttribute('aria-label', 'Deslizar a la izquierda');
			rightBtn.setAttribute('aria-label', 'Deslizar a la derecha');
			leftBtn.addEventListener('click', function (e) { e.stopPropagation(); next(); });
			rightBtn.addEventListener('click', function (e) { e.stopPropagation(); prev(); });

			// responsive: recalc on resize
			let resizeTimeout;
			window.addEventListener('resize', function () {
				clearTimeout(resizeTimeout);
				resizeTimeout = setTimeout(function () {
					// recompute sizes and keep index within bounds
					visibleCount = getVisibleCount();
					index = Math.min(index, Math.max(0, total - visibleCount));
					update();
				}, 120);
			});

			// initial layout
			// ensure grid doesn't break with CSS grid fallback: remove grid-template columns if any
			grid.style.display = 'flex';
			grid.style.transition = 'transform var(--carousel-transition) ease';
			grid.style.willChange = 'transform';
			// set gap inline in case CSS fallback applies
			grid.style.gap = getComputedStyle(grid).gap || getComputedStyle(grid).columnGap || '24px';
			update();
		});
	}

	// init on DOM ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initCarousels);
	} else {
		initCarousels();
	}
})();

/* ============================
   Category collapse/expand
   ============================ */
(function () {
	function setExpanded(body, btn, expanded) {
		btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
		btn.textContent = expanded ? 'v' : '>';
		btn.setAttribute('aria-label', expanded ? 'Contraer categoría' : 'Expandir categoría');
		body.classList.toggle('is-collapsed', !expanded);
		body.style.maxHeight = expanded ? body.scrollHeight + 'px' : '0px';
	}

	function initCategoryToggles() {
		const categories = document.querySelectorAll('.projects-category');
		categories.forEach((category) => {
			const body = category.querySelector('.category-body');
			const btn = category.querySelector('.category-toggle');
			if (!body || !btn) return;

			// set initial height
			body.style.maxHeight = body.scrollHeight + 'px';

			btn.addEventListener('click', function (e) {
				e.stopPropagation();
				const expanded = btn.getAttribute('aria-expanded') === 'true';
				setExpanded(body, btn, !expanded);
			});
		});

		// keep heights in sync on resize
		let resizeTimeout;
		window.addEventListener('resize', function () {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(function () {
				document.querySelectorAll('.projects-category .category-body').forEach((body) => {
					const btn = body.parentElement.querySelector('.category-toggle');
					if (!btn) return;
					const expanded = btn.getAttribute('aria-expanded') === 'true';
					if (expanded) {
						body.style.maxHeight = body.scrollHeight + 'px';
					}
				});
			}, 120);
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initCategoryToggles);
	} else {
		initCategoryToggles();
	}
})();
