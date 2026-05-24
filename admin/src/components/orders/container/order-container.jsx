"use client";
import { useRouter } from "next/navigation";
import { OrderColumns } from "../components/orders/order-columns";
import { DataTable } from "@/components/ui/data-table";
import OrderHeader from "../components/orders/order-header";
import OrderStats from "../components/orders/order-stats";
import Orders from "@/app/(protected)/orders/page";
import OrdersTable from "../components/orders/orders-table";

export default function OrderContainer() {
  // const router = useRouter();
  // const [search, setSearch] = useState("");
  // const [status, setStatus] = useState("all");
  // const [payment, setPayment] = useState("all");

 const data = [
  {
    id: "ORD-001",
    customer: "John Doe",
    amount: 120,
    status: "pending",
    payment: "paid",
    date: "2026-04-26",
    items: [
      {
        id: "IT-001",
        name: "T-Shirt",
        sku: "TS-001",
        qty: 2,
        price: 60,
        image: "https://via.placeholder.com/50",
      },
    ],
    payments: [
      {
        id: "PAY-001-A",
        amount: 120,
        method: "UPI",
        status: "success",
        date: "2026-04-26 10:00 AM",
      },
    ],
  },

  {
    id: "ORD-002",
    customer: "Rahul Sharma",
    amount: 450,
    status: "processing",
    payment: "paid",
    date: "2026-04-26",
    items: [
      {
        id: "IT-002",
        name: "Shoes",
        sku: "SH-002",
        qty: 1,
        price: 450,
        image: "https://via.placeholder.com/50",
      },
    ],
    payments: [
      {
        id: "PAY-002-A",
        amount: 450,
        method: "Card",
        status: "failed",
        date: "2026-04-26 09:55 AM",
      },
      {
        id: "PAY-002-B",
        amount: 450,
        method: "UPI",
        status: "success",
        date: "2026-04-26 10:05 AM",
      },
    ],
  },

  {
    id: "ORD-003",
    customer: "Amit Kumar",
    amount: 300,
    status: "delivered",
    payment: "paid",
    date: "2026-04-25",
    items: [
      {
        id: "IT-003",
        name: "Backpack",
        sku: "BP-003",
        qty: 1,
        price: 300,
        image: "https://via.placeholder.com/50",
      },
    ],
    payments: [
      {
        id: "PAY-003-A",
        amount: 300,
        method: "Net Banking",
        status: "success",
        date: "2026-04-25 11:00 AM",
      },
    ],
  },

  {
    id: "ORD-004",
    customer: "Priya Singh",
    amount: 799,
    status: "cancelled",
    payment: "failed",
    date: "2026-04-25",
    items: [
      {
        id: "IT-004",
        name: "Watch",
        sku: "WT-004",
        qty: 1,
        price: 799,
        image: "https://via.placeholder.com/50",
      },
    ],
    payments: [
      {
        id: "PAY-004-A",
        amount: 799,
        method: "Card",
        status: "failed",
        date: "2026-04-25 12:10 PM",
      },
    ],
  },

  {
    id: "ORD-005",
    customer: "Neha Verma",
    amount: 250,
    status: "pending",
    payment: "pending",
    date: "2026-04-24",
    items: [
      {
        id: "IT-005",
        name: "Handbag",
        sku: "HB-005",
        qty: 1,
        price: 250,
        image: "https://via.placeholder.com/50",
      },
    ],
    payments: [
      {
        id: "PAY-005-A",
        amount: 250,
        method: "COD",
        status: "pending",
        date: "2026-04-24 01:00 PM",
      },
    ],
  },

  {
    id: "ORD-006",
    customer: "Ravi Patel",
    amount: 999,
    status: "processing",
    payment: "paid",
    date: "2026-04-24",
    items: [
      {
        id: "IT-006",
        name: "Smartphone",
        sku: "PH-006",
        qty: 1,
        price: 999,
        image: "https://via.placeholder.com/50",
      },
    ],
    payments: [
      {
        id: "PAY-006-A",
        amount: 999,
        method: "UPI",
        status: "success",
        date: "2026-04-24 02:30 PM",
      },
    ],
  },

  {
    id: "ORD-007",
    customer: "Sneha Gupta",
    amount: 150,
    status: "delivered",
    payment: "paid",
    date: "2026-04-23",
    items: [
      {
        id: "IT-007",
        name: "Sunglasses",
        sku: "SG-007",
        qty: 1,
        price: 150,
        image: "https://via.placeholder.com/50",
      },
    ],
    payments: [
      {
        id: "PAY-007-A",
        amount: 150,
        method: "Wallet",
        status: "success",
        date: "2026-04-23 09:15 AM",
      },
    ],
  },

  {
    id: "ORD-008",
    customer: "Arjun Mehta",
    amount: 670,
    status: "processing",
    payment: "paid",
    date: "2026-04-23",
    items: [
      {
        id: "IT-008",
        name: "Headphones",
        sku: "HP-008",
        qty: 1,
        price: 670,
        image: "https://via.placeholder.com/50",
      },
    ],
    payments: [
      {
        id: "PAY-008-A",
        amount: 670,
        method: "Card",
        status: "success",
        date: "2026-04-23 10:40 AM",
      },
    ],
  },

  {
    id: "ORD-009",
    customer: "Kavita Joshi",
    amount: 520,
    status: "pending",
    payment: "failed",
    date: "2026-04-22",
    items: [
      {
        id: "IT-009",
        name: "Mixer Grinder",
        sku: "MG-009",
        qty: 1,
        price: 520,
        image: "https://via.placeholder.com/50",
      },
    ],
    payments: [
      {
        id: "PAY-009-A",
        amount: 520,
        method: "UPI",
        status: "failed",
        date: "2026-04-22 11:20 AM",
      },
    ],
  },

  {
    id: "ORD-010",
    customer: "Vikram Singh",
    amount: 880,
    status: "delivered",
    payment: "paid",
    date: "2026-04-22",
    items: [
      {
        id: "IT-010",
        name: "Office Chair",
        sku: "OC-010",
        qty: 1,
        price: 880,
        image: "https://via.placeholder.com/50",
      },
    ],
    payments: [
      {
        id: "PAY-010-A",
        amount: 880,
        method: "Net Banking",
        status: "success",
        date: "2026-04-22 03:45 PM",
      },
    ],
  },
];

//   const filtered = data.filter((o) =>
//     o.customer.toLowerCase().includes(search.toLowerCase())
//   );

  return (
    <div className="space-y-4">
    <OrderHeader/>
      {/* <OrdersFilters
        search={search}
        setSearch={setSearch}
        onReset={() => setSearch("")}
      /> */}
        <OrderStats/>

     <div className="bg-card p-4 space-y-4">

        {/* <DataTable columns={OrderColumns(router, setData)} data={filtered} />
         */}
         <OrdersTable orders = {data}/>
     </div>

    </div>
  );
}