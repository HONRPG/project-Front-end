// Adminstatistics.js

// --- ข้อมูลจำลอง (Mock Data) ที่ปรับแก้ให้ตัวเลขสัมพันธ์กันแล้ว ---
const mockTodayData = {
    users: 20, // 5 คิว x 4 คน
    queues: 5, // มีคิวในลิสต์ 5 คิวพอดี
    // เอาเวลาด้านขวาออกตามที่ต้องการ
    finishedQueues: [
        { id: 1, players: 'สมชาย, ธนภัทร, กิตติศักดิ์, ณัฐวุฒิ' },
        { id: 2, players: 'ศิริพร, จิราพร, พรพิมล, สุจิตรา' },
        { id: 3, players: 'พงศกร, วีระพล, เอกราช, ภูวดล' },
        { id: 4, players: 'รัตนา, อารียา, สุชาดา, นิศา' },
        { id: 5, players: 'ชัยวัฒน์, เอกชัย, ปรีชา, สมเกียรติ' }
    ]
};

const mockMonthData = {
    users: 340, // จำนวนคิว 85 * 4 = 340 คน
    queues: 85,
    topUsers: [
        { rank: 1, name: "ธนธรณ์ โท๊ะทองซิว", count: 24 },
        { rank: 2, name: "สมชาย ใจดี", count: 20 },
        { rank: 3, name: "ณัฐวุฒิ ยอดเยี่ยม", count: 18 },
        { rank: 4, name: "สุจิตรา น่ารัก", count: 15 },
        { rank: 5, name: "ภูผา แข็งแกร่ง", count: 14 },
        { rank: 6, name: "นงนภัส สวยงาม", count: 12 },
        { rank: 7, name: "เอกราช เกรียงไกร", count: 10 },
        { rank: 8, name: "จิราพร อ่อนหวาน", count: 9 },
        { rank: 9, name: "สิทธิศักดิ์ มั่นคง", count: 7 },
        { rank: 10, name: "อารียา สดใส", count: 5 }
    ]
};

// --- ฟังก์ชันสลับ Tab ---
function switchTab(tab) {
    const btnToday = document.getElementById('btn-today');
    const btnMonth = document.getElementById('btn-month');
    
    const titleUsers = document.getElementById('stat-title-users');
    const titleQueues = document.getElementById('stat-title-queues');
    const numUsers = document.getElementById('stat-number-users');
    const numQueues = document.getElementById('stat-number-queues');
    
    const listTitle = document.getElementById('list-title');
    const listSubtitle = document.getElementById('list-subtitle');
    const listContainer = document.getElementById('list-container');

    listContainer.innerHTML = ''; // ล้างข้อมูลเก่าออกก่อน

    // ดึงตัวเลขปัจจุบันมาแปลงเป็น int เพื่อให้แอนิเมชันรันต่อเนื่อง (เอาลูกน้ำออกด้วยเผื่อมี)
    const currentUsers = parseInt(numUsers.textContent.replace(/,/g, '')) || 0;
    const currentQueues = parseInt(numQueues.textContent.replace(/,/g, '')) || 0;

    if (tab === 'today') {
        // เปลี่ยน Style ปุ่ม
        btnToday.className = "bg-u-purple text-white px-6 py-2 rounded-full text-sm font-bold shadow-sm transition-all";
        btnMonth.className = "bg-transparent text-gray-600 hover:bg-white px-6 py-2 rounded-full text-sm font-bold transition-all";
        
        // เปลี่ยนข้อความบนการ์ด
        titleUsers.textContent = "จำนวนคนเข้าใช้บริการวันนี้";
        titleQueues.textContent = "จำนวนคิวทั้งหมด (วันนี้)";
        listTitle.textContent = "ลำดับคิวที่ใช้บริการ";
        listSubtitle.style.display = 'block'; // ให้แสดงเวลา 4 PM - 9 PM กลับมาเหมือนเดิม

        // รันตัวเลข
        animateValue(numUsers, currentUsers, mockTodayData.users, 600);
        animateValue(numQueues, currentQueues, mockTodayData.queues, 600);

        // สร้างรายการคิวที่จบไปแล้ว
        mockTodayData.finishedQueues.forEach(q => {
            const row = document.createElement('div');
            row.className = "flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100 last:border-0";
            row.innerHTML = `
                <div class="flex items-center gap-4 w-full">
                    <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 shadow-sm shrink-0">
                        ${q.id}
                    </div>
                    <p class="text-sm font-medium text-gray-800 flex-1">${q.players}</p>
                </div>
            `;
            listContainer.appendChild(row);
        });

    } else if (tab === 'month') {
        // เปลี่ยน Style ปุ่ม
        btnMonth.className = "bg-u-purple text-white px-6 py-2 rounded-full text-sm font-bold shadow-sm transition-all";
        btnToday.className = "bg-transparent text-gray-600 hover:bg-white px-6 py-2 rounded-full text-sm font-bold transition-all";
        
        // เปลี่ยนข้อความบนการ์ด
        titleUsers.textContent = "จำนวนคนเข้าใช้บริการเดือนนี้";
        titleQueues.textContent = "จำนวนคิวทั้งหมด (เดือนนี้)";
        listTitle.textContent = "ลำดับรายชื่อผู้ใช้บริการมากที่สุด";
        listSubtitle.style.display = 'none'; // ซ่อนเวลา 4 PM - 9 PM ในหน้าของรายเดือน

        // รันตัวเลข
        animateValue(numUsers, currentUsers, mockMonthData.users, 600);
        animateValue(numQueues, currentQueues, mockMonthData.queues, 600);

        // สร้างรายการคนเข้าใช้มากที่สุด 10 อันดับ
        mockMonthData.topUsers.forEach(user => {
            let rankClass = "rank-other";
            if(user.rank === 1) rankClass = "rank-1";
            else if(user.rank === 2) rankClass = "rank-2";
            else if(user.rank === 3) rankClass = "rank-3";

            const row = document.createElement('div');
            row.className = "flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0";
            row.innerHTML = `
                <div class="flex items-center gap-4">
                    <div class="rank-badge ${rankClass}">
                        ${user.rank}
                    </div>
                    <span class="text-sm font-bold text-gray-800">${user.name}</span>
                </div>
                <span class="text-xs text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">${user.count} ครั้ง</span>
            `;
            listContainer.appendChild(row);
        });
    }
}

// --- ฟังก์ชัน อนิเมชันตัวเลขวิ่ง ---
function animateValue(obj, start, end, duration) {
    if (!obj) return;
    if (start === end) {
        obj.innerHTML = end;
        return;
    }
    let range = end - start;
    let startTime = new Date().getTime();
    
    let timer = setInterval(function() {
        let timePassed = new Date().getTime() - startTime;
        let progress = timePassed / duration;
        
        if (progress >= 1) {
            obj.innerHTML = end;
            clearInterval(timer);
        } else {
            let current = Math.floor(start + (range * progress));
            obj.innerHTML = current;
        }
    }, 16);
}

// เริ่มต้นการทำงานด้วย Tab ล่าสุด
window.onload = () => {
    switchTab('today');
};