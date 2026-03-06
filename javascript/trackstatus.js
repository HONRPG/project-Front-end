function getLatestQueues() {
        let savedQueues = localStorage.getItem('up_badminton_queues');
        let queues = savedQueues ? JSON.parse(savedQueues) : [];
        
        // ถ้าไม่มีข้อมูล หรือมีน้อยไป ให้สร้าง Mock Data แบบในรูปภาพเป๊ะๆ
        if (queues.length <= 1) {
            queues = [
                { id: 2, players: ['ภูผา', 'นงนภัส', 'อรัญญาพร', 'ณัฐณิชา'] },
                { id: 3, players: ['สุภาพร', 'ณัฐกมล', 'แพรทิพย์', 'ธนัญญา'] },
                { id: 4, players: ['สิทธิศักดิ์', 'วรนารี', 'นันทพร', 'นวพร'] },
                { id: 5, players: ['ฐิติรัฐตา', 'ชนิกานต์', 'ศีตภัทร', 'ธนาธิป'] },
                { id: 1, players: ['ปานชนก', 'เจษฎา', 'นิศารัตน์', null] }, // คิวขาด 1 คน
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
        
        // 1. แยกคิวที่คนครบ กับคนไม่ครบ
        const fullQueues = [];
        const incompleteQueues = [];

        allData.forEach(q => {
            const isFull = q.players.every(p => p !== null);
            if (isFull) fullQueues.push(q);
            else incompleteQueues.push(q);
        });

        // 2. จัดสรรสนาม: 4 คิวแรกที่ "คนครบ" จะได้สิทธิ์กำลังเล่น
        const activeCourts = fullQueues.slice(0, 4);
        
        // 3. จัดคิวรอ: คิวที่คนไม่ครบ + คิวที่คนครบแต่สนามเต็ม (จัดเรียงตาม ID)
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
                            ${court.players.map((p, i) => `<span class="text-sm text-gray-800 font-medium">${i+1}.${p || '-'}</span>`).join('')}
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
                const isFull = q.players.every(p => p !== null);
                
                // คลาสและสีตามดีไซน์
                const bgClass = !isFull ? 'bg-[#FFE9E9]' : 'bg-[#F3F4F6]';
                const textClassTitle = !isFull ? 'text-red-500' : 'text-gray-800';
                const textClassPlayer = !isFull ? 'text-gray-800' : 'text-gray-600';
                
                // ไอคอนด้านขวาสุด
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
                            ${q.players.map((p, i) => `<span class="text-sm font-medium ${textClassPlayer}">${i+1}.${p || '-'}</span>`).join('')}
                        </div>
                        <div class="w-full md:w-32">${statusBadge}</div>
                    </div>`;
                queueContainer.innerHTML += rowHTML;
            });
        }
    }

    window.onload = renderStatusPage;