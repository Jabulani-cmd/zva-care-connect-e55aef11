import type { StaffRole } from "./demoAccounts";

export type StaffRxQueueItem = {
  id: string;
  patient: string;
  doctor: string;
  medication: string;
  dosage: string;
  uploadedAt: string;
  priority: "Routine" | "Urgent" | "Stat";
  status: "Pending" | "Approved" | "Dispensed" | "Rejected";
  notes?: string;
  customerPhone: string;
  customerEmail: string;
  medicalAid?: string;
  isRepeat?: boolean;
  repeatsLeft?: number;
  isCustomerRx?: boolean;
  authId?: string;
};

export type StaffDriver = {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  status: "Available" | "On delivery" | "Off duty";
  zone: string;
  activeOrders: number;
  completedToday: number;
};

export type StaffDelivery = {
  id: string;
  customer: string;
  address: string;
  items: number;
  total: number;
  status:
    | "Ready to dispatch"
    | "Assigned"
    | "Out for delivery"
    | "Delivered";
  driverId?: string;
  eta?: string;
  paymentMethod: string;
  placedAt: string;
};

export type StaffInventoryItem = {
  sku: string;
  name: string;
  category: string;
  onHand: number;
  reorderLevel: number;
  costPrice: number;
  sellingPrice: number;
  expiry: string;
  supplier: string;
  isScheduled?: boolean;
};

export type StaffExpense = {
  id: string;
  category:
    | "Rent"
    | "Utilities"
    | "Stock"
    | "Salaries"
    | "Logistics"
    | "Marketing"
    | "Other";
  description: string;
  amount: number;
  date: string;
  submittedBy: string;
  status: "Pending" | "Approved" | "Rejected";
  receiptUrl?: string;
};

export type StaffPurchaseOrder = {
  id: string;
  supplier: string;
  items: {
    sku: string;
    name: string;
    qty: number;
    unitCost: number;
  }[];
  total: number;
  status: "Draft" | "Sent" | "Partially received" | "Received";
  createdAt: string;
  expectedAt: string;
};

export type StaffSystemUser = {
  id: string;
  name: string;
  email: string;
  role: StaffRole | "customer";
  branch: string;
  status: "Active" | "Locked" | "Invited";
  lastLogin: string;
};

export const STAFF_RX_QUEUE: StaffRxQueueItem[] = [
  {
    id: "RX-2026-001142",
    patient: "Nomsa Dlamini",
    doctor: "Dr R. Khumalo (MP12345)",
    medication: "Metformin 850mg",
    dosage: "1 tab BD x 30 days + Aspirin 75mg OD",
    uploadedAt: "Today 08:45",
    priority: "Urgent",
    status: "Pending",
    notes:
      "Patient is diabetic with cardiac history. " +
      "Verify dose with prescriber if unsure.",
    customerPhone: "+263 73 890 1234",
    customerEmail: "nomsa.dlamini@demo.plus2pharmacy.com",
    medicalAid: "Bonitas BonEssential #BON7723981",
    isRepeat: false,
  },
  {
    id: "RX-2026-001141",
    patient: "Tinashe Mukamuri",
    doctor: "Dr S. Patel (MP44521)",
    medication: "Amoxicillin 500mg",
    dosage: "1 cap TDS x 7 days",
    uploadedAt: "Today 07:22",
    priority: "Routine",
    status: "Pending",
    notes: "Chest infection. Patient allergies: none disclosed.",
    customerPhone: "+263 71 445 8821",
    customerEmail: "tinashe.m@demo.plus2pharmacy.com",
  },
  {
    id: "RX-2026-001140",
    patient: "Chipo Marufu",
    doctor: "Dr M. Banda (MP91230)",
    medication: "Atorvastatin 20mg",
    dosage: "1 tab nocte",
    uploadedAt: "Today 06:58",
    priority: "Routine",
    status: "Pending",
    isRepeat: true,
    repeatsLeft: 4,
    customerPhone: "+263 78 220 9981",
    customerEmail: "chipo.m@demo.plus2pharmacy.com",
    medicalAid: "PSMAS Standard",
  },
  {
    id: "RX-2026-001139",
    patient: "Thabo Nkosi",
    doctor: "Dr Patel",
    medication: "Amlodipine 10mg",
    dosage: "1 tab OD x 30 days",
    uploadedAt: "Yesterday 16:10",
    priority: "Routine",
    status: "Approved",
    customerPhone: "+263 71 234 5678",
    customerEmail: "thabo.nkosi@demo.plus2pharmacy.com",
  },
  {
    id: "RX-2026-001138",
    patient: "Priya Naidoo",
    doctor: "Dr Singh",
    medication: "Ventolin Inhaler 100mcg",
    dosage: "2 puffs PRN",
    uploadedAt: "2 days ago",
    priority: "Routine",
    status: "Dispensed",
    customerPhone: "+263 82 567 8901",
    customerEmail: "priya.naidoo@demo.plus2pharmacy.com",
  },
  {
    id: "RX-2026-001137",
    patient: "Faith Moyo",
    doctor: "Dr P. Sibanda",
    medication: "Tramadol 50mg",
    dosage: "1 cap QDS PRN x 5 days",
    uploadedAt: "Today 09:12",
    priority: "Stat",
    status: "Pending",
    notes: "Schedule 5 — verify ID on collection.",
    customerPhone: "+263 77 660 1102",
    customerEmail: "faith.moyo@demo.plus2pharmacy.com",
  },
];

