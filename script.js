document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('greetingForm');
    const imageInput = document.getElementById('image');
    const cardPreview = document.getElementById('cardPreview');
    const cardImage = document.getElementById('cardImage');
    const cardName = document.getElementById('cardName');
    const downloadBtn = document.getElementById('downloadBtn');
    const shareBtn = document.getElementById('shareBtn');
    const newCardBtn = document.getElementById('newCardBtn');
    const greetingCard = document.getElementById('greetingCard');
    const cardStyleOptions = document.querySelectorAll('.card-style-option');
    const EidImg = document.getElementById('AID-img');
    const pattern=document.getElementById('background');
    // const topImg=document.getElementById('top');
    const lanterns=document.getElementById('lanterns');
    const bottomImg=document.getElementById('bottom');
    const backgroundDiv=document.getElementById('backgroundDiv');
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

    // Handle card style selection
    cardStyleOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            cardStyleOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to selected option
            option.classList.add('active');
            // Update card style
            const selectedStyle = option.getAttribute('data-style');
            greetingCard.className = `greeting-card ${selectedStyle}`;
            const aidSpan = document.querySelector('.greeting-card .AID');

            if(selectedStyle === 'style-1'){
                EidImg.src = 'assets/—Pngtree—eid mubarak with nice arabic_6260912.png';
                bottomImg.src = '/assets/pngegg.png'; 
                pattern.src = 'assets/pngegg (1).png';
                bottomImg.style.display = 'block';
                pattern.style.display = 'block';
                if (aidSpan) aidSpan.textContent = 'عيد الفطر المبارك';
            }
            else if(selectedStyle === 'style-2'){
                EidImg.src = 'assets/style-2.png';
                bottomImg.src = 'assets/pngwing.com (1).png';
                pattern.style.display = 'none';
                if (aidSpan) aidSpan.textContent = 'عيد الفطر المبارك';
            }
            else if(selectedStyle === 'style-3'){
                EidImg.src = 'assets/style-2.png'; // Assuming style-2.png is generic enough or placeholder
                pattern.src = 'assets/pngegg(2).png';
                bottomImg.src = '/assets/pngegg.png'; // Default bottom image
                pattern.style.display = 'block';
                bottomImg.style.display = 'block';
                if (aidSpan) aidSpan.textContent = 'عيد الفطر المبارك';
            }
            // Eid al-Adha styles
            else if(selectedStyle === 'style-4'){
                EidImg.src = 'assets/eid_adha_1.png'; // Placeholder for Eid al-Adha image 1
                bottomImg.src = 'assets/eid_adha_bottom_1.png'; // Placeholder
                pattern.src = 'assets/eid_adha_pattern_1.png'; // Placeholder
                bottomImg.style.display = 'block';
                pattern.style.display = 'block';
                if (aidSpan) aidSpan.textContent = 'عيد الأضحى المبارك';
            }
            else if(selectedStyle === 'style-5'){
                EidImg.src = 'assets/eid_adha_2.png'; // Placeholder for Eid al-Adha image 2
                bottomImg.src = 'assets/eid_adha_bottom_2.png'; // Placeholder
                pattern.style.display = 'none'; // Example: no pattern for this style
                if (aidSpan) aidSpan.textContent = 'عيد الأضحى المبارك';
            }
            else if(selectedStyle === 'style-6'){
                EidImg.src = 'assets/eid_adha_3.png'; // Placeholder for Eid al-Adha image 3
                bottomImg.src = 'assets/eid_adha_bottom_3.png'; // Placeholder
                pattern.src = 'assets/eid_adha_pattern_3.png'; // Placeholder
                bottomImg.style.display = 'block';
                pattern.style.display = 'block';
                if (aidSpan) aidSpan.textContent = 'عيد الأضحى المبارك';
            }
        });
    });

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const selectedStyleOption = document.querySelector('.card-style-option.active');
        const selectedStyle = selectedStyleOption ? selectedStyleOption.getAttribute('data-style') : 'style-1';
        const isEidAdha = ['style-4', 'style-5', 'style-6'].includes(selectedStyle);
        const hasImage = !!imageInput.files.length;

        // Prepare data to send to Google Sheets
        const formData = {
            name: name,
            card_type: isEidAdha ? 'عيد الأضحى' : 'عيد الفطر',
            style: selectedStyle,
            has_image: hasImage ? 'نعم' : 'لا'
        };

        try {
            // Send data to Google Sheets
            await fetch('https://script.google.com/macros/s/AKfycbyXORx_8t0nMF8SbDKd1A_mmWyEWWvZ8Wb23FV-oQcRAuL2dMWLQAbImYbHuLdM735CAA/exec', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            // Update card content
            if (!imageInput.files.length) {
                cardImage.src = 'assets/Helal.png';
                cardImage.style.display = 'block';
            }

            const messageElement = document.querySelector('.arabic-text');
            const aidSpan = messageElement.querySelector('.AID');
            if (aidSpan) aidSpan.textContent = isEidAdha ? 'عيد الأضحى المبارك' : 'عيد الفطر المبارك';
            cardName.textContent = name;
            form.style.display = 'none';
            cardPreview.style.display = 'block';

            // Show success message
            alert('تم تسجيل المعلومات بنجاح في قاعدة البيانات');
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('حدث خطأ أثناء تسجيل المعلومات. يرجى المحاولة مرة أخرى');
        }
    });

    // Function to start confetti animation with enhanced speed and density
    function startConfetti() {
        if (typeof window.startConfetti === 'function') {
            // Clear any existing confetti
            if (window.stopConfetti) {
                window.stopConfetti();
            }
            // Start new confetti with enhanced settings for even faster and denser animation
            setTimeout(() => {
                window.startConfetti({
                    particleCount: 200,
                    spread: 80,
                    startVelocity: 55,
                    scalar: 1.4,
                    ticks: 300
                });
            }, 20);
        }
    }

    // Add event listener to download button
    document.getElementById('downloadBtn').addEventListener('click', function() {
        startConfetti();
    });

    // Handle card download
    downloadBtn.addEventListener('click', () => {
        const greetingCard = document.getElementById('greetingCard');
        const name = document.getElementById('cardName').textContent;
        
        // Create and show popup with animation
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%) scale(0.7)';
        popup.style.background = 'linear-gradient(145deg, #ffffff, #f0f0f0)';
        popup.style.padding = '30px';
        popup.style.borderRadius = '15px';
        popup.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        popup.style.zIndex = '10000';
        popup.style.textAlign = 'center';
        popup.style.direction = 'rtl';
        popup.style.transition = 'all 0.3s ease';
        popup.style.opacity = '0';
        popup.innerHTML = `
            <h2 style="color: #2c3e50; margin-bottom: 20px; font-family: 'Noto Kufi Arabic', 'Cairo', sans-serif; font-size: 24px;">كل عام وأنت بخير يا ${name} 🎉</h2>
            <button style="background: linear-gradient(145deg, #3498db, #2980b9); color: white; border: none; padding: 12px 25px; border-radius: 8px; cursor: pointer; font-family: 'Cairo', sans-serif; transition: all 0.3s ease;">حسناً</button>
        `;
        document.body.appendChild(popup);

        // Trigger animation and confetti
        setTimeout(() => {
            popup.style.opacity = '1';
            popup.style.transform = 'translate(-50%, -50%) scale(1)';
            startConfetti();
        }, 100);

        // Handle popup close with animation
        const closeBtn = popup.querySelector('button');
        closeBtn.addEventListener('mouseover', () => {
            closeBtn.style.transform = 'scale(1.05)';
        });
        closeBtn.addEventListener('mouseout', () => {
            closeBtn.style.transform = 'scale(1)';
        });
        closeBtn.addEventListener('click', () => {
            popup.style.opacity = '0';
            popup.style.transform = 'translate(-50%, -50%) scale(0.7)';
            // Stop confetti after 1 second
            setTimeout(() => {
                if (typeof window.stopConfetti === 'function') {
                    window.stopConfetti();
                    // Allow existing confetti to fall to the bottom
                    const confettiElements = document.querySelectorAll('.confetti');
                    confettiElements.forEach(element => {
                        element.style.transition = 'all 2s';
                        element.style.top = '100vh';
                    });
                }
            }, 3000);
            setTimeout(() => {
                document.body.removeChild(popup);
            }, 300);
        });

        // Download card
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
        cardImage.style.display = 'none';
        cardImage.src = '';
        form.style.display = 'block';
        cardPreview.style.display = 'none';
    });
});