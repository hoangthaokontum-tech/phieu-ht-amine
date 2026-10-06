document.addEventListener('DOMContentLoaded', () => {
    // 1. Nạp Header & Goals
    document.getElementById('header-container').innerHTML = `
        <h1>PHIẾU HỌC TẬP ${LESSON_DATA.subject.toUpperCase()} ${LESSON_DATA.grade}</h1>
        <h2>${LESSON_DATA.title}</h2>
        <p>${LESSON_DATA.subtitle}</p>
    `;

    const goalsHTML = LESSON_DATA.goals.map(g => `<div class="goal-item"><i>✓</i><span>${g}</span></div>`).join('');
    document.getElementById('goals-container').innerHTML = goalsHTML;

    const rememberHTML = LESSON_DATA.remember.map(r => `<li>${r}</li>`).join('');
    document.getElementById('remember-container').innerHTML = rememberHTML;

    // 2. Render các phần câu hỏi
    const quizContainer = document.getElementById('quiz-container');
    
    LESSON_DATA.sections.forEach((section, sIndex) => {
        const sectionCard = document.createElement('section');
        sectionCard.className = 'card';
        sectionCard.innerHTML = `<h2>${section.title}</h2>`;
        
        if(section.type === 'mcq' || section.type === 'truefalse') {
            section.questions.forEach((q, qIndex) => {
                const qId = `s${sIndex}_q${qIndex}`;
                let optionsHTML = '';
                
                const opts = section.type === 'mcq' ? q.options : ['Đúng', 'Sai'];
                opts.forEach((opt, oIndex) => {
                    optionsHTML += `
                        <label class="option-label" id="label_${qId}_${oIndex}">
                            <input type="radio" name="${qId}" value="${opt}" data-answer="${q.answer}">
                            <span>${opt}</span>
                        </label>
                    `;
                });

                sectionCard.innerHTML += `
                    <div class="question-block" data-type="radio">
                        <div class="q-title">Câu ${qIndex + 1}: ${q.text || q.question}</div>
                        <div class="options-grid">${optionsHTML}</div>
                    </div>
                `;
            });
        } 
        else if (section.type === 'fill') {
            section.questions.forEach((q, qIndex) => {
                const answersStr = q.answers.map(a => a.toLowerCase()).join('|');
                sectionCard.innerHTML += `
                    <div class="question-block" data-type="fill">
                        <div class="q-title">Câu ${qIndex + 1}: 
                            ${q.prefix} 
                            <input type="text" class="fill-input" data-answers="${answersStr}" placeholder="..."> 
                            ${q.suffix}
                        </div>
                    </div>
                `;
            });
        }
        else if (section.type === 'match') {
            section.questions.forEach((q, qIndex) => {
                let optionsHTML = `<option value="">-- Chọn đáp án --</option>`;
                q.colB.forEach(opt => {
                    optionsHTML += `<option value="${opt}">${opt}</option>`;
                });
                sectionCard.innerHTML += `
                    <div class="question-block" data-type="match">
                        <table class="match-table">
                            <tr>
                                <td width="50%"><strong>${q.colA}</strong></td>
                                <td width="50%">
                                    <select data-answer="${q.answer}">
                                        ${optionsHTML}
                                    </select>
                                </td>
                            </tr>
                        </table>
                    </div>
                `;
            });
        }
        else if (section.type === 'dragdrop') {
            let poolHTML = `<div class="drag-pool" id="pool_${sIndex}">`;
            section.cards.forEach(card => {
                const content = card.type === 'image' ? `<img src="${card.src}" alt="${card.label}">` : card.label;
                poolHTML += `<div class="draggable" data-id="${card.id}" draggable="true">${content}</div>`;
            });
            poolHTML += `</div>`;

            let targetsHTML = `<div class="targets-grid">`;
            section.targets.forEach((target, tIndex) => {
                targetsHTML += `
                    <div class="target-zone" data-accept="${target.accept}" id="target_${sIndex}_${tIndex}">
                        <div class="target-label">${target.text}</div>
                    </div>
                `;
            });
            targetsHTML += `</div>`;

            sectionCard.innerHTML += `
                <div class="question-block drag-section" data-type="dragdrop">
                    <p style="margin-bottom: 10px; font-weight: bold; color: var(--secondary);">🧩 Kéo thẻ kiến thức thả vào vị trí tương ứng:</p>
                    ${poolHTML}
                    ${targetsHTML}
                </div>
            `;
        }
        quizContainer.appendChild(sectionCard);
    });

    // 3. Xử lý Logic Kéo Thả (Desktop & Mobile Touch)
    setupDragAndDrop();

    // 4. Xử lý Nộp Bài & Đồng Bộ Dữ Liệu Với Google Sheets
    document.getElementById('btn-submit').addEventListener('click', () => {
        const stuName = document.getElementById('student-name')?.value.trim();
        const stuClass = document.getElementById('student-class')?.value.trim();
        
        if (!stuName || !stuClass) {
            showToast("Vui lòng nhập Họ Tên và Lớp trước khi nộp bài!", true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        let total = 0;
        let correct = 0;
        let incorrect = 0;

        // Reset màu sắc
        document.querySelectorAll('.correct, .incorrect').forEach(el => {
            el.classList.remove('correct', 'incorrect');
        });

        // Chấm Radio (MCQ, T/F)
        document.querySelectorAll('.question-block[data-type="radio"]').forEach(block => {
            total++;
            const checked = block.querySelector('input[type="radio"]:checked');
            const answer = block.querySelector('input[type="radio"]').dataset.answer;
            
            if (checked) {
                if (checked.value === answer) {
                    correct++;
                    checked.closest('.option-label').classList.add('correct');
                } else {
                    incorrect++;
                    checked.closest('.option-label').classList.add('incorrect');
                }
            }
            
            block.querySelectorAll('input[type="radio"]').forEach(input => {
                if (input.value === answer) {
                    input.closest('.option-label').style.border = "2px solid var(--success)";
                }
            });
        });

        // Chấm Fill (Điền từ)
        document.querySelectorAll('.question-block[data-type="fill"]').forEach(block => {
            total++;
            const input = block.querySelector('.fill-input');
            const validAnswers = input.dataset.answers.split('|');
            const userVal = input.value.trim().toLowerCase();

            if (userVal !== "") {
                if (validAnswers.includes(userVal)) {
                    correct++;
                    input.classList.add('correct');
                } else {
                    incorrect++;
                    input.classList.add('incorrect');
                    input.value = input.value + ` (Đúng: ${validAnswers[0]})`;
                }
            } else {
                input.classList.add('incorrect');
                input.value = `(Chưa làm - Đúng: ${validAnswers[0]})`;
            }
        });

        // Chấm Match (Nối)
        document.querySelectorAll('.question-block[data-type="match"]').forEach(block => {
            total++;
            const select = block.querySelector('select');
            if (select.value !== "") {
                if (select.value === select.dataset.answer) {
                    correct++;
                    select.classList.add('correct');
                } else {
                    incorrect++;
                    select.classList.add('incorrect');
                }
            } else {
                select.classList.add('incorrect');
            }
        });

        // Chấm DragDrop (Kéo thả)
        document.querySelectorAll('.target-zone').forEach(zone => {
            total++;
            if (zone.querySelector('.draggable.locked')) {
                correct++;
            } else {
                zone.style.borderColor = "var(--error)";
            }
        });

        // Tính toán số liệu 8 cột
        const unanswered = total - correct - incorrect;
        const diem = parseFloat(((correct / total) * 10).toFixed(2));
        const percent = Math.round((correct / total) * 100);
        const timestamp = new Date().toLocaleString('vi-VN');

        // Khóa nút nộp bài để tránh click đúp
        const btnSubmit = document.getElementById('btn-submit');
        btnSubmit.innerText = "⏳ ĐANG GỬI KẾT QUẢ...";
        btnSubmit.style.pointerEvents = "none";

        // URL Google Apps Script của bạn
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzECEWMLY9WabC23CRFl0VxBzZGRvTw7D2lGlCSYB6q9v-sBU13kKIe9ioydqye1j85Zw/exec';

        const resultData = {
            hoTen: stuName,
            lop: stuClass,
            diem: diem,
            soCauDung: correct,
            soCauSai: incorrect,
            soCauChuaLam: unanswered,
            tongSoCau: total,
            thoiGian: timestamp
        };

        // Gửi kết quả về Google Sheets
        fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(resultData)
        })
        .then(() => {
            showToast(`✅ Đã lưu kết quả bài làm!`);
            btnSubmit.innerText = "ĐÃ NỘP BÀI";
            btnSubmit.style.backgroundColor = "#9ca3af";
            
            // Hiển thị khung Báo điểm cho Học sinh
            document.getElementById('res-name').innerText = `🎉 ${stuName} - Lớp ${stuClass}`;
            document.getElementById('res-score').innerText = `${correct}/${total} câu (Điểm: ${diem}/10)`;
            document.getElementById('res-percent').innerText = `Tỉ lệ đúng: ${percent}%`;
            document.getElementById('result-overlay').classList.remove('hidden');
        })
        .catch(error => {
            console.error('Lỗi khi gửi kết quả:', error);
            showToast("❌ Lỗi kết nối mạng, vui lòng nộp lại!", true);
            btnSubmit.innerText = "NỘP BÀI";
            btnSubmit.style.pointerEvents = "auto";
        });
    });

    // 5. Làm lại
    document.getElementById('btn-reset').addEventListener('click', () => {
        document.querySelectorAll('input[type="radio"]').forEach(el => { el.checked = false; el.closest('.option-label').style.border = '';});
        document.querySelectorAll('.fill-input').forEach(el => { el.value = ''; el.classList.remove('correct', 'incorrect'); });
        document.querySelectorAll('select').forEach(el => { el.value = ''; el.classList.remove('correct', 'incorrect'); });
        document.querySelectorAll('.correct, .incorrect').forEach(el => el.classList.remove('correct', 'incorrect'));
        
        // Reset DragDrop
        document.querySelectorAll('.draggable').forEach(item => {
            item.classList.remove('locked');
            item.setAttribute('draggable', 'true');
            const pool = item.closest('.drag-section').querySelector('.drag-pool');
            pool.appendChild(item);
        });
        document.querySelectorAll('.target-zone').forEach(zone => zone.style.borderColor = "");

        const btnSubmit = document.getElementById('btn-submit');
        btnSubmit.innerText = "NỘP BÀI";
        btnSubmit.style.pointerEvents = "auto";
        btnSubmit.style.backgroundColor = "";

        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast("Đã làm mới dữ liệu bài làm!");
    });

    document.getElementById('btn-close-result').addEventListener('click', () => {
        document.getElementById('result-overlay').classList.add('hidden');
    });
});

