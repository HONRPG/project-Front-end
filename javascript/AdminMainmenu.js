
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

        function selectCourt(id, name) {
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
                container.innerHTML += `
                    <div class="court-card ${isActive}" onclick="selectCourt(${court.id}, '${court.name}')">
                        <div class="w-32 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                            <img src="${court.img}" class="w-full h-full object-cover">
                        </div>
                        <div>
                            <h4 class="font-bold text-xl text-gray-900">${court.name}</h4>
                            <ul class="text-sm text-gray-800 list-disc list-inside mt-1 font-medium">
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
            document.getElementById('page-1').className = p === 1 ? "w-8 h-8 rounded-lg bg-u-purple text-white font-bold shadow-md" : "w-8 h-8 rounded-lg bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 transition";
            document.getElementById('page-2').className = p === 2 ? "w-8 h-8 rounded-lg bg-u-purple text-white font-bold shadow-md" : "w-8 h-8 rounded-lg bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 transition";
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

            let logs = JSON.parse(localStorage.getItem('admin_logs') || '[]');
                logs.push({ court: selectedCourt, date: selectedDate, reason: reason });
                localStorage.setItem('admin_logs', JSON.stringify(logs));

            if (radioSelected.value === "อื่นๆ") {
                reason = document.getElementById('other-reason-text').value;
                if (!reason.trim()) {
                    Swal.fire({ text: 'โปรดระบุเหตุผลอื่นๆ', icon: 'error' });
                    return;
                }
            } else {
                reason = radioSelected.value;
            }

            // ใส่ข้อมูลในหน้าสำเร็จ
            document.getElementById('success-court-name').textContent = selectedCourt;
            document.getElementById('success-reason').textContent = reason;

            // สลับหน้าต่าง
            closeModal('modal-confirm');
            document.getElementById('modal-success').classList.remove('hidden');
            document.getElementById('modal-success').classList.add('flex');
        }
        renderCourts();
        window.onload = renderCourts;