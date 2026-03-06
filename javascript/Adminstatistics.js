let chartInstance = null;

        // ข้อมูลสมมติ (Mock Data) สำหรับกราฟรายสัปดาห์
        const baseWeeklyData = [35, 42, 28, 50, 60, 85, 40]; // จ. - อา.

        // ข้อมูลสมมติ (Mock Data) สำหรับกราฟรายปี (ม.ค. - ธ.ค.)
        const baseYearlyData = [458, 433, 0, 527, 450, 600, 380, 520, 410, 390, 480, 550]; 

        // จำนวนคนเข้าใช้บริการสัปดาห์อื่นๆ ในเดือนมีนาคมที่ผ่านมาแล้ว (สมมติ)
        const otherWeeksInMarch = 520; 

        function getActivePlayersCount() {
            let count = 0;
            const queues = JSON.parse(localStorage.getItem('up_badminton_queues')) || [];
            queues.forEach(q => {
                count += q.players.filter(p => p !== null).length;
            });
            return count;
        }

        function initChart(labelsArray, dataArray) {
            const ctx = document.getElementById('statsChart').getContext('2d');
            
            if (chartInstance) {
                chartInstance.destroy();
            }

            chartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labelsArray,
                    datasets: [{
                        data: dataArray,
                        backgroundColor: '#D1D5DB', 
                        hoverBackgroundColor: '#6C2B97', 
                        borderRadius: 2,
                        barPercentage: 0.6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }, 
                    scales: {
                        y: { display: false, beginAtZero: true }, 
                        x: { 
                            grid: { display: false, drawBorder: true, borderColor: '#000' },
                            ticks: { font: { family: 'Prompt', size: 12, weight: 'bold' }, color: '#374151' }
                        }
                    },
                    animation: {
                        duration: 800,
                        easing: 'easeOutQuart'
                    }
                }
            });
        }

        function switchTab(tab) {
            const btnToday = document.getElementById('btn-today');
            const btnMonth = document.getElementById('btn-month');
            const calendar = document.getElementById('calendar-widget');
            const totalTitle = document.getElementById('total-title');
            const chartTitle = document.getElementById('chart-title');
            const totalNumber = document.getElementById('total-number');
            const realtimeBadge = document.getElementById('realtime-badge');

            
            const activePlayers = getActivePlayersCount();
            let currentWeeklyData = [...baseWeeklyData];
            currentWeeklyData[4] += activePlayers; 
            
            
            const totalWeekly = currentWeeklyData.reduce((a, b) => a + b, 0);

            const totalCurrentMonth = otherWeeksInMarch + totalWeekly; 

            if (tab === 'today') {
                btnToday.className = "bg-u-purple text-white px-6 py-2 rounded-full text-sm font-bold shadow-sm transition-all";
                btnMonth.className = "bg-transparent text-gray-600 hover:bg-white px-6 py-2 rounded-full text-sm font-bold transition-all";
                
                calendar.classList.add('hidden');
                totalTitle.textContent = "จำนวนคนเข้าใช้บริการสัปดาห์นี้";
                chartTitle.textContent = "สถิติการเข้าใช้บริการ (รายวัน)";
                realtimeBadge.style.display = 'flex';
                
                animateValue("total-number", parseInt(totalNumber.textContent) || 0, totalWeekly, 500);
                
                const weeklyLabels = ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'];
                initChart(weeklyLabels, currentWeeklyData);

            } else if (tab === 'month') {
                btnMonth.className = "bg-u-purple text-white px-6 py-2 rounded-full text-sm font-bold shadow-sm transition-all";
                btnToday.className = "bg-transparent text-gray-600 hover:bg-white px-6 py-2 rounded-full text-sm font-bold transition-all";
                
                calendar.classList.remove('hidden');
                totalTitle.textContent = "จำนวนคนเข้าใช้บริการเดือนนี้";
                chartTitle.textContent = "สถิติการเข้าใช้บริการ (รายปี)";
                realtimeBadge.style.display = 'none';

                let currentYearlyData = [...baseYearlyData];
                // อัปเดตข้อมูลกราฟเดือนมีนาคม (index 2) ให้ตรงกับยอดที่คำนวณไว้
                currentYearlyData[2] = totalCurrentMonth;

                animateValue("total-number", parseInt(totalNumber.textContent) || 0, totalCurrentMonth, 800);

                const monthLabels = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
                initChart(monthLabels, currentYearlyData);
            }
        }

        function animateValue(id, start, end, duration) {
            if (start === end) return;
            let range = end - start;
            let current = start;
            let increment = end > start ? 1 : -1;
            let stepTime = Math.abs(Math.floor(duration / range));
            let obj = document.getElementById(id);
            let timer = setInterval(function() {
                current += increment;
                obj.innerHTML = current;
                if (current == end) {
                    clearInterval(timer);
                }
            }, stepTime);
        }

        window.onload = () => {
            switchTab('today');
        };