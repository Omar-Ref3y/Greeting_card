document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('greetingForm');
    const imageInput = document.getElementById('image');
    const cardPreview = document.getElementById('cardPreview');
    const cardImage = document.getElementById('cardImage');
    const cardName = document.getElementById('cardName');
    const downloadBtn = document.getElementById('downloadBtn');
    const shareBtn = document.getElementById('shareBtn');
    const newCardBtn = document.getElementById('newCardBtn');
    
    // Add html2canvas script
    const script = document.createElement('script');
    script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
    document.head.appendChild(script);

    // Handle image preview
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const size = 200;
                    canvas.width = size;
                    canvas.height = size;
                    
                    // حساب أبعاد القص للحفاظ على نسبة العرض إلى الارتفاع
                    const minDimension = Math.min(img.width, img.height);
                    const sourceX = (img.width - minDimension) / 2;
                    const sourceY = (img.height - minDimension) / 2;
                    
                    ctx.drawImage(img, sourceX, sourceY, minDimension, minDimension, 0, 0, size, size);
                    cardImage.src = canvas.toDataURL('image/jpeg', 0.9);
                    cardImage.style.display = 'block';
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;

        // Set default image if no image is uploaded
        if (!imageInput.files.length) {
            cardImage.src = 'assets/Helal.png';
            cardImage.style.display = 'block';
        }

        // Update card content
        const messageElement = document.querySelector('.arabic-text');
        cardName.textContent = `من: ${name}`;
        form.style.display = 'none';
        cardPreview.style.display = 'block';
    });

    // Handle card download
    downloadBtn.addEventListener('click', () => {
        const greetingCard = document.getElementById('greetingCard');
        html2canvas(greetingCard, {
            scale: 3,
            backgroundColor: '#ffffff',
            useCORS: true,
            allowTaint: true,
            logging: false
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'greeting-card.png';
            link.href = canvas.toDataURL('image/png', 1.0);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
                });
    });

    // Handle WhatsApp sharing
    shareBtn.addEventListener('click', async () => {
        try {
            html2canvas(document.getElementById('greetingCard'), {
                scale: 2,
                backgroundColor: '#ffffff',
                useCORS: true,
                allowTaint: true,
                logging: false
            }).then(async canvas => {
                const blob = await new Promise(resolve => canvas.toBlob(resolve));
                const file = new File([blob], 'greeting-card.png', { type: 'image/png' });
                
                if (navigator.share) {
                    await navigator.share({
                        files: [file],
                        title: 'بطاقة تهنئة',
                        text: 'شارك بطاقة التهنئة الخاصة بك!'
                    });
                } else {
                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent('شارك بطاقة التهنئة الخاصة بك!')}}`;
                    window.open(whatsappUrl, '_blank');
                }
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    });

    // Handle creating new card
    newCardBtn.addEventListener('click', () => {
        form.reset();
        imagePreview.innerHTML = '';
        cardImage.style.display = 'none';
        cardImage.src = '';
        form.style.display = 'block';
        cardPreview.style.display = 'none';
    });
});