export const STAFF_DRIVERS: StaffDriver[] = [
  {
    id: "DRV-01",
    name: "Siphamandla Dube",
    phone: "+263 77 334 5566",
    vehicle: "VW Polo · AEB 7790",
    status: "On delivery",
    zone: "Avondale / Mount Pleasant",
    activeOrders: 2,
    completedToday: 5,
  },
  {
    id: "DRV-02",
    name: "Tatenda Chirwa",
    phone: "+263 71 998 4421",
    vehicle: "Honda Fit · AFC 1230",
    status: "Available",
    zone: "CBD / Eastlea",
    activeOrders: 0,
    completedToday: 7,
  },
  {
    id: "DRV-03",
    name: "Bongani Sithole",
    phone: "+263 78 661 7700",
    vehicle: "Toyota Hilux · ACJ 4821",
    status: "Available",
    zone: "Borrowdale / Highlands",
    activeOrders: 0,
    completedToday: 4,
  },
  {
    id: "DRV-04",
    name: "Rudo Mhlanga",
    phone: "+263 73 220 9981",
    vehicle: "Mahindra Bolero · AGB 2287",
    status: "Off duty",
    zone: "Chitungwiza",
    activeOrders: 0,
    completedToday: 6,
  },
];

export const STAFF_DELIVERIES: StaffDelivery[] = [
  {
    id: "P2-2026-3301",
    customer: "Nomsa Dlamini",
    address: "3 Polokwane Street, Mount Pleasant",
    items: 4,
    total: 89.5,
    status: "Ready to dispatch",
    paymentMethod: "Card · Paid",
    placedAt: "09:14",
  },
  {
    id: "P2-2026-3302",
    customer: "James van der Merwe",
    address: "22 Blouberg Road, Borrowdale",
    items: 2,
    total: 149.99,
    status: "Ready to dispatch",
    paymentMethod: "EFT · Pending",
    placedAt: "09:42",
  },
  {
    id: "P2-2026-3303",
    customer: "Priya Naidoo",
    address: "7 Umhlanga Ridge, Avondale",
    items: 6,
    total: 245.0,
    status: "Ready to dispatch",
    paymentMethod: "COD",
    placedAt: "10:01",
  },
  {
    id: "P2-2026-3298",
    customer: "Ruan Botha",
    address: "45 Menlyn Park Ave, Eastlea",
    items: 3,
    total: 119.97,
    status: "Assigned",
    driverId: "DRV-01",
    eta: "11:30",
    paymentMethod: "Card · Paid",
    placedAt: "08:55",
  },
  {
    id: "P2-2026-3299",
    customer: "Thabo Nkosi",
    address: "14 Samora Machel Ave, CBD",
    items: 5,
    total: 312.45,
    status: "Out for delivery",
    driverId: "DRV-01",
    eta: "10:50",
    paymentMethod: "Medical Aid",
    placedAt: "08:32",
  },
  {
    id: "P2-2026-3295",
    customer: "Chipo Marufu",
    address: "12 Glenara South, Eastlea",
    items: 2,
    total: 67.0,
    status: "Delivered",
    driverId: "DRV-02",
    paymentMethod: "Card · Paid",
    placedAt: "07:40",
  },
];

