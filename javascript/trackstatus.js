function findUserInfo(playerName) {
    const cleanName = playerName.trim();

    // ลำดับที่ 1: เช็คจากข้อมูลคนที่กำลังล็อกอินอยู่ (ดึงข้อมูลจริง)
    const currentUserStr = localStorage.getItem('up_badminton_user');
    if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        // เช็คชื่อเต็ม หรือ ชื่อจริง (คำแรก)
        const currentFirstName = currentUser.name ? currentUser.name.split(' ')[0] : '';
        
        if (currentUser.name === cleanName || currentFirstName === cleanName) {
            return {
                // เอารหัสนิสิตมาโชว์ ถ้าไม่มีให้เอาอีเมลตัด @up.ac.th ออก
                studentId: currentUser.studentId || (currentUser.email ? currentUser.email.split('@')[0] : 'ไม่ระบุ'),
                phone: currentUser.phone || 'ไม่ระบุเบอร์โทรศัพท์'
            };
        }
    }

    // ลำดับที่ 2: เช็คจากฐานข้อมูลคนสมัครทั้งหมด (ถ้ามีการบันทึกไว้ในระบบ)
    const allUsersStr = localStorage.getItem('up_badminton_all_users');
    if (allUsersStr) {
        const allUsers = JSON.parse(allUsersStr);
        const foundUser = allUsers.find(u => {
            const firstName = u.name ? u.name.split(' ')[0] : '';
            return u.name === cleanName || firstName === cleanName;
        });

        if (foundUser) {
            return {
                studentId: foundUser.studentId || (foundUser.email ? foundUser.email.split('@')[0] : 'ไม่ระบุ'),
                phone: foundUser.phone || 'ไม่ระบุเบอร์โทรศัพท์'
            };
        }
    }

    // ลำดับที่ 3: ข้อมูลจำลองสำหรับรายชื่อตั้งต้น (เพื่อให้คิวตัวอย่างกดดูได้)
    const mockUsersInfo = {
        'ภูผา': { studentId: '64000001', phone: '081-111-1111' },
        'นงนภัส': { studentId: '64000002', phone: '082-222-2222' },
        'อรัญญาพร': { studentId: '65000003', phone: '083-333-3333' },
        'ณัฐณิชา': { studentId: '65000004', phone: '084-444-4444' },
        'สมชาย': { studentId: '66000005', phone: '085-555-5555' },
        'ปานชนก': { studentId: '66000006', phone: '086-666-6666' }
    };

    return mockUsersInfo[cleanName] || null;
}

// ==========================================
// 2. ฟังก์ชันแสดง Popup ข้อมูลผู้ใช้
// ==========================================
function showUserInfo(playerName) {
    if (!playerName || playerName === '-' || playerName === 'ว่าง') return;

    const cleanName = playerName.trim();
    
    // ค้นหาข้อมูลจริง ถ้าไม่เจอให้ใส่ค่า Default
    const userInfo = findUserInfo(cleanName) || { 
        studentId: 'ไม่พบข้อมูลในระบบ', 
        phone: 'ไม่พบข้อมูลในระบบ' 
    };

    // แสดง Popup
    Swal.fire({
        title: `<span class="text-2xl font-bold text-gray-800">ข้อมูลนิสิต</span>`,
        html: `
            <div class="bg-gray-50 rounded-xl p-5 text-left space-y-3 mt-2 border border-gray-100">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-[#6C2B97] text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md">
                        ${cleanName.charAt(0)}
                    </div>
                    <div>
                        <p class="text-lg font-bold text-gray-900">${cleanName}</p>
                        <p class="text-xs text-gray-500">มหาวิทยาลัยพะเยา</p>
                    </div>
                </div>
                <hr class="border-gray-200">
                <div class="grid grid-cols-3 gap-2 text-sm items-center">
                    <div class="text-gray-500 font-medium">รหัสนิสิต:</div>
                    <div class="col-span-2 font-bold text-gray-800 bg-white px-3 py-1.5 rounded-lg border border-gray-200">${userInfo.studentId}</div>
                    
                    <div class="text-gray-500 font-medium">เบอร์โทร:</div>
                    <div class="col-span-2 font-bold text-gray-800 bg-white px-3 py-1.5 rounded-lg border border-gray-200">${userInfo.phone}</div>
                </div>
            </div>
        `,
        showConfirmButton: true,
        confirmButtonText: 'ปิดหน้าต่าง',
        confirmButtonColor: '#6C2B97',
        customClass: { popup: 'rounded-3xl' }
    });
}

