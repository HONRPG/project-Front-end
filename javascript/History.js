// javascript/history.js

const avatarColors = ['bg-purple-600', 'bg-pink-500', 'bg-indigo-500', 'bg-blue-500'];
const MAX_ACTIVE_COURTS = 4;

let cancelData = { queueId: null, playerName: null };

function getLoggedInUser() {
    const savedData = localStorage.getItem('up_badminton_user');
    return savedData ? JSON.parse(savedData) : null;
}

function renderUI() {
    const container = document.getElementById('queues-container');
    const select = document.getElementById('queueSelect');
    
    let queues = JSON.parse(localStorage.getItem('up_badminton_queues_sync'));
    
    // รีเซ็ตข้อมูลให้มี isPlaying ตรงกับหน้า Mainmenu 
    if (!queues || queues.length === 0) {
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
        localStorage.setItem('up_badminton_queues_sync', JSON.stringify(queues));
    }

    const nameInput = document.getElementById('name');
    const studentIdInput = document.getElementById('studentId');
    const user = getLoggedInUser();
    
    let currentUserName = '';
    if (user && user.name) {
        currentUserName = user.name.split(' ')[0];
        nameInput.value = user.name; 
        if (user.email) studentIdInput.value = user.email.split('@')[0];
    }

    const currentSelected = select.value;
    container.innerHTML = ''; 
    select.innerHTML = '<option value="" disabled selected>เลือกคิวที่ต้องการ</option>'; 

    queues.forEach((q) => {
        const emptySlots = q.players.filter(p => p === null || p === "").length;
        const isFull = (emptySlots === 0);
        
        let statusText = '';
        let statusClass = '';

        // --- อัปเดตตรรกะสถานะให้ตรงกับระบบใหม่ ---
        if (q.isPlaying) {
            statusText = 'กำลังเล่น';
            statusClass = 'text-green-500';
        } else if (isFull) {
            statusText = 'รอสนาม';
            statusClass = 'text-orange-500';
        } else {
            statusText = 'รอคนครบ';
            statusClass = 'text-red-500';
        }
        
        let playersHTML = '';
        q.players.forEach((player, idx) => {
            if (player) {
                let cancelBtn = '';
                
                // *** เงื่อนไขใหม่: แสดงปุ่มกากบาท ก็ต่อเมื่อเป็นชื่อตัวเอง และ คิวยังไม่ได้ถูกดึงไปเล่น (!q.isPlaying) ***
                if (currentUserName && player.toLowerCase() === currentUserName.toLowerCase() && !q.isPlaying) {
                    cancelBtn = `
                        <button onclick="openCancelModal(${q.id}, '${player}')" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-md z-10 transition hover:scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    `;
                }

                playersHTML += `
                    <div class="player-slot bg-purple-50 animate-pop relative">
                        ${cancelBtn}
                        <div class="player-avatar ${avatarColors[idx % 4]}">${player.charAt(0)}</div>
                        <span class="text-xs font-bold text-gray-800 truncate w-full text-center">${player}</span>
                    </div>`;
            } else {
                playersHTML += `
                    <button onclick="quickJoin(${q.id})" class="player-slot bg-gray-200 hover:bg-gray-300 transition cursor-pointer group border-2 border-dashed border-gray-300">
                        <div class="w-8 h-8 rounded-full border-2 border-gray-500 flex items-center justify-center text-gray-600 group-hover:border-gray-700 group-hover:text-gray-800 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
                        </div>
                        <span class="text-xs font-bold text-gray-600 group-hover:text-gray-800">เข้าร่วม</span>
                    </button>`;
            }
        });

        container.innerHTML += `
            <div class="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
                <div class="flex justify-between items-center mb-6">
                    <div class="flex items-center gap-3">
                        <span class="bg-u-purple text-white text-sm font-bold px-3 py-1 rounded-lg shadow-sm">คิวที่ ${q.id}</span>
                        <span class="${statusClass} font-bold text-sm">${statusText}</span>
                    </div>
                </div>
                <div class="grid grid-cols-4 gap-4">${playersHTML}</div>
            </div>`;

        // คิวที่ยังไม่เต็มเท่านั้นที่จะปรากฏใน Dropdown ตัวเลือก (และต้องไม่โดนล็อกเป็น isPlaying ไปแล้ว)
        if (!isFull && !q.isPlaying) {
            select.innerHTML += `<option value="${q.id}">คิวที่ ${q.id} (ว่าง ${emptySlots} ที่)</option>`;
        }
    });

    select.innerHTML += `<option value="new" class="text-u-purple font-bold">+ สร้างคิวใหม่</option>`;
    if(currentSelected) select.value = currentSelected;
}

