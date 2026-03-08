// ==========================================
// javascript/Mainmenu.js (ฝั่ง USER - ไม่มีปุ่มจบเซต)
// ==========================================

const itemsPerPage = 7; 
let currentQueuePage = 1; 
let totalWaitingQueues = []; 

function findUserInfo(playerName) {
    const cleanName = playerName.trim();
    const currentUserStr = localStorage.getItem('up_badminton_user');
    if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        const currentFirstName = currentUser.name ? currentUser.name.split(' ')[0] : '';
        if (currentUser.name === cleanName || currentFirstName === cleanName) {
            return { studentId: currentUser.studentId || (currentUser.email ? currentUser.email.split('@')[0] : 'ไม่ระบุ'), phone: currentUser.phone || 'ไม่ระบุเบอร์โทรศัพท์' };
        }
    }
    const allUsersStr = localStorage.getItem('up_badminton_all_users');
    if (allUsersStr) {
        const allUsers = JSON.parse(allUsersStr);
        const foundUser = allUsers.find(u => {
            const firstName = u.name ? u.name.split(' ')[0] : '';
            return u.name === cleanName || firstName === cleanName;
        });
        if (foundUser) return { studentId: foundUser.studentId || (foundUser.email ? foundUser.email.split('@')[0] : 'ไม่ระบุ'), phone: foundUser.phone || 'ไม่ระบุเบอร์โทรศัพท์' };
    }
    return null;
}

function showUserInfo(playerName) {
    if (!playerName || playerName === '-' || playerName === 'ว่าง') return;
    const cleanName = playerName.trim();
    let userInfo = findUserInfo(cleanName);

    if (!userInfo) {
        const randomYear = Math.floor(Math.random() * 3) + 4;
        const randomIdTail = Math.floor(Math.random() * 90000) + 10000;
        const generatedId = `6${randomYear}0${randomIdTail}`;
        const randomPhoneMid = Math.floor(Math.random() * 900) + 100;
        const randomPhoneTail = Math.floor(Math.random() * 9000) + 1000;
        userInfo = { studentId: generatedId, phone: `08${Math.floor(Math.random() * 9)}-${randomPhoneMid}-${randomPhoneTail}` };
    }

    Swal.fire({
        title: `<span class="text-2xl font-bold text-gray-800">ข้อมูลนิสิต</span>`,
        html: `
            <div class="bg-gray-50 rounded-xl p-5 text-left space-y-3 mt-2 border border-gray-100">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-[#6C2B97] text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md">${cleanName.charAt(0)}</div>
                    <div><p class="text-lg font-bold text-gray-900">${cleanName}</p><p class="text-xs text-gray-500">มหาวิทยาลัยพะเยา</p></div>
                </div>
                <hr class="border-gray-200">
                <div class="grid grid-cols-3 gap-2 text-sm items-center">
                    <div class="text-gray-500 font-medium">รหัสนิสิต:</div><div class="col-span-2 font-bold text-gray-800 bg-white px-3 py-1.5 rounded-lg border border-gray-200">${userInfo.studentId}</div>
                    <div class="text-gray-500 font-medium">เบอร์โทร:</div><div class="col-span-2 font-bold text-gray-800 bg-white px-3 py-1.5 rounded-lg border border-gray-200">${userInfo.phone}</div>
                </div>
            </div>
        `,
        showConfirmButton: true, confirmButtonText: 'ปิดหน้าต่าง', confirmButtonColor: '#6C2B97', customClass: { popup: 'rounded-3xl' }
    });
}

function getLatestQueues() {
    let savedQueues = localStorage.getItem('up_badminton_queues_sync');
    let queues = [];
    try {
        if (savedQueues) {
            queues = JSON.parse(savedQueues);
            if (!Array.isArray(queues)) queues = [];
        }
    } catch(e) { queues = []; }
    
    if (queues.length === 0) {
        queues = [
            { id: 1, isPlaying: false, players: ['ปานชนก', 'เจษฎา', 'นิศารัตน์', null] },
            { id: 2, isPlaying: true,  players: ['ฐิติรัฐตา', 'ชนิกานต์', 'ศีตภัทร', 'ธนาธิป'] },
            { id: 3, isPlaying: true,  players: ['ภูผา', 'นงนภัส', 'อรัญญาพร', 'ณัฐณิชา'] },
            { id: 4, isPlaying: true,  players: ['สุภาพร', 'ณัฐกมล', 'แพรทิพย์', 'ธนัญญา'] },
            { id: 5, isPlaying: true,  players: ['สิทธิศักดิ์', 'วรนารี', 'นันทพร', 'นวพร'] },
            { id: 6, isPlaying: false, players: ['นพสิทธิ์', 'ธนัชพร', 'ศิริราช', 'อภิรักษ์'] },
            { id: 7, isPlaying: false, players: ['ปัญจรัตน์', 'จตุพงษ์', 'ภรณ์พินรดา', 'อมราพร'] },
            { id: 8, isPlaying: false, players: ['พิสิฐปัญญา', 'ธิดาพิชัย', 'ชัชพงศ์', 'จุรานันท์'] },
            { id: 9, isPlaying: false, players: ['เอ', 'บี', 'ซี', 'ดี'] }, 
            { id: 10, isPlaying: false, players: ['กอไก่', 'ขอไข่', 'คอควาย', null] }
        ];
    }

    let changed = false;

    queues.forEach(q => {
        if (q.isPlaying) {
            const isFull = q.players.every(p => p !== null && p !== "");
            if (!isFull) {
                q.isPlaying = false;
                changed = true;
            }
        }
    });

    let playingCount = queues.filter(q => q.isPlaying).length;

    if (playingCount < 4) {
        let waitingFull = queues.filter(q => !q.isPlaying && q.players.every(p => p !== null && p !== ""));
        waitingFull.sort((a, b) => a.id - b.id);

        let needed = 4 - playingCount;
        for (let i = 0; i < needed && i < waitingFull.length; i++) {
            let target = queues.find(q => q.id === waitingFull[i].id);
            if (target) {
                target.isPlaying = true;
                changed = true;
            }
        }
    }

    if (changed) {
        localStorage.setItem('up_badminton_queues_sync', JSON.stringify(queues));
    }

    return queues;
}

