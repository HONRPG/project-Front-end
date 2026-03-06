function validatePassword() {
            const password = document.getElementById('password').value;
            const hint = document.getElementById('password-hint');
            const input = document.getElementById('password');

            if (password.length > 0 && password.length < 8) {
                hint.classList.remove('text-gray-400', 'text-green-600');
                hint.classList.add('text-red-500');
                hint.innerHTML = '❌ สั้นเกินไป (ต้อง 8 ตัวอักษรขึ้นไป)';
                input.classList.add('border-red-300', 'bg-red-50');
            } else if (password.length >= 8) {
                hint.classList.remove('text-gray-400', 'text-red-500');
                hint.classList.add('text-green-600');
                hint.innerHTML = '✅ รหัสผ่านใช้ได้';
                input.classList.remove('border-red-300', 'bg-red-50');
                input.classList.add('border-green-300', 'bg-green-50');
            } else {
                hint.classList.remove('text-red-500', 'text-green-600');
                hint.classList.add('text-gray-400');
                hint.innerHTML = '*ต้องมีอย่างน้อย 8 ตัวอักษร';
                input.classList.remove('border-red-300', 'bg-red-50', 'border-green-300', 'bg-green-50');
            }
        }

        function handleRegister(event) {
            event.preventDefault(); 

            const fullname = document.getElementById('fullname').value.trim();
            const email = document.getElementById('email').value.trim().toLowerCase();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // 1. ตรวจสอบความถูกต้องเบื้องต้น
            if (password.length < 8) {
                Swal.fire({ icon: 'warning', title: 'รหัสผ่านสั้นเกินไป', text: 'กรุณาตั้งรหัสผ่านอย่างน้อย 8 ตัวอักษร', confirmButtonColor: '#6C2B97' });
                return;
            }

            if (password !== confirmPassword) {
                Swal.fire({ icon: 'error', title: 'รหัสผ่านไม่ตรงกัน', text: 'กรุณากรอกรหัสผ่านยืนยันให้ถูกต้อง', confirmButtonColor: '#6C2B97' });
                return;
            }

            // --- 2. ระบบดึงข้อมูลบัญชีทั้งหมดที่มีอยู่ ---
            // ดึงข้อมูล 'up_badminton_accounts' (ถ้าไม่มีให้สร้างเป็น Array ว่าง [])
            let accounts = JSON.parse(localStorage.getItem('up_badminton_accounts')) || [];

            // 3. ตรวจสอบว่าอีเมลนี้เคยสมัครหรือยัง
            const isEmailDuplicate = accounts.some(acc => acc.email === email);
            if (isEmailDuplicate) {
                Swal.fire({ 
                    icon: 'error', 
                    title: 'อีเมลนี้ถูกใช้งานแล้ว', 
                    text: 'กรุณาใช้อีเมลอื่น หรือเข้าสู่ระบบด้วยบัญชีเดิม', 
                    confirmButtonColor: '#6C2B97' 
                });
                return;
            }

            // 4. สร้างข้อมูลผู้ใช้ใหม่
            const newUser = {
                name: fullname,
                email: email,
                password: password,
                phone: '',
                role: 'user' // กำหนดสิทธิ์เริ่มต้นเป็น user
            };

            // 5. เพิ่มผู้ใช้ใหม่เข้าไปในรายการ (Array) และบันทึกกลับลง localStorage
            accounts.push(newUser);
            localStorage.setItem('up_badminton_accounts', JSON.stringify(accounts));

            // บันทึกสถานะว่าใคร Login อยู่ (สำหรับใช้ในหน้าถัดไป)
            localStorage.setItem('up_badminton_user', JSON.stringify(newUser));

            Swal.fire({
                icon: 'success',
                title: 'ลงทะเบียนสำเร็จ!',
                text: 'ระบบได้บันทึกข้อมูลของคุณเรียบร้อยแล้ว',
                confirmButtonColor: '#6C2B97',
                confirmButtonText: 'เข้าสู่ระบบ'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = 'Main menu.html';
                }
            });
        }