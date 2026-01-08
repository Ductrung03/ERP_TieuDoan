
import * as Svgicons from "./menusvg-icons";

export const MENUITEMS: any = [
  {
    menutitle: 'QUẢN LÝ CANH GÁC'
  },
  { path: `${import.meta.env.BASE_URL}guard-management/dashboard`, icon: Svgicons.Dashboardicon, title: "Dashboard", type: "link", active: false, selected: false, dirchange: false },
  { path: `${import.meta.env.BASE_URL}guard-management/lich-gac`, icon: Svgicons.CalendarIcon, title: "Lịch Gác", type: "link", active: false, selected: false, dirchange: false },
  { path: `${import.meta.env.BASE_URL}guard-management/phan-cong`, icon: Svgicons.ClipboardCheckIcon, title: "Phân Công", type: "link", active: false, selected: false, dirchange: false },
  { path: `${import.meta.env.BASE_URL}guard-management/kiem-tra`, icon: Svgicons.ShieldCheckIcon, title: "Kiểm Tra", type: "link", active: false, selected: false, dirchange: false },
  { path: `${import.meta.env.BASE_URL}guard-management/hoc-vien`, icon: Svgicons.UserGroupIcon, title: "Học Viên", type: "link", active: false, selected: false, dirchange: false },
  { path: `${import.meta.env.BASE_URL}guard-management/can-bo`, icon: Svgicons.UserTieIcon, title: "Cán Bộ", type: "link", active: false, selected: false, dirchange: false },
  { path: `${import.meta.env.BASE_URL}guard-management/don-vi`, icon: Svgicons.BuildingIcon, title: "Đơn Vị", type: "link", active: false, selected: false, dirchange: false },
  { path: `${import.meta.env.BASE_URL}guard-management/vktb`, icon: Svgicons.BriefcaseIcon, title: "VKTB", type: "link", active: false, selected: false, dirchange: false },
  {
    menutitle: 'QUẢN LÝ NGƯỜI DÙNG'
  },
  { path: `${import.meta.env.BASE_URL}user-management/users`, icon: Svgicons.UsersIcon, title: "Người Dùng", type: "link", active: false, selected: false, dirchange: false },
  { path: `${import.meta.env.BASE_URL}user-management/roles`, icon: Svgicons.LockKeyIcon, title: "Vai Trò", type: "link", active: false, selected: false, dirchange: false },
]