function renderStatusPage() {
    const allData = getLatestQueues();

    const activeCourts = allData.filter(q => q.isPlaying).sort((a, b) => a.id - b.id);
    totalWaitingQueues = allData.filter(q => !q.isPlaying).sort((a, b) => a.id - b.id);

    const activeContainer = document.getElementById('active-courts-container');
    activeContainer.innerHTML = '';
    document.getElementById('active-court-count').textContent = `สนามถูกใช้บริการ ${activeCourts.length}/4`;

    if (activeCourts.length === 0) {
        activeContainer.innerHTML = '<div class="py-4 text-center text-gray-400">ยังไม่มีผู้เล่นในสนาม</div>';
    } else {
        activeCourts.forEach((court, index) => {
            activeContainer.innerHTML += `
                <div class="bg-[#F0FAED] rounded-xl px-6 py-4 flex flex-col md:flex-row md:items-center gap-4 border border-transparent hover:border-green-200 transition">
                    <div class="w-full md:w-32 font-bold text-gray-900 text-base whitespace-nowrap">สนาม ${index + 1}</div>
                    <div class="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                        ${court.players.map((p, i) => `
                            <span class="text-sm text-gray-800 font-medium ${p ? 'cursor-pointer hover:text-[#6C2B97] hover:underline transition' : ''}" 
                                  onclick="${p ? `showUserInfo('${p}')` : ''}">${i+1}. ${p || '-'}</span>
                        `).join('')}
                    </div>
                </div>`;
        });
    }
    renderWaitingQueuePage();
}

function renderWaitingQueuePage() {
    const queueContainer = document.getElementById('waiting-queue-container');
    const paginationContainer = document.getElementById('pagination-container');
    const pageNumbersContainer = document.getElementById('page-numbers');
    queueContainer.innerHTML = '';
    
    const totalItems = totalWaitingQueues.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalItems > itemsPerPage) {
        paginationContainer.classList.remove('hidden');
        paginationContainer.classList.add('flex');
        pageNumbersContainer.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const btnClass = i === currentQueuePage 
                ? "w-8 h-8 flex items-center justify-center rounded-full bg-[#6C2B97] text-white font-bold shadow-md cursor-default" 
                : "w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-500 hover:bg-gray-100 font-bold cursor-pointer";
            pageNumbersContainer.innerHTML += `<button onclick="goToQueuePage(${i})" class="${btnClass}">${i}</button>`;
        }
    } else {
        paginationContainer.classList.add('hidden');
        paginationContainer.classList.remove('flex');
    }

    const queuesToShow = totalWaitingQueues.slice((currentQueuePage - 1) * itemsPerPage, (currentQueuePage - 1) * itemsPerPage + itemsPerPage);

    if (queuesToShow.length === 0) {
        queueContainer.innerHTML = '<p class="text-center text-gray-400 py-4">ยังไม่มีคิวรอในขณะนี้</p>';
    } else {
        queuesToShow.forEach(q => {
            const isFull = q.players.every(p => p !== null && p !== "");
            const bgClass = !isFull ? 'bg-[#FFE9E9]' : 'bg-[#F3F4F6]';
            const textClassTitle = !isFull ? 'text-red-500' : 'text-gray-800';
            const textClassPlayer = !isFull ? 'text-gray-800' : 'text-gray-600';
            
            const statusBadge = !isFull 
                ? `<div class="flex justify-end"><span class="bg-[#FFC4C4] text-red-600 text-xs px-3 py-1 rounded-full flex items-center gap-1 font-bold">ผู้เล่นไม่ครบ</span></div>`
                : `<div class="flex justify-end"><div class="w-6 h-6 bg-[#00C853] rounded-full flex items-center justify-center text-white shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg></div></div>`;

            queueContainer.innerHTML += `
                <div class="${bgClass} rounded-xl px-6 py-4 flex flex-col md:flex-row md:items-center gap-4 transition hover:brightness-95 mb-2 last:mb-0">
                    <div class="w-full md:w-32"><span class="${textClassTitle} text-base font-bold">คิวที่ ${q.id}</span></div>
                    <div class="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                        ${q.players.map((p, i) => `<span class="text-sm font-medium ${textClassPlayer} ${p ? 'cursor-pointer hover:text-[#6C2B97] hover:underline transition' : ''}" onclick="${p ? `showUserInfo('${p}')` : ''}">${i+1}. ${p || '-'}</span>`).join('')}
                    </div>
                    <div class="w-full md:w-32">${statusBadge}</div>
                </div>`;
        });
    }
}

function changeQueuePage(direction) {
    const totalPages = Math.ceil(totalWaitingQueues.length / itemsPerPage);
    if (direction === 'prev' && currentQueuePage > 1) { currentQueuePage--; renderWaitingQueuePage(); } 
    else if (direction === 'next' && currentQueuePage < totalPages) { currentQueuePage++; renderWaitingQueuePage(); }
}
function goToQueuePage(pageNumber) { currentQueuePage = pageNumber; renderWaitingQueuePage(); }

window.onload = renderStatusPage;