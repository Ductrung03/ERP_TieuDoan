import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Pageheader from '../../shared/layouts-components/pageheader/pageheader';
import {
    kiemTraGacService,
    caGacService,
    canBoService,
    type KiemTraGac,
    type CaGac,
    type CanBo
} from '../../api/services';

const KiemTraGacPage: React.FC = () => {
    const [kiemTras, setKiemTras] = useState<KiemTraGac[]>([]);
    const [caGacs, setCaGacs] = useState<CaGac[]>([]);
    const [canBos, setCanBos] = useState<CanBo[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterVong, setFilterVong] = useState('');

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<KiemTraGac>({
        defaultValues: {
            ngay: new Date(),
            trangthai: 'Đạt',
            nhiemvuhocvien: '',
            macagac: '',
            macanbo: '',
        }
    });

    useEffect(() => {
        loadData();
        loadOptions();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await kiemTraGacService.getAll();
            setKiemTras(data);
        } catch (error) {
            console.error('Failed to load:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadOptions = async () => {
        try {
            const [cgs, cbs] = await Promise.all([
                caGacService.getAll(),
                canBoService.getAll(),
            ]);
            setCaGacs(cgs);
            setCanBos(cbs);
        } catch (error) {
            console.error('Failed to load options:', error);
        }
    };

    const onSubmit: SubmitHandler<KiemTraGac> = async (data) => {
        try {
            const payload = {
                ...data,
                ngay: data.ngay ? new Date(data.ngay) : new Date()
            };
            await kiemTraGacService.create(payload);
            toast.success('Ghi nhận kiểm tra thành công!');
            setShowForm(false);
            loadData();
            reset();
            setValue('ngay', new Date());
        } catch (error) {
            console.error('Failed to create:', error);
        }
    };

    // Helper functions
    const getCaGacTime = (id: string) => {
        const cg = caGacs.find(c => c.macagac === id);
        return cg ? `${cg.thoigianbatdau} - ${cg.thoigianketthuc}` : id;
    };
    const getCanBoName = (id: string) => canBos.find(c => c.macanbo === id)?.hoten || id;

    // Filter data
    const filteredData = kiemTras.filter(item => {
        const matchSearch = getCanBoName(item.macanbo || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchSearch;
    });

    // Sample vòng gác list for filter
    const vongGacOptions = ['Vòng 1', 'Vòng 2', 'Vòng 3', 'Vòng 4'];

    return (
        <div className="">
            <Pageheader title="Canh Gác" activepage="Kiểm Tra Gác" currentpage="Kiểm Tra" />

            <Card className="custom-card">
                <Card.Header className="card-header-actions">
                    <div className="card-title-with-icon">
                        <i className="ti ti-clipboard-check"></i>
                        <span>Kiểm Tra Gác</span>
                    </div>
                    <div className="d-flex gap-2 flex-wrap">
                        <Button
                            variant={showForm ? "outline-secondary" : "primary"}
                            size="sm"
                            onClick={() => setShowForm(!showForm)}
                        >
                            <i className={`ti ${showForm ? 'ti-x' : 'ti-file-plus'} me-1`}></i>
                            {showForm ? 'Hủy' : 'Tạo Phiếu'}
                        </Button>
                        <Button variant="danger-light" size="sm">
                            <i className="ti ti-alert-triangle me-1"></i>
                            Thêm Vi Phạm
                        </Button>
                        <Button variant="info-light" size="sm">
                            <i className="ti ti-list me-1"></i>
                            DS Phiếu Kiểm Tra
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
                                placeholder="Tìm kiếm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                        <div className="filter-group">
                            <Form.Select
                                value={filterVong}
                                onChange={(e) => setFilterVong(e.target.value)}
                                style={{ width: 'auto' }}
                            >
                                <option value="">Tất cả vòng</option>
                                {vongGacOptions.map((vong, idx) => (
                                    <option key={idx} value={vong}>{vong}</option>
                                ))}
                            </Form.Select>
                        </div>
                    </div>

                    {/* Create Form */}
                    {showForm && (
                        <Card className="mb-4 border-primary-light">
                            <Card.Body className="bg-primary-transparent">
                                <h6 className="mb-3">
                                    <i className="ti ti-file-plus me-2"></i>
                                    Ghi Nhận Kiểm Tra
                                </h6>
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="ti ti-calendar me-1 text-primary"></i>
                                                    Ngày Kiểm Tra *
                                                </Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    isInvalid={!!errors.ngay}
                                                    {...register("ngay", { required: "Ngày kiểm tra là bắt buộc" })}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.ngay?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
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
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="ti ti-user-circle me-1 text-info"></i>
                                                    Cán Bộ Kiểm Tra
                                                </Form.Label>
                                                <Form.Select {...register("macanbo")}>
                                                    <option value="">-- Chọn cán bộ --</option>
                                                    {canBos.map((cb) => (
                                                        <option key={cb.macanbo} value={cb.macanbo}>
                                                            {cb.hoten}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="ti ti-circle-check me-1 text-success"></i>
                                                    Kết Quả
                                                </Form.Label>
                                                <Form.Select {...register("trangthai")}>
                                                    <option value="Đạt">Đạt</option>
                                                    <option value="Không đạt">Không đạt</option>
                                                    <option value="Vi phạm">Vi phạm</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={8}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="ti ti-notes me-1 text-secondary"></i>
                                                    Nhận Xét / Vi Phạm
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Mô tả tình hình thực hiện nhiệm vụ"
                                                    {...register("nhiemvuhocvien")}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <div className="d-flex gap-2">
                                        <Button type="submit" variant="primary">
                                            <i className="ti ti-check me-1"></i>
                                            Lưu Kết Quả
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
                            <i className="ti ti-clipboard-off d-block"></i>
                            <h5>Chưa có đợt kiểm tra</h5>
                            <p>Nhấn "Tạo Phiếu" để bắt đầu</p>
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
                                        <th><i className="ti ti-circle-check me-1"></i>Trạng Thái Gác</th>
                                        <th><i className="ti ti-clock me-1"></i>Thời Gian</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((item, index) => (
                                        <tr key={item.maktgac}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="avatar avatar-sm bg-primary-transparent rounded-circle">
                                                        <i className="ti ti-user"></i>
                                                    </span>
                                                    <span>{getCanBoName(item.macanbo || '')}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge bg-secondary-transparent">Thiếu úy</span>
                                            </td>
                                            <td>Cán bộ</td>
                                            <td>
                                                {item.trangthai === 'Đạt' ? (
                                                    <span className="status-badge dam-bao">
                                                        <i className="ti ti-check me-1"></i>
                                                        Đạt
                                                    </span>
                                                ) : (
                                                    <span className="status-badge vi-pham">
                                                        <i className="ti ti-x me-1"></i>
                                                        {item.trangthai}
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <span className="badge bg-info-transparent">
                                                    {getCaGacTime(item.macagac || '')}
                                                </span>
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

export default KiemTraGacPage;