export const STAFF_INVENTORY: StaffInventoryItem[] = [
  {
    sku: "MED-0021",
    name: "Panado 500mg 24s",
    category: "Pain & Fever",
    onHand: 142,
    reorderLevel: 50,
    costPrice: 18.5,
    sellingPrice: 29.99,
    expiry: "2027-08",
    supplier: "Adcock Ingram ZW",
  },
  {
    sku: "MED-0044",
    name: "Amoxicillin 500mg 21s",
    category: "Antibiotics",
    onHand: 18,
    reorderLevel: 30,
    costPrice: 42.0,
    sellingPrice: 79.99,
    expiry: "2026-12",
    supplier: "CAPS Pharmaceuticals",
    isScheduled: true,
  },
  {
    sku: "MED-0078",
    name: "Ventolin Inhaler 100mcg",
    category: "Respiratory",
    onHand: 64,
    reorderLevel: 20,
    costPrice: 95.0,
    sellingPrice: 149.99,
    expiry: "2027-03",
    supplier: "GSK Zimbabwe",
  },
  {
    sku: "MED-0091",
    name: "Metformin 850mg 90s",
    category: "Chronic",
    onHand: 89,
    reorderLevel: 25,
    costPrice: 78.0,
    sellingPrice: 124.99,
    expiry: "2027-06",
    supplier: "Datlabs",
  },
  {
    sku: "MED-0102",
    name: "Amlodipine 10mg 30s",
    category: "Chronic",
    onHand: 11,
    reorderLevel: 30,
    costPrice: 32.5,
    sellingPrice: 64.99,
    expiry: "2026-11",
    supplier: "CAPS Pharmaceuticals",
  },
  {
    sku: "MED-0115",
    name: "Atorvastatin 20mg 30s",
    category: "Chronic",
    onHand: 47,
    reorderLevel: 20,
    costPrice: 56.0,
    sellingPrice: 99.99,
    expiry: "2027-09",
    supplier: "Datlabs",
  },
  {
    sku: "MED-0133",
    name: "Tramadol 50mg 20s",
    category: "Pain & Fever",
    onHand: 6,
    reorderLevel: 15,
    costPrice: 88.0,
    sellingPrice: 159.99,
    expiry: "2026-10",
    supplier: "Adcock Ingram ZW",
    isScheduled: true,
  },
  {
    sku: "VIT-0203",
    name: "Vitaforce Multivitamin 60s",
    category: "Vitamins",
    onHand: 220,
    reorderLevel: 40,
    costPrice: 89.0,
    sellingPrice: 149.99,
    expiry: "2028-01",
    supplier: "Vitaforce SA",
  },
  {
    sku: "VIT-0214",
    name: "Caltrate Calcium 60s",
    category: "Vitamins",
    onHand: 56,
    reorderLevel: 25,
    costPrice: 64.5,
    sellingPrice: 99.99,
    expiry: "2027-11",
    supplier: "Pfizer",
  },
  {
    sku: "BAB-0301",
    name: "Huggies Gold Nappies M",
    category: "Baby",
    onHand: 78,
    reorderLevel: 30,
    costPrice: 220.0,
    sellingPrice: 349.99,
    expiry: "—",
    supplier: "Kimberly-Clark",
  },
  {
    sku: "BAB-0307",
    name: "Johnson's Baby Shampoo 500ml",
    category: "Baby",
    onHand: 134,
    reorderLevel: 40,
    costPrice: 38.0,
    sellingPrice: 69.99,
    expiry: "2028-04",
    supplier: "Johnson & Johnson",
  },
  {
    sku: "PER-0411",
    name: "Dettol Antiseptic 500ml",
    category: "Personal Care",
    onHand: 92,
    reorderLevel: 30,
    costPrice: 38.5,
    sellingPrice: 64.99,
    expiry: "2028-02",
    supplier: "Reckitt Benckiser",
  },
  {
    sku: "PER-0418",
    name: "Dove Body Wash 400ml",
    category: "Personal Care",
    onHand: 8,
    reorderLevel: 20,
    costPrice: 48.0,
