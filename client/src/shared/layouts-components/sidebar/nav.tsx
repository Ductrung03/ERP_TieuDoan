
import * as Svgicons from "./menusvg-icons";

export const MENUITEMS: any = [
  {
    menutitle: 'QUẢN LÝ CANH GÁC'
  },
  {
    title: "Canh Gác", icon: Svgicons.Pagesicon, type: "sub", active: true, dirchange: false, children: [
      { path: `${import.meta.env.BASE_URL}guard-management/dashboard`, title: "Dashboard", type: "link", active: false, selected: false, dirchange: false },
      { path: `${import.meta.env.BASE_URL}guard-management/lich-gac`, title: "Lịch Gác", type: "link", active: false, selected: false, dirchange: false },
      { path: `${import.meta.env.BASE_URL}guard-management/phan-cong`, title: "Phân Công", type: "link", active: false, selected: false, dirchange: false },
      { path: `${import.meta.env.BASE_URL}guard-management/kiem-tra`, title: "Kiểm Tra", type: "link", active: false, selected: false, dirchange: false },
      { path: `${import.meta.env.BASE_URL}guard-management/hoc-vien`, title: "Học Viên", type: "link", active: false, selected: false, dirchange: false },
      { path: `${import.meta.env.BASE_URL}guard-management/can-bo`, title: "Cán Bộ", type: "link", active: false, selected: false, dirchange: false },
      { path: `${import.meta.env.BASE_URL}guard-management/don-vi`, title: "Đơn Vị", type: "link", active: false, selected: false, dirchange: false },
      { path: `${import.meta.env.BASE_URL}guard-management/vktb`, title: "VKTB", type: "link", active: false, selected: false, dirchange: false },
    ]
  },
]