function quickJoin(id) {
    document.getElementById('queueSelect').value = id;
    document.getElementById('booking-form').classList.add('ring-4', 'ring-purple-200');
    setTimeout(() => document.getElementById('booking-form').classList.remove('ring-4', 'ring-purple-200'), 600);
}

function focusNewQueue() {
    document.getElementById('queueSelect').value = 'new';
    document.getElementById('booking-form').classList.add('ring-4', 'ring-purple-200');
    setTimeout(() => document.getElementById('booking-form').classList.remove('ring-4', 'ring-purple-200'), 600);
}

function submitQueue() {
    const user = getLoggedInUser();
    const queueVal = document.getElementById('queueSelect').value;

    if (!user) {
        Swal.fire({ icon: 'error', title: 'กรุณาเข้าสู่ระบบ', confirmButtonColor: '#6C2B97' });
        return;
    }
    if (!queueVal) {
        Swal.fire('กรุณาเลือกคิว', '', 'warning');
        return;
    }

    const chosenName = document.getElementById('name').value.trim().split(' ')[0];

    let allQueues = JSON.parse(localStorage.getItem('up_badminton_queues_sync')) || [];

    const isDuplicate = allQueues.some(q => 
        q.players.some(p => p && p.toLowerCase() === chosenName.toLowerCase())
    );

    if (isDuplicate) {
        Swal.fire({ icon: 'warning', title: 'คุณมีชื่ออยู่ในคิวแล้ว', confirmButtonColor: '#6C2B97' });
        return;
    }

    if (queueVal === 'new') {
        const nextId = allQueues.length > 0 ? Math.max(...allQueues.map(q => q.id)) + 1 : 1;
        // สร้างคิวใหม่ ค่าตั้งต้น isPlaying = false เสมอ
        allQueues.push({ id: nextId, isPlaying: false, players: [chosenName, null, null, null] });
    } else {
        const target = allQueues.find(q => q.id == queueVal);
        if (target) {
            const emptyIdx = target.players.indexOf(null);
            if (emptyIdx !== -1) target.players[emptyIdx] = chosenName;
        }
    }

    localStorage.setItem('up_badminton_queues_sync', JSON.stringify(allQueues));
    Swal.fire({ icon: 'success', title: 'ลงชื่อสำเร็จ!', showConfirmButton: false, timer: 1500 });
    document.getElementById('queueSelect').value = '';
    renderUI();
}

function openCancelModal(qId, pName) {
    cancelData = { queueId: qId, playerName: pName };
    document.getElementById('cancelModal').classList.remove('hidden');
    document.getElementById('cancelModal').classList.add('flex');
}

function closeCancelModal() {
    document.getElementById('cancelModal').classList.add('hidden');
    document.getElementById('cancelModal').classList.remove('flex');
    const checkedRadio = document.querySelector('input[name="cancelReason"]:checked');
    if(checkedRadio) checkedRadio.checked = false;
    document.getElementById('cancelReasonOther').value = '';
}

function confirmCancel() {
    const reasonForm = document.querySelector('input[name="cancelReason"]:checked');
    if(!reasonForm) {
        Swal.fire({ icon: 'warning', title: 'กรุณาระบุเหตุผล', confirmButtonColor: '#6C2B97' });
        return;
    }
    
    let reason = reasonForm.value;
    if(reason === 'อื่นๆ') {
        reason = document.getElementById('cancelReasonOther').value.trim();
        if(!reason) {
            Swal.fire({ icon: 'warning', title: 'กรุณาระบุเหตุผลเพิ่มเติม', confirmButtonColor: '#6C2B97' });
            return;
        }
    }

    let queues = JSON.parse(localStorage.getItem('up_badminton_queues_sync')) || [];
    let qIndex = queues.findIndex(q => q.id === cancelData.queueId);
    
    if(qIndex > -1) {
        let pIndex = queues[qIndex].players.findIndex(p => p && p.toLowerCase() === cancelData.playerName.toLowerCase());
        if(pIndex > -1) {
            queues[qIndex].players[pIndex] = null;
            
            // ถ้าออกจนหมดให้ลบคิวทิ้งเลย
            if(queues[qIndex].players.every(p => p === null)) {
                queues.splice(qIndex, 1);
            }
            
            localStorage.setItem('up_badminton_queues_sync', JSON.stringify(queues));
            closeCancelModal();
            
            document.getElementById('successCancelQId').innerText = cancelData.queueId;
            document.getElementById('successCancelReason').innerText = reason;
            document.getElementById('successCancelModal').classList.remove('hidden');
            document.getElementById('successCancelModal').classList.add('flex');
            
            renderUI();
        }
    }
}

function closeSuccessModal() {
    document.getElementById('successCancelModal').classList.add('hidden');
    document.getElementById('successCancelModal').classList.remove('flex');
}

window.onload = renderUI;