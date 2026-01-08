import React, { useRef } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import type { VKTB } from '../../api/services';

interface PrintBienBanModalProps {
    show: boolean;
    onHide: () => void;
    vktbList: VKTB[];
    nguoiMuon?: string;
    nguoiGiao?: string;
}

const PrintBienBanModal: React.FC<PrintBienBanModalProps> = ({
    show,
    onHide,
    vktbList,
    nguoiMuon = "Nguyễn Văn A",
    nguoiGiao = "Trần Văn B"
}) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const content = printRef.current;
        if (!content) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <html>
                <head>
                    <title>Biên Bản Mượn Trả VKTB</title>
                    <style>
                        body { font-family: 'Times New Roman', serif; padding: 20px; }
                        h2 { text-align: center; }
                        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                        th { background-color: #f0f0f0; }
                        .signature { display: flex; justify-content: space-between; margin-top: 50px; }
                        .signature div { text-align: center; width: 40%; }
                    </style>
                </head>
                <body>
                    ${content.innerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const today = new Date().toLocaleDateString('vi-VN');

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton className="bg-warning-transparent">
                <Modal.Title>
                    <i className="ti ti-printer me-2"></i>
                    In Biên Bản Mượn Trả VKTB
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div ref={printRef} className="p-3">
                    <h4 className="text-center mb-1">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
                    <p className="text-center mb-4">Độc lập - Tự do - Hạnh phúc</p>

                    <h3 className="text-center mb-4">BIÊN BẢN MƯỢN TRẢ VKTB</h3>

                    <p>Ngày: {today}</p>
                    <p>Người mượn: <strong>{nguoiMuon}</strong></p>
                    <p>Người giao: <strong>{nguoiGiao}</strong></p>

                    <Table bordered className="mt-3">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên VKTB</th>
                                <th>Đơn Vị Tính</th>
                                <th>Số Lượng</th>
                                <th>Tình Trạng</th>
                                <th>Ghi Chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vktbList.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center text-muted">
                                        Chưa có VKTB nào được chọn
                                    </td>
                                </tr>
                            ) : (
                                vktbList.map((item, index) => (
                                    <tr key={item.mavktb}>
                                        <td>{index + 1}</td>
                                        <td>{item.tenvktb}</td>
                                        <td>{item.donvitinh}</td>
                                        <td>1</td>
                                        <td>{item.tinhtrang}</td>
                                        <td>{item.ghichu}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-between mt-5">
                        <div className="text-center" style={{ width: '40%' }}>
                            <p><strong>Người Giao</strong></p>
                            <p className="text-muted">(Ký và ghi rõ họ tên)</p>
                            <div style={{ height: '80px' }}></div>
                            <p>{nguoiGiao}</p>
                        </div>
                        <div className="text-center" style={{ width: '40%' }}>
                            <p><strong>Người Mượn</strong></p>
                            <p className="text-muted">(Ký và ghi rõ họ tên)</p>
                            <div style={{ height: '80px' }}></div>
                            <p>{nguoiMuon}</p>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onHide}>
                    Đóng
                </Button>
                <Button variant="warning" onClick={handlePrint}>
                    <i className="ti ti-printer me-1"></i>
                    In Biên Bản
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PrintBienBanModal;
