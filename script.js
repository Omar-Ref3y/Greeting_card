document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('greetingForm');
    const imageInput = document.getElementById('image');

    const cardPreview = document.getElementById('cardPreview');
    const cardImage = document.getElementById('cardImage');
    const cardName = document.getElementById('cardName');
    const downloadBtn = document.getElementById('downloadBtn');
    const shareBtn = document.getElementById('shareBtn');
    const newCardBtn = document.getElementById('newCardBtn');
    
    const script = document.createElement('script');
    script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
    document.head.appendChild(script);

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;


                cardImage.src = e.target.result;
                cardImage.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;

        if (!imageInput.files.length) {
            cardImage.src = 'assets/Helal.png';
            cardImage.style.display = 'block';
        }

        const messageElement = document.querySelector('.arabic-text');
        cardName.textContent = `${name}`;
        form.style.display = 'none';
        cardPreview.style.display = 'block';
    });

    downloadBtn.addEventListener('click', () => {
        const greetingCard = document.getElementById('greetingCard');
        html2canvas(greetingCard, {
            scale: 2,
            backgroundColor: '#ffffff',
            useCORS: true,
            allowTaint: true,
            logging: false
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'greeting-card.png';
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
        });
    });

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
        cardImage.style.display = 'none';
        cardImage.src = '';
        form.style.display = 'block';
        cardPreview.style.display = 'none';
    });
});