// ==========================================
// 3. ระบบแสดงผลคิว
// ==========================================
function getLatestQueues() {
    let savedQueues = localStorage.getItem('up_badminton_queues');
    let queues = [];
    
    try {
        if (savedQueues) {
            queues = JSON.parse(savedQueues);
            if (!Array.isArray(queues) || (queues.length > 0 && !Array.isArray(queues[0].players))) {
                queues = [];
            }
        }
    } catch(e) {
        queues = [];
    }
    
    if (queues.length <= 1) {
        queues = [
            { id: 1, players: ['สมชาย', 'ธนภัทร', 'กิตติศักดิ์', 'ณัฐวุฒิ'] },
            { id: 2, players: ['ศิริพร', 'จิราพร', 'พรพิมล', 'สุจิตรา'] },
            { id: 3, players: ['พงศกร', 'วีระพล', 'เอกราช', 'ธนธรณ์'] },
            { id: 4, players: ['รัตนา', 'อารียา', null, null] },
            { id: 5, players: ['ชัยวัฒน์', null, null, null] },
            { id: 6, players: ['นพสิทธิ์', 'ธนัชพร', 'ศิริราช', 'อภิรักษ์'] },
            { id: 7, players: ['ปัญจรัตน์', 'จตุพงษ์', 'ภรณ์พินรดา', 'อมราพร'] },
            { id: 8, players: ['พิสิฐปัญญา', 'ธิดาพิชัย', 'ชัชพงศ์', 'จุรานันท์'] }
        ];
        localStorage.setItem('up_badminton_queues', JSON.stringify(queues));
    }
    return queues;
}

function renderStatusPage() {
    const allData = getLatestQueues();
    
    const fullQueues = [];
    const incompleteQueues = [];

    allData.forEach(q => {
        const isFull = q.players.every(p => p !== null && p !== "");
        if (isFull) fullQueues.push(q);
        else incompleteQueues.push(q);
    });

    const activeCourts = fullQueues.slice(0, 4);
    const waitingCourtsFull = fullQueues.slice(4);
    const waitingList = [...incompleteQueues, ...waitingCourtsFull].sort((a, b) => a.id - b.id);

    // --- Render คิวที่กำลังเล่น ---
    const activeContainer = document.getElementById('active-courts-container');
    activeContainer.innerHTML = '';
    document.getElementById('active-court-count').textContent = `สนามถูกใช้บริการ ${activeCourts.length}/4`;

    if (activeCourts.length === 0) {
        activeContainer.innerHTML = '<div class="py-4 text-center text-gray-400">ยังไม่มีผู้เล่นในสนาม</div>';
    } else {
        activeCourts.forEach((court, index) => {
            const cardHTML = `
                <div class="bg-[#F0FAED] rounded-xl px-6 py-4 flex flex-col md:flex-row md:items-center gap-4">
                    <div class="w-full md:w-32 font-bold text-gray-900 text-base">สนาม ${index + 1}</div>
                    <div class="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                        ${court.players.map((p, i) => `
                            <span class="text-sm text-gray-800 font-medium ${p ? 'cursor-pointer hover:text-[#6C2B97] hover:underline transition' : ''}" 
                                  onclick="${p ? `showUserInfo('${p}')` : ''}">
                                ${i+1}. ${p || '-'}
                            </span>
                        `).join('')}
                    </div>
                </div>`;
            activeContainer.innerHTML += cardHTML;
        });
    }

    // --- Render คิวรอสนาม ---
    const queueContainer = document.getElementById('waiting-queue-container');
    queueContainer.innerHTML = '';

    if (waitingList.length === 0) {
        queueContainer.innerHTML = '<p class="text-center text-gray-400 py-4">ยังไม่มีคิวรอในขณะนี้</p>';
    } else {
        waitingList.forEach(q => {
            const isFull = q.players.every(p => p !== null && p !== "");
            
            const bgClass = !isFull ? 'bg-[#FFE9E9]' : 'bg-[#F3F4F6]';
            const textClassTitle = !isFull ? 'text-red-500' : 'text-gray-800';
            const textClassPlayer = !isFull ? 'text-gray-800' : 'text-gray-600';
            
            let statusBadge = '';
            if (!isFull) {
                statusBadge = `
                    <div class="flex justify-end">
                        <span class="bg-[#FFC4C4] text-red-600 text-xs px-3 py-1 rounded-full flex items-center gap-1 font-bold">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                            </svg>
                            ผู้เล่นไม่ครบ
                        </span>
                    </div>`;
            } else {
                statusBadge = `
                    <div class="flex justify-end">
                        <div class="w-6 h-6 bg-[#00C853] rounded-full flex items-center justify-center text-white shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                        </div>
                    </div>`;
            }

            const rowHTML = `
                <div class="${bgClass} rounded-xl px-6 py-4 flex flex-col md:flex-row md:items-center gap-4 transition hover:brightness-95">
                    <div class="w-full md:w-32">
                        <span class="${textClassTitle} text-base font-bold">คิวที่ ${q.id}</span>
                    </div>
                    <div class="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                        ${q.players.map((p, i) => `
                            <span class="text-sm font-medium ${textClassPlayer} ${p ? 'cursor-pointer hover:text-[#6C2B97] hover:underline transition' : ''}"
                                  onclick="${p ? `showUserInfo('${p}')` : ''}">
                                ${i+1}. ${p || '-'}
                            </span>
                        `).join('')}
                    </div>
                    <div class="w-full md:w-32">${statusBadge}</div>
                </div>`;
            queueContainer.innerHTML += rowHTML;
        });
    }
}

window.onload = renderStatusPage;