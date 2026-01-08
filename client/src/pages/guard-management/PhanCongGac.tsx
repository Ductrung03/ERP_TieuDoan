import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Pageheader from '../../shared/layouts-components/pageheader/pageheader';
import {
    phanCongGacService,
    lichGacService,
    hocVienService,
    caGacService,
    vongGacService,
    type PhanCongGac as IPhanCongGac,
    type CreatePhanCongDto,
    type LichGac,
    type HocVien,
    type CaGac,
    type VongGac
} from '../../api/services';

const PhanCongGac: React.FC = () => {
    const [phanCongs, setPhanCongs] = useState<IPhanCongGac[]>([]);
    const [lichGacs, setLichGacs] = useState<LichGac[]>([]);
    const [hocViens, setHocViens] = useState<HocVien[]>([]);
    const [caGacs, setCaGacs] = useState<CaGac[]>([]);
    const [vongGacs, setVongGacs] = useState<VongGac[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CreatePhanCongDto>();

    useEffect(() => {
        loadData();
        loadOptions();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await phanCongGacService.getAll();
            setPhanCongs(data);
        } catch (error) {
            console.error('Failed to load:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadOptions = async () => {
        try {
            const [lgs, hvs, cgs, vgs] = await Promise.all([
                lichGacService.getAll(),
                hocVienService.getAll(),
                caGacService.getAll(),
                vongGacService.getAll(),
            ]);
            setLichGacs(lgs);
            setHocViens(hvs);
            setCaGacs(cgs);
            setVongGacs(vgs);
        } catch (error) {
            console.error('Failed to load options:', error);
        }
    };

    const onSubmit: SubmitHandler<CreatePhanCongDto> = async (data) => {
        try {
            await phanCongGacService.create(data);
            toast.success('Phân công thành công!');
            setShowForm(false);
            loadData();
            reset();
        } catch (error) {
            console.error('Failed to create:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Bạn có chắc muốn xóa?')) return;
        try {
            await phanCongGacService.delete(id);
            toast.success('Xóa thành công!');
            loadData();
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    // Helper functions
    const getHocVienName = (id: string) => hocViens.find(h => h.mahocvien === id)?.hoten || id;
    const getVongGacName = (id: string) => vongGacs.find(v => v.mavonggac === id)?.tenvonggac || id;

    // Filter data
    const filteredData = phanCongs.filter(item => {
        const matchSearch = getHocVienName(item.mahocvien).toLowerCase().includes(searchTerm.toLowerCase());
        return matchSearch;
    });

    return (
        <div className="">
            <Pageheader title="Canh Gác" activepage="Phân Công Gác" currentpage="Phân Công" />

            <Card className="custom-card">
                <Card.Header className="card-header-actions">
                    <div className="card-title-with-icon">
                        <i className="ti ti-users-group"></i>
                        <span>Danh Sách Phân Công Gác</span>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant={showForm ? "outline-secondary" : "primary"}
                            size="sm"
                            onClick={() => setShowForm(!showForm)}
                        >
                            <i className={`ti ${showForm ? 'ti-x' : 'ti-plus'} me-1`}></i>
                            {showForm ? 'Hủy' : 'Phân Công Mới'}
                        </Button>
                        <Button variant="warning-light" size="sm">
                            <i className="ti ti-shield-check me-1"></i>
                            Phân Công VKTB
                        </Button>
                        <Button variant="success-light" size="sm">
                            <i className="ti ti-file-export me-1"></i>
                            Xuất Báo Cáo
                        </Button>
                    </div>
                </Card.Header>

                <Card.Body>
                    {/* Toolbar */}
                    <div className="management-toolbar mb-3">
                        <InputGroup className="search-input">
                            <InputGroup.Text>
                                <i className="ti ti-search"></i>
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Tìm theo tên học viên..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                        <div className="filter-group">
                            <Form.Control
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                style={{ width: 'auto' }}
                            />
                        </div>
                        <div className="date-filter ms-auto">
                            <i className="ti ti-calendar"></i>
                            <span>Lịch Phân Công</span>
                        </div>
                    </div>

                    {/* Create Form */}
                    {showForm && (
                        <Card className="mb-4 border-primary-light">
                            <Card.Body className="bg-primary-transparent">
                                <h6 className="mb-3">
                                    <i className="ti ti-plus me-2"></i>
                                    Tạo Phân Công Mới
                                </h6>
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="ti ti-calendar-event me-1 text-primary"></i>
                                                    Lịch Gác *
                                                </Form.Label>
                                                <Form.Select
                                                    isInvalid={!!errors.malichgac}
                                                    {...register("malichgac", { required: "Vui lòng chọn lịch gác" })}
                                                >
                                                    <option value="">-- Chọn lịch gác --</option>
                                                    {lichGacs.map((lg) => (
                                                        <option key={lg.malichgac} value={lg.malichgac}>
                                                            {new Date(lg.ngaygac).toLocaleDateString('vi-VN')} - {lg.ghichu}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.malichgac?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="ti ti-user me-1 text-primary"></i>
                                                    Học Viên *
                                                </Form.Label>
                                                <Form.Select
                                                    isInvalid={!!errors.mahocvien}
                                                    {...register("mahocvien", { required: "Vui lòng chọn học viên" })}
                                                >
                                                    <option value="">-- Chọn học viên --</option>
                                                    {hocViens.map((hv) => (
                                                        <option key={hv.mahocvien} value={hv.mahocvien}>
                                                            {hv.hoten}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.mahocvien?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="ti ti-clock me-1 text-warning"></i>
                                                    Ca Gác *
                                                </Form.Label>
                                                <Form.Select
                                                    isInvalid={!!errors.macagac}
                                                    {...register("macagac", { required: "Vui lòng chọn ca gác" })}
                                                >
                                                    <option value="">-- Chọn ca gác --</option>
                                                    {caGacs.map((cg) => (
                                                        <option key={cg.macagac} value={cg.macagac}>
                                                            {cg.thoigianbatdau} - {cg.thoigianketthuc}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.macagac?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="ti ti-map-pin me-1 text-info"></i>
                                                    Vòng Gác *
                                                </Form.Label>
                                                <Form.Select
                                                    isInvalid={!!errors.mavonggac}
                                                    {...register("mavonggac", { required: "Vui lòng chọn vòng gác" })}
                                                >
                                                    <option value="">-- Chọn vòng gác --</option>
                                                    {vongGacs.map((vg) => (
                                                        <option key={vg.mavonggac} value={vg.mavonggac}>
                                                            {vg.tenvonggac}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.mavonggac?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <div className="d-flex gap-2">
                                        <Button type="submit" variant="primary">
                                            <i className="ti ti-check me-1"></i>
                                            Phân Công
                                        </Button>
                                        <Button type="button" variant="outline-secondary" onClick={() => setShowForm(false)}>
                                            Hủy
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    )}

                    {/* Table */}
                    {loading ? (
                        <div className="text-center p-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Đang tải...</span>
                            </div>
                            <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="empty-state">
                            <i className="ti ti-users-minus d-block"></i>
                            <h5>Chưa có phân công</h5>
                            <p>Nhấn "Phân Công Mới" để bắt đầu</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table className="management-table table-hover">
                                <thead>
                                    <tr>
                                        <th><i className="ti ti-hash me-1"></i>STT</th>
                                        <th><i className="ti ti-user me-1"></i>Họ Tên</th>
                                        <th><i className="ti ti-military-rank me-1"></i>Cấp Bậc</th>
                                        <th><i className="ti ti-briefcase me-1"></i>Chức Vụ</th>
                                        <th><i className="ti ti-map-pin me-1"></i>Vòng Gác</th>
                                        <th><i className="ti ti-circle-check me-1"></i>Trạng Thái</th>
                                        <th className="text-center"><i className="ti ti-settings me-1"></i>Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((item, index) => (
                                        <tr key={item.mapc}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="avatar avatar-sm bg-primary-transparent rounded-circle">
                                                        <i className="ti ti-user"></i>
                                                    </span>
                                                    <span>{getHocVienName(item.mahocvien)}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge bg-secondary-transparent">Binh nhất</span>
                                            </td>
                                            <td>Chiến sĩ</td>
                                            <td>
                                                <span className="badge bg-info-transparent">
                                                    {getVongGacName(item.mavonggac)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="status-badge dam-bao">
                                                    <i className="ti ti-check me-1"></i>
                                                    Đảm bảo
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-btn-group justify-content-center">
                                                    <Button
                                                        variant="info-light"
                                                        size="sm"
                                                        title="Xem chi tiết"
                                                    >
                                                        <i className="ti ti-eye"></i>
                                                    </Button>
                                                    <Button
                                                        variant="warning-light"
                                                        size="sm"
                                                        title="Sửa"
                                                    >
                                                        <i className="ti ti-edit"></i>
                                                    </Button>
                                                    <Button
                                                        variant="danger-light"
                                                        size="sm"
                                                        title="Xóa"
                                                        onClick={() => handleDelete(item.mapc)}
                                                    >
                                                        <i className="ti ti-trash"></i>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default PhanCongGac;
