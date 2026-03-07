// AdminMainmenu.js

let selectedDate = null;
let selectedCourt = null;
let currentPage = 1;

const allCourts = [
    { id: 1, name: 'สนาม 1', type: 'พื้นยางมาตรฐาน', floor: 'ชั้น 1', img: 'pic/รูปสนาม.png' },
    { id: 2, name: 'สนาม 2', type: 'พื้นยางมาตรฐาน', floor: 'ชั้น 1', img: 'pic/รูปสนาม.png' },
    { id: 3, name: 'สนาม 3', type: 'พื้นยางมาตรฐาน', floor: 'ชั้น 1', img: 'pic/รูปสนาม.png' },
    { id: 4, name: 'สนาม 4', type: 'พื้นยางมาตรฐาน', floor: 'ชั้น 1', img: 'pic/รูปสนาม.png' }
];

function selectDate(el, date) {
    document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    selectedDate = date;
    document.getElementById('sum-date').textContent = date;
    document.getElementById('sum-date').className = "text-base font-bold text-gray-800";
}

// เช็คว่าสนามนี้ถูกปิดไปแล้วหรือยัง
function isCourtClosed(courtName) {
    const logs = JSON.parse(localStorage.getItem('admin_logs') || '[]');
    // ถ้าในประวัติ logs มีชื่อสนามนี้อยู่ แปลว่าโดนปิดไปแล้ว
    return logs.some(log => log.court === courtName);
}

function selectCourt(id, name) {
    // ถ้าสนามปิดอยู่ ไม่ให้กดเลือก
    if (isCourtClosed(name)) {
        Swal.fire({
            icon: 'info',
            title: 'สนามนี้ปิดอยู่',
            text: 'ไม่สามารถเลือกสนามที่อยู่ในสถานะปิดปรับปรุงได้',
            confirmButtonColor: '#6C2B97'
        });
        return; 
    }

    selectedCourt = name;
    renderCourts();
    document.getElementById('sum-court').textContent = name;
    document.getElementById('sum-court').className = "text-base font-bold text-gray-800";
}

function renderCourts() {
    const container = document.getElementById('court-list');
    container.innerHTML = '';
    
    const start = (currentPage - 1) * 3;
    const end = start + 3;
    const paginated = allCourts.slice(start, end);

    paginated.forEach(court => {
        const isActive = selectedCourt === court.name ? 'active' : '';
        const closed = isCourtClosed(court.name); // เช็คสถานะปิด

        // กำหนด Class และป้ายกำกับตามสถานะ
        let cardStyle = closed ? 'opacity-60 bg-gray-50 cursor-not-allowed border-gray-200' : 'bg-white cursor-pointer border-transparent hover:border-purple-200';
        if (isActive && !closed) cardStyle = 'bg-white border-u-purple ring-4 ring-purple-100 cursor-pointer';

        let badgeHTML = '';
        if (closed) {
            badgeHTML = `
                <div class="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-xl">
                    <span class="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clip-rule="evenodd" /></svg>
                        ปิดปรับปรุง
                    </span>
                </div>
            `;
        }

        container.innerHTML += `
            <div class="court-card ${cardStyle} relative rounded-2xl p-4 flex gap-6 items-center border-2 transition-all" onclick="selectCourt(${court.id}, '${court.name}')">
                
                <div class="w-32 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0 relative">
                    <img src="${court.img}" class="w-full h-full object-cover">
                    ${badgeHTML} </div>

                <div class="${closed ? 'text-gray-400' : ''}">
                    <h4 class="font-bold text-xl ${closed ? 'text-gray-500' : 'text-gray-900'}">${court.name}</h4>
                    <ul class="text-sm ${closed ? 'text-gray-400' : 'text-gray-800'} list-disc list-inside mt-1 font-medium">
                        <li>${court.type}</li>
                        <li>${court.floor}</li>
                    </ul>
                </div>
            </div>
        `;
    });
}

function changePage(p) {
    currentPage = p;
    document.getElementById('page-1').className = p === 1 ? "w-10 h-10 rounded-xl bg-u-purple text-white font-bold shadow-md" : "w-10 h-10 rounded-xl bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 transition";
    document.getElementById('page-2').className = p === 2 ? "w-10 h-10 rounded-xl bg-u-purple text-white font-bold shadow-md" : "w-10 h-10 rounded-xl bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 transition";
    renderCourts();
}

function handleSubmit() {
    if (!selectedDate || !selectedCourt) {
        Swal.fire({ icon: 'warning', title: 'ข้อมูลไม่ครบ', text: 'โปรดเลือกวันที่และสนามก่อน', confirmButtonColor: '#6C2B97' });
        return;
    }

    document.getElementById('modal-confirm').classList.remove('hidden');
    document.getElementById('modal-confirm').classList.add('flex');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
    document.getElementById(id).classList.remove('flex');
}

function processFinalSubmit() {
    const radioSelected = document.querySelector('input[name="cancel-reason"]:checked');
    let reason = "";

    if (!radioSelected) {
        Swal.fire({ text: 'โปรดเลือกเหตุผลการปิดปรับปรุง', icon: 'error' });
        return;
    }

    if (radioSelected.value === "อื่นๆ") {
        reason = document.getElementById('other-reason-text').value;
        if (!reason.trim()) {
            Swal.fire({ text: 'โปรดระบุเหตุผลอื่นๆ', icon: 'error' });
            return;
        }
    } else {
        reason = radioSelected.value;
    }

    // บันทึกลง Logs ว่าสนามนี้ปิดแล้ว
    let logs = JSON.parse(localStorage.getItem('admin_logs') || '[]');
    logs.push({ court: selectedCourt, date: selectedDate, reason: reason });
    localStorage.setItem('admin_logs', JSON.stringify(logs));

    // ใส่ข้อมูลในหน้าสำเร็จ
    document.getElementById('success-court-name').textContent = selectedCourt;
    document.getElementById('success-reason').textContent = reason;

    // สลับหน้าต่าง
    closeModal('modal-confirm');
    document.getElementById('modal-success').classList.remove('hidden');
    document.getElementById('modal-success').classList.add('flex');
    
    // รีเรนเดอร์ลิสต์สนาม เพื่อให้ป้าย "ปิดปรับปรุง" ขึ้นทันทีหลังปิดสำเร็จ
    selectedCourt = null; // เคลียร์ตัวเลือกปัจจุบัน
    document.getElementById('sum-court').textContent = "ยังไม่ได้เลือก";
    document.getElementById('sum-court').className = "text-lg font-medium text-gray-300 italic";
    renderCourts(); 
}

// ทำงานตอนโหลดไฟล์เสร็จ
window.onload = renderCourts;