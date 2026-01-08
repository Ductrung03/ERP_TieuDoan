import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Modal, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { usePermission } from '../../hooks/usePermission';
import { roleService, type Role, type CreateRoleDto, type UpdateRoleDto } from '../../api/services';
import { useNavigate } from 'react-router-dom';

const RoleList: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [formData, setFormData] = useState<Partial<CreateRoleDto>>({});
    const { canCreate, canUpdate, canDelete, can } = usePermission();
    const navigate = useNavigate();

    // Vai trò mặc định không được sửa/xóa
    const protectedRoles = ['VT01', 'VT02', 'VT03', 'VT04'];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await roleService.getAll();
            setRoles(data);
        } catch (error) {
            console.error('Error loading roles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedRole(null);
        setFormData({ trangthai: 'Active' });
        setShowModal(true);
    };

    const handleEdit = (role: Role) => {
        setSelectedRole(role);
        setFormData({
            tenquyen: role.tenquyen,
            mota: role.mota,
            trangthai: role.trangthai,
        });
        setShowModal(true);
    };

    const handleDelete = async (role: Role) => {
        if (protectedRoles.includes(role.maquyen)) {
            toast.error('Không thể xóa vai trò mặc định của hệ thống');
            return;
        }
        if (window.confirm(`Bạn có chắc muốn xóa vai trò "${role.tenquyen}"?`)) {
            try {
                await roleService.delete(role.maquyen);
                toast.success('Xóa vai trò thành công');
                loadData();
            } catch (error) {
                console.error('Error deleting role:', error);
            }
        }
    };

    const handleManagePermissions = (role: Role) => {
        navigate(`/user-management/roles/${role.maquyen}/permissions`);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedRole) {
                await roleService.update(selectedRole.maquyen, formData as UpdateRoleDto);
                toast.success('Cập nhật vai trò thành công');
            } else {
                await roleService.create(formData as CreateRoleDto);
                toast.success('Tạo vai trò mới thành công');
            }
            setShowModal(false);
            loadData();
        } catch (error) {
            console.error('Error saving role:', error);
        }
    };

    if (loading) {
        return (
            <div className="text-center p-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Đang tải...</p>
            </div>
        );
    }

    return (
        <>
            <Card className="shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center bg-white py-3">
                    <div>
                        <h5 className="mb-0 fw-bold">
                            <i className="bi bi-shield-check me-2 text-primary"></i>
                            Quản Lý Vai Trò
                        </h5>
                        <small className="text-muted">Tổng: {roles.length} vai trò</small>
                    </div>
                    {canCreate('USER_MANAGEMENT', 'VAI_TRO') && (
                        <Button variant="primary" onClick={handleCreate}>
                            <i className="bi bi-plus-circle me-2"></i>
                            Thêm vai trò
                        </Button>
                    )}
                </Card.Header>
                <Card.Body className="p-0">
                    <Table striped hover responsive className="mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th>Mã vai trò</th>
                                <th>Tên vai trò</th>
                                <th>Mô tả</th>
                                <th>Trạng thái</th>
                                <th>Ngày tạo</th>
                                <th className="text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((role) => (
                                <tr key={role.maquyen}>
                                    <td><code>{role.maquyen}</code></td>
                                    <td className="fw-semibold">
                                        {role.tenquyen}
                                        {protectedRoles.includes(role.maquyen) && (
                                            <Badge bg="secondary" className="ms-2" pill>Mặc định</Badge>
                                        )}
                                    </td>
                                    <td className="text-muted">{role.mota || '-'}</td>
                                    <td>
                                        <Badge bg={role.trangthai === 'Active' ? 'success' : 'danger'}>
                                            {role.trangthai === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
                                        </Badge>
                                    </td>
                                    <td className="small text-muted">
                                        {role.ngaytao ? new Date(role.ngaytao).toLocaleDateString('vi-VN') : '-'}
                                    </td>
                                    <td className="text-center">
                                        {can('USER_MANAGEMENT', 'VAI_TRO', 'ASSIGN_PERMISSIONS') && (
                                            <Button variant="outline-info" size="sm" className="me-1" onClick={() => handleManagePermissions(role)} title="Phân quyền">
                                                <i className="bi bi-key"></i>
                                            </Button>
                                        )}
                                        {canUpdate('USER_MANAGEMENT', 'VAI_TRO') && !protectedRoles.includes(role.maquyen) && (
                                            <Button variant="outline-warning" size="sm" className="me-1" onClick={() => handleEdit(role)} title="Sửa">
                                                <i className="bi bi-pencil"></i>
                                            </Button>
                                        )}
                                        {canDelete('USER_MANAGEMENT', 'VAI_TRO') && !protectedRoles.includes(role.maquyen) && (
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(role)} title="Xóa">
                                                <i className="bi bi-trash"></i>
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {roles.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center text-muted py-4">
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Modal Form */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {selectedRole ? 'Sửa vai trò' : 'Thêm vai trò mới'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên vai trò <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.tenquyen || ''}
                                onChange={(e) => setFormData({ ...formData, tenquyen: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formData.mota || ''}
                                onChange={(e) => setFormData({ ...formData, mota: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Select
                                value={formData.trangthai || 'Active'}
                                onChange={(e) => setFormData({ ...formData, trangthai: e.target.value })}
                            >
                                <option value="Active">Hoạt động</option>
                                <option value="Inactive">Không hoạt động</option>
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Hủy
                        </Button>
                        <Button variant="primary" type="submit">
                            <i className="bi bi-save me-2"></i>
                            {selectedRole ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default RoleList;
