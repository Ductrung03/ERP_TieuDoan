import React, { useState, useEffect } from 'react';
import { Card, Accordion, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    roleService,
    permissionService,
    type Role,
    type PermissionGroup,
    type Permission
} from '../../api/services';

const RolePermissions: React.FC = () => {
    const { roleId } = useParams<{ roleId: string }>();
    const navigate = useNavigate();
    const [role, setRole] = useState<Role | null>(null);
    const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (roleId) {
            loadData();
        }
    }, [roleId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [roleData, groupedPerms, currentPerms] = await Promise.all([
                roleService.getById(roleId!),
                permissionService.getGrouped(),
                roleService.getPermissions(roleId!),
            ]);
            setRole(roleData);
            setPermissionGroups(groupedPerms);
            setSelectedPermissions(new Set(currentPerms));
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePermission = (permId: string) => {
        const newSet = new Set(selectedPermissions);
        if (newSet.has(permId)) {
            newSet.delete(permId);
        } else {
            newSet.add(permId);
        }
        setSelectedPermissions(newSet);
    };

    const handleToggleFeature = (permissions: Permission[]) => {
        const allSelected = permissions.every(p => selectedPermissions.has(p.maquyen));
        const newSet = new Set(selectedPermissions);

        permissions.forEach(p => {
            if (allSelected) {
                newSet.delete(p.maquyen);
            } else {
                newSet.add(p.maquyen);
            }
        });

        setSelectedPermissions(newSet);
    };

    const handleSelectAll = () => {
        const allPerms = new Set<string>();
        permissionGroups.forEach(group => {
            Object.values(group.features).forEach(perms => {
                perms.forEach(p => allPerms.add(p.maquyen));
            });
        });
        setSelectedPermissions(allPerms);
    };

    const handleDeselectAll = () => {
        setSelectedPermissions(new Set());
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await roleService.assignPermissions(roleId!, Array.from(selectedPermissions));
            toast.success('Cập nhật quyền thành công!');
        } catch (error) {
            console.error('Error saving permissions:', error);
        } finally {
            setSaving(false);
        }
    };

    const getActionLabel = (action: string): string => {
        const labels: Record<string, string> = {
            VIEW: 'Xem',
            CREATE: 'Tạo',
            UPDATE: 'Sửa',
            DELETE: 'Xóa',
            APPROVE: 'Duyệt',
            EXPORT: 'Xuất',
            RESET_PASSWORD: 'Reset MK',
            TOGGLE_STATUS: 'Khóa/Mở',
            ASSIGN_PERMISSIONS: 'Phân quyền',
        };
        return labels[action] || action;
    };

    const getModuleLabel = (module: string): string => {
        const labels: Record<string, string> = {
            QUAN_LY_CANH_GAC: 'Quản Lý Canh Gác',
            USER_MANAGEMENT: 'Quản Lý Người Dùng',
            DASHBOARD: 'Dashboard',
        };
        return labels[module] || module;
    };

    const getFeatureLabel = (feature: string): string => {
        const labels: Record<string, string> = {
            HOC_VIEN: 'Học Viên',
            CAN_BO: 'Cán Bộ',
            LICH_GAC: 'Lịch Gác',
            PHAN_CONG: 'Phân Công',
            KIEM_TRA: 'Kiểm Tra',
            VKTB: 'VKTB',
            NGUOI_DUNG: 'Người Dùng',
            VAI_TRO: 'Vai Trò',
            QUYEN: 'Quyền',
            DASHBOARD: 'Dashboard',
        };
        return labels[feature] || feature;
    };

    if (loading) {
        return (
            <div className="text-center p-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Đang tải...</p>
            </div>
        );
    }

    if (!role) {
        return (
            <Alert variant="danger">
                Không tìm thấy vai trò
            </Alert>
        );
    }

    return (
        <Card className="shadow-sm">
            <Card.Header className="bg-white py-3">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="mb-0 fw-bold">
                            <i className="bi bi-key me-2 text-primary"></i>
                            Phân Quyền: {role.tenquyen}
                        </h5>
                        <small className="text-muted">Chọn các quyền cho vai trò này</small>
                    </div>
                    <div>
                        <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => navigate(-1)}>
                            <i className="bi bi-arrow-left me-1"></i> Quay lại
                        </Button>
                        <Button variant="outline-primary" size="sm" className="me-2" onClick={handleSelectAll}>
                            Chọn tất cả
                        </Button>
                        <Button variant="outline-danger" size="sm" className="me-2" onClick={handleDeselectAll}>
                            Bỏ chọn tất cả
                        </Button>
                        <Button variant="primary" onClick={handleSave} disabled={saving}>
                            {saving ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-save me-2"></i>
                                    Lưu thay đổi
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </Card.Header>
            <Card.Body>
                <div className="mb-3">
                    <small className="text-muted">
                        Đã chọn: <strong>{selectedPermissions.size}</strong> / {permissionGroups.reduce((acc, g) => acc + Object.values(g.features).flat().length, 0)} quyền
                    </small>
                </div>

                <Accordion defaultActiveKey={['0']} alwaysOpen>
                    {permissionGroups.map((group, idx) => (
                        <Accordion.Item key={group.module} eventKey={String(idx)}>
                            <Accordion.Header>
                                <strong>{getModuleLabel(group.module)}</strong>
                                <span className="badge bg-secondary ms-2">
                                    {Object.values(group.features).flat().filter(p => selectedPermissions.has(p.maquyen)).length}
                                    /{Object.values(group.features).flat().length}
                                </span>
                            </Accordion.Header>
                            <Accordion.Body>
                                {Object.entries(group.features).map(([feature, permissions]) => {
                                    const allSelected = permissions.every(p => selectedPermissions.has(p.maquyen));
                                    const someSelected = permissions.some(p => selectedPermissions.has(p.maquyen));

                                    return (
                                        <div key={feature} className="mb-3 pb-3 border-bottom">
                                            <div className="d-flex align-items-center mb-2">
                                                <Form.Check
                                                    type="checkbox"
                                                    id={`feature-${group.module}-${feature}`}
                                                    checked={allSelected}
                                                    ref={(el: HTMLInputElement | null) => {
                                                        if (el) el.indeterminate = someSelected && !allSelected;
                                                    }}
                                                    onChange={() => handleToggleFeature(permissions)}
                                                    className="me-2"
                                                />
                                                <h6 className="mb-0 text-primary">{getFeatureLabel(feature)}</h6>
                                            </div>
                                            <div className="ms-4 d-flex flex-wrap gap-3">
                                                {permissions.map((perm) => (
                                                    <Form.Check
                                                        key={perm.maquyen}
                                                        type="checkbox"
                                                        id={perm.maquyen}
                                                        label={getActionLabel(perm.hanhdonh)}
                                                        checked={selectedPermissions.has(perm.maquyen)}
                                                        onChange={() => handleTogglePermission(perm.maquyen)}
                                                        title={perm.tenquyen}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </Card.Body>
        </Card>
    );
};

export default RolePermissions;
