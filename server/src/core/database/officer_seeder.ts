import { db } from './connection';
import { canBoRepository } from '../../shared/repositories/canbo.repository';
import { donViService } from '../../shared/services/donvi.service';

export const seedOfficers = async () => {
    console.log('Starting officer seeding...');
    
    try {
        // 1. Ensure Positions (ChucVu) exist
        const positions = [
            'Phó tiểu đoàn trưởng',
            'Chính trị viên phó tiểu đoàn',
            'Trợ lý',
            'Đại đội trưởng',
            'Chính trị viên',
            'Trung đội trưởng',
            'Trung đội phó'
        ];

        const chucVuMap: Record<string, string> = {}; // Name -> ID

        for (const posName of positions) {
            const res = await db.query(`SELECT machucvu, tenchucvu FROM chucvu WHERE tenchucvu = $1`, [posName]);
            if (res.rowCount === 0) {
                console.log(`Creating position: ${posName}`);
                const insertRes = await db.query(
                    `INSERT INTO chucvu (tenchucvu, mota) VALUES ($1, $2) RETURNING machucvu`,
                    [posName, `Chức vụ ${posName}`]
                );
                chucVuMap[posName] = insertRes.rows[0].machucvu;
            } else {
                chucVuMap[posName] = res.rows[0].machucvu;
            }
        }

        // 2. Ensure Ranks (QuanHam) exist (Basic set)
        const ranks = ['Thiếu úy', 'Trung úy', 'Thượng úy', 'Đại úy', 'Thiếu tá', 'Trung tá', 'Thượng tá'];
        const quanHamMap: Record<string, string> = {};

        for (const rankName of ranks) {
            const res = await db.query(`SELECT maquanham, tenquanham FROM quanham WHERE tenquanham = $1`, [rankName]);
            if (res.rowCount === 0) {
                console.log(`Creating rank: ${rankName}`);
                const insertRes = await db.query(
                    `INSERT INTO quanham (tenquanham, mota) VALUES ($1, $2) RETURNING maquanham`,
                    [rankName, `Quân hàm ${rankName}`]
                );
                quanHamMap[rankName] = insertRes.rows[0].maquanham;
            } else {
                quanHamMap[rankName] = res.rows[0].maquanham;
            }
        }

        // 3. Seed Battalion Officers (Unit = NULL)
        const battalionOfficers = [
            { name: 'Nguyễn Văn A', position: 'Phó tiểu đoàn trưởng', rank: 'Thiếu tá' },
            { name: 'Trần Văn B', position: 'Chính trị viên phó tiểu đoàn', rank: 'Thiếu tá' },
            { name: 'Lê Văn C', position: 'Trợ lý', rank: 'Đại úy' },
            { name: 'Phạm Văn D', position: 'Trợ lý', rank: 'Thượng úy' }
        ];

        for (const officer of battalionOfficers) {
            const exists = await db.query(`SELECT 1 FROM canbo WHERE hoten = $1 AND madonvi IS NULL`, [officer.name]);
            if (exists.rowCount === 0) {
                console.log(`Seeding Battalion Officer: ${officer.name}`);
                await canBoRepository.create({
                    hoten: officer.name,
                    ngaysinh: new Date('1990-01-01'),
                    sdt: `09${Math.floor(Math.random() * 100000000)}`,
                    gmail: `${officer.name.toLowerCase().replace(/\s/g, '').replace(/[áàảãạâấầẩẫậăắằẳẵặđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]/g, (c) => {
                        const map: any = { 'á':'a', 'à':'a', 'ả':'a', 'ã':'a', 'ạ':'a', 'â':'a', 'ấ':'a', 'ầ':'a', 'ẩ':'a', 'ẫ':'a', 'ậ':'a', 'ă':'a', 'ắ':'a', 'ằ':'a', 'ẳ':'a', 'ẵ':'a', 'ặ':'a', 'đ':'d', 'é':'e', 'è':'e', 'ẻ':'e', 'ẽ':'e', 'ẹ':'e', 'ê':'e', 'ế':'e', 'ề':'e', 'ể':'e', 'ễ':'e', 'ệ':'e', 'í':'i', 'ì':'i', 'ỉ':'i', 'ĩ':'i', 'ị':'i', 'ó':'o', 'ò':'o', 'ỏ':'o', 'õ':'o', 'ọ':'o', 'ô':'o', 'ố':'o', 'ồ':'o', 'ổ':'o', 'ỗ':'o', 'ộ':'o', 'ơ':'o', 'ớ':'o', 'ờ':'o', 'ở':'o', 'ỡ':'o', 'ợ':'o', 'ú':'u', 'ù':'u', 'ủ':'u', 'ũ':'u', 'ụ':'u', 'ư':'u', 'ứ':'u', 'ừ':'u', 'ử':'u', 'ữ':'u', 'ự':'u', 'ý':'y', 'ỳ':'y', 'ỷ':'y', 'ỹ':'y', 'ỵ':'y' };
                        return map[c] || c;
                    })}@gmail.com`,
                    madonvi: undefined, // NULL for Battalion
                    machucvu: chucVuMap[officer.position],
                    maquanham: quanHamMap[officer.rank],
                    thoigianden: new Date()
                });
            }
        }

        // 4. Seed Company Officers (Unit != NULL)
        const donVis = await donViService.getAll();
        for (const donVi of donVis) {
             // Basic check if it's a company (c1, c2, c3, c...) or "Đại đội"
             if (donVi.tendonvi.toLowerCase().includes('đại đội') || donVi.tendonvi.toLowerCase().startsWith('c')) {
                // Seed Dai Doi Truong
                const ddtName = `Đại Đội Trưởng ${donVi.tendonvi}`;
                const existsDDT = await db.query(`SELECT 1 FROM canbo WHERE hoten = $1`, [ddtName]);
                if (existsDDT.rowCount === 0) {
                     console.log(`Seeding Captain for: ${donVi.tendonvi}`);
                     await canBoRepository.create({
                        hoten: ddtName,
                        ngaysinh: new Date('1992-01-01'),
                        sdt: `09${Math.floor(Math.random() * 100000000)}`,
                        gmail: `ddt_${donVi.madonvi}@gmail.com`,
                        madonvi: donVi.madonvi,
                        machucvu: chucVuMap['Đại đội trưởng'],
                        maquanham: quanHamMap['Đại úy'],
                        thoigianden: new Date()
                    });
                }

                 // Seed Chinh Tri Vien
                 const ctvName = `Chính Trị Viên ${donVi.tendonvi}`;
                 const existsCTV = await db.query(`SELECT 1 FROM canbo WHERE hoten = $1`, [ctvName]);
                 if (existsCTV.rowCount === 0) {
                      console.log(`Seeding Political Officer for: ${donVi.tendonvi}`);
                      await canBoRepository.create({
                         hoten: ctvName,
                         ngaysinh: new Date('1992-01-01'),
                         sdt: `09${Math.floor(Math.random() * 100000000)}`,
                         gmail: `ctv_${donVi.madonvi}@gmail.com`,
                         madonvi: donVi.madonvi,
                         machucvu: chucVuMap['Chính trị viên'],
                         maquanham: quanHamMap['Thượng úy'],
                         thoigianden: new Date()
                     });
                 }
             }
        }

        console.log('Officer seeding completed successfully.');
    } catch (error) {
        console.error('Error seeding officers:', error);
    }
};
