document.addEventListener('DOMContentLoaded', () => {
    // 0. Charger et lier les données dynamiques du profil (localStorage)
    const defaultProfile = {
        name: "Emrevolvee",
        photo: "photo.png",
        tags: ["Peptides", "BioHacking", "Glow Up"],
        statement: "Ce que personne veut que tu sache sur les peptides",
        links: [
            {
                title: "Glow up PEPS 🧬",
                subtitle: "Ton guide offert pour optimiser ton physique",
                url: "https://drive.google.com/file/d/124JDTPFYnG2FlCHVXyyrIz-AxEn_GdTZ/view"
            },
            {
                title: "Guide PEPS complet 📙",
                subtitle: "Le guide que j'aurais aimer avoir avant de commencer les peps...",
                url: "https://drive.google.com/file/d/1S-kJTyUVfDzB0egVrvLMdKKuDrKblw9H/view"
            },
            {
                title: "Tout ce que je ne peux pas dire sur instagram et tiktok 👀",
                subtitle: "",
                url: "https://t.me/+lcg71YFxd_c4OGJk"
            },
            {
                title: "Session PEPS 30 min - Réserve ta place 👑",
                subtitle: "Protocole peptides personnalisé - on construit ton plan ensemble",
                url: "https://calendly.com/admagencyy/session-peptides?month=2026-07"
            }
        ],
        socials: {
            instagram: "https://instagram.com/emrevolvee",
            tiktok: "https://tiktok.com/@emrevolvee"
        }
    };

    let profile = defaultProfile;
    const storedProfile = localStorage.getItem('emrevolvee_profile');
    if (storedProfile) {
        try {
            profile = JSON.parse(storedProfile);
        } catch(e) {
            console.error("Erreur lecture profile localStorage, chargement par défaut.");
        }
    } else {
        localStorage.setItem('emrevolvee_profile', JSON.stringify(defaultProfile));
    }

    // Appliquer les données de profil au DOM
    const nameEl = document.getElementById('profile-name');
    const statementEl = document.getElementById('card-statement');
    const tagsEl = document.getElementById('profile-tags');
    const heroBannerEl = document.getElementById('hero-banner');
    const desktopBgEl = document.getElementById('desktop-bg');

    if (nameEl) nameEl.textContent = profile.name;
    if (statementEl) statementEl.textContent = profile.statement;
    
    // Rendre les tags
    if (tagsEl && profile.tags) {
        tagsEl.innerHTML = '';
        profile.tags.forEach((tag, idx) => {
            const spanTag = document.createElement('span');
            spanTag.className = 'glow-tag';
            spanTag.textContent = tag;
            tagsEl.appendChild(spanTag);

            if (idx < profile.tags.length - 1) {
                const separator = document.createElement('span');
                separator.className = 'tag-separator';
                separator.textContent = ' - ';
                tagsEl.appendChild(separator);
            }
        });
    }

    // Rendre l'image de fond
    if (profile.photo) {
        const photoUrl = profile.photo.startsWith('data:image') ? profile.photo : 'photo.png';
        if (heroBannerEl) heroBannerEl.style.backgroundImage = `url('${photoUrl}')`;
        if (desktopBgEl) desktopBgEl.style.backgroundImage = `url('${photoUrl}')`;
    }

    // Rendre les 4 liens
    if (profile.links) {
        for (let i = 1; i <= 4; i++) {
            const linkData = profile.links[i - 1];
            if (linkData) {
                const linkBtn = document.getElementById(`link-btn-${i}`);
                const linkTitle = document.getElementById(`link-title-${i}`);
                const linkSubtitle = document.getElementById(`link-subtitle-${i}`);

                if (linkBtn) linkBtn.href = linkData.url;
                if (linkTitle) linkTitle.textContent = linkData.title;
                if (linkSubtitle) {
                    if (linkData.subtitle) {
                        linkSubtitle.textContent = linkData.subtitle;
                        linkSubtitle.style.display = 'block';
                    } else {
                        linkSubtitle.style.display = 'none';
                    }
                }
            }
        }
    }

    // Rendre les réseaux sociaux du footer
    if (profile.socials) {
        const instaEl = document.getElementById('footer-instagram');
        const tiktokEl = document.getElementById('footer-tiktok');

        if (instaEl) instaEl.href = profile.socials.instagram;
        if (tiktokEl) tiktokEl.href = profile.socials.tiktok;
    }

    // 1. Initialiser les icônes Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Gestion de la Modale de Partage et du QR Code
    const shareBtn = document.getElementById('share-btn');
    const shareModal = document.getElementById('share-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const shareUrlInput = document.getElementById('share-url');
    const qrImg = document.getElementById('qr-img');
    const qrLoader = document.getElementById('qr-loader');

    // URL de partage officielle du profil
    const currentUrl = 'https://hagraphisme.github.io/emrevolvee/';
    shareUrlInput.value = currentUrl;

    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            shareModal.classList.add('active');
            
            // Charger le QR code dynamiquement si ce n'est pas déjà fait
            if (!qrImg.src || qrImg.src.includes('window.location.href') || qrImg.style.display === 'none') {
                const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}&color=2d2c29&bgcolor=ffffff`;
                qrImg.src = qrCodeApiUrl;
                
                qrImg.onload = () => {
                    qrLoader.style.display = 'none';
                    qrImg.style.display = 'block';
                };
            }
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            shareModal.classList.remove('active');
        });
    }

    // Fermer la modale si on clique à l'extérieur de la carte de la modale
    if (shareModal) {
        shareModal.addEventListener('click', (e) => {
            if (e.target === shareModal) {
                shareModal.classList.remove('active');
            }
        });
    }

    // 3. Copie du Lien et Notification Toast
    const copyLinkBtn = document.getElementById('copy-link-btn');
    const toast = document.getElementById('toast-notif');

    if (copyLinkBtn && toast) {
        copyLinkBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(shareUrlInput.value);
                showToast("Lien copié avec succès !");
                
                // Animation du bouton de copie
                const copyText = copyLinkBtn.querySelector('.copy-text');
                copyText.textContent = "Copié !";
                setTimeout(() => {
                    copyText.textContent = "Copier";
                }, 2000);
            } catch (err) {
                console.error("Échec de la copie : ", err);
                shareUrlInput.select();
                document.execCommand('copy');
                showToast("Lien sélectionné. Copiez-le manuellement.");
            }
        });
    }

    function showToast(message) {
        const toastMsg = toast.querySelector('.toast-message');
        toastMsg.textContent = message;
        
        toast.classList.add('active');
        
        // Cacher le toast après 3 secondes
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }

    // 4. Parallaxe de fond immersif sur Desktop
    const desktopBg = document.querySelector('.desktop-bg-blur');
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (desktopBg && !isMobile) {
        window.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;
            
            // Déplacer doucement l'arrière-plan de bureau pour créer du relief
            const moveX = mouseX * 20;
            const moveY = mouseY * 20;
            
            desktopBg.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
        });
    }
});