// --- Hệ thống Kéo Thả Cốt Lõi ---
function setupDragAndDrop() {
    const draggables = document.querySelectorAll('.draggable');
    const dropzones = document.querySelectorAll('.target-zone');
    
    // Desktop API
    draggables.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            if(item.classList.contains('locked')) return;
            e.dataTransfer.setData('text/plain', item.dataset.id);
            setTimeout(() => item.style.opacity = '0.5', 0);
        });
        item.addEventListener('dragend', () => item.style.opacity = '1');
    });

    dropzones.forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault();
            zone.classList.add('drag-over');
        });
        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
        zone.addEventListener('drop', e => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            const id = e.dataTransfer.getData('text/plain');
            const item = document.querySelector(`.draggable[data-id="${id}"]`);
            handleDropLogic(item, zone);
        });
    });

    // Mobile Touch API
    let draggedItem = null;
    let initialX, initialY;

    draggables.forEach(item => {
        item.addEventListener('touchstart', (e) => {
            if(item.classList.contains('locked')) return;
            draggedItem = item;
            const touch = e.touches[0];
            const rect = item.getBoundingClientRect();
            initialX = touch.clientX - rect.left;
            initialY = touch.clientY - rect.top;
            item.style.opacity = '0.7';
            item.style.position = 'fixed';
            item.style.zIndex = '1000';
            item.style.width = rect.width + 'px';
        }, {passive: false});

        item.addEventListener('touchmove', (e) => {
            if(!draggedItem) return;
            e.preventDefault(); 
            const touch = e.touches[0];
            draggedItem.style.left = (touch.clientX - initialX) + 'px';
            draggedItem.style.top = (touch.clientY - initialY) + 'px';
        }, {passive: false});

        item.addEventListener('touchend', (e) => {
            if(!draggedItem) return;
            draggedItem.style.opacity = '1';
            draggedItem.style.position = '';
            draggedItem.style.zIndex = '';
            draggedItem.style.left = '';
            draggedItem.style.top = '';
            draggedItem.style.width = '';

            const touch = e.changedTouches[0];
            draggedItem.style.display = 'none';
            const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
            draggedItem.style.display = 'block';

            const zone = targetElement ? targetElement.closest('.target-zone') : null;
            if (zone) {
                handleDropLogic(draggedItem, zone);
            }
            draggedItem = null;
        });
    });
}

function handleDropLogic(item, zone) {
    if(!item || item.classList.contains('locked')) return;
    
    if(zone.dataset.accept === item.dataset.id) {
        zone.appendChild(item);
        item.classList.add('locked');
        item.removeAttribute('draggable');
        showToast("Chính xác! 🎉");
    } else {
        showToast("Chưa đúng vị trí, thử lại nhé!", true);
        const pool = item.closest('.drag-section').querySelector('.drag-pool');
        pool.appendChild(item);
    }
}

function showToast(msg, isError = false) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    if(isError) toast.classList.add('error');
    else toast.classList.remove('error');
    
    toast.classList.remove('hidden');
    setTimeout(() => { toast.classList.add('hidden'); }, 2000);
}