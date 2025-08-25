import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getMe, getExpenses, createExpense, deleteExpense } from "../api/axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchData() {
      const meRes = await getMe(token);
      setUser(meRes.data);
      const expRes = await getExpenses(token);
      setExpenses(expRes.data);
    }
    fetchData();
  }, [token]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await createExpense(form, token);
    setExpenses([...expenses, res.data]);
    setForm({ title: "", amount: "", category: "Food", date: "" });
  };

  const handleDelete = async (id) => {
    await deleteExpense(id, token);
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  // Chart data
  const categories = [...new Set(expenses.map((exp) => exp.category))];
  const chartData = categories.map((cat) => {
    const total = expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + Number(e.amount), 0);
    return { name: cat, value: total };
  });

  // Cooler pastel color palette
  const COLORS = [
    "#6366F1", // Indigo
    "#06B6D4", // Cyan
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#EC4899", // Pink
    "#8B5CF6", // Violet
  ];

  // Export CSV
  const handleExport = () => {
    const csvRows = [["Title", "Amount", "Category", "Date"]];
    expenses.forEach((exp) => {
      csvRows.push([exp.title, exp.amount, exp.category, exp.date].join(","));
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.href = url;
    a.download = "expenses.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50 p-6">
      {/* Navbar */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">
          Welcome, <span className="text-indigo-600">{user?.full_name}</span> 👋
        </h1>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleExport}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow"
          >
            Export
          </motion.button>
          <button
            className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg shadow"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {[
          { title: "Total Expenses", value: `₹${totalAmount}` },
          { title: "Categories", value: categories.length },
          { title: "Transactions", value: expenses.length },
        ].map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4 }}
            className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg"
          >
            <h2 className="text-gray-500 text-sm">{card.title}</h2>
            <p className="text-2xl font-bold mt-2">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Add Expense */}
      <motion.form
        onSubmit={handleAdd}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg flex flex-wrap gap-3 mb-10"
      >
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-2 rounded flex-1"
        />
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="border p-2 rounded w-32"
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="border p-2 rounded"
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border p-2 rounded"
        >
          <option>Food</option>
          <option>Travel</option>
          <option>Bills</option>
          <option>Shopping</option>
          <option>Others</option>
        </select>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded shadow"
        >
          Add
        </motion.button>
      </motion.form>

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Expense List */}
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
          <ul className="space-y-3">
            <AnimatePresence>
              {expenses.map((exp) => (
                <motion.li
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex justify-between items-center bg-white p-4 rounded-xl shadow"
                >
                  <div>
                    <p className="font-semibold">
                      {exp.title} – ₹{exp.amount}
                    </p>
                    <p className="text-sm text-gray-500">
                      {exp.category} • {exp.date}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleDelete(exp.id)}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </motion.button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          {expenses.length === 0 && (
            <p className="text-gray-500 text-center mt-6">
              No expenses yet 😎 Add your first one above.
            </p>
          )}
        </div>

        {/* Chart */}
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Expense Breakdown</h2>
          <div className="w-full h-80">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  label
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
