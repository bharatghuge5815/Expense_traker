import React, { useState, useEffect, useCallback } from 'react';
import { getExpensesApi, getCategoriesApi, createExpenseApi, updateExpenseApi, deleteExpenseApi } from '../services/expenses.api';
import Sidebar from '../components/layout/Sidebar';
import SummaryCard from '../components/dashboard/SummaryCard';
import TransactionTable from '../components/expenses/TransactionTable';
import TransactionPagination from '../components/expenses/TransactionPagination';
import ExpenseForm from '../components/expenses/ExpenseForm';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [transactionType, setTransactionType] = useState('ALL'); // ALL, EXPENSE, INCOME
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Form Modal State
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Categories on Mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategoriesApi();
        if (data.success) {
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Expenses with Filter params
  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (search.trim()) params.search = search.trim();
      if (categoryId) params.category_id = categoryId;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const data = await getExpensesApi(params);
      if (data.success) {
        setExpenses(data.expenses || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, [search, categoryId, startDate, endDate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExpenses();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchExpenses]);

  // Client-side filtering by Transaction Type (Expense vs Income)
  const filteredExpenses = expenses.filter(tx => {
    if (transactionType === 'EXPENSE') {
      return !tx.description || !tx.description.toLowerCase().includes('salary');
    }
    if (transactionType === 'INCOME') {
      return tx.description && tx.description.toLowerCase().includes('salary');
    }
    return true;
  });

  // Calculate totals
  const totalExpensesSum = filteredExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalIncomeSum = 72300;
  const totalBalanceSum = totalIncomeSum - totalExpensesSum;

  // Paginated Slicing
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Form Handlers
  const handleOpenAddForm = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      if (editingExpense) {
        await updateExpenseApi(editingExpense.id, formData);
      } else {
        await createExpenseApi(formData);
      }
      handleCloseForm();
      fetchExpenses();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await deleteExpenseApi(id);
      fetchExpenses();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete transaction');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategoryId('');
    setTransactionType('ALL');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  return (
    <div className="dashboard-layout-wrapper">
      {/* Left Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="dashboard-main-content">
        {/* Top Header */}
        <div className="dashboard-top-header">
          <div>
            <h1 className="dashboard-greeting">Transactions</h1>
            <p className="dashboard-subgreeting">
              Track and review all your income and expenses
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '0.65rem 1rem',
              fontSize: '0.9rem',
              color: '#334155'
            }}>
              Total Balance: <strong style={{ color: '#16a34a' }}>₹{totalBalanceSum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
            </div>

            <button className="btn-add-expense" onClick={() => navigate('/add-expense')}>
              + Add Expense
            </button>
          </div>
        </div>

        {/* 4 Compact Stat Cards */}
        <div className="dashboard-grid-4" style={{ marginBottom: '1.5rem' }}>
          <SummaryCard
            title="Total Income"
            value={totalIncomeSum}
            icon="⬇️"
            trend="8.3% vs last month"
            iconBg="#dcfce7"
            iconColor="#16a34a"
          />
          <SummaryCard
            title="Total Expenses"
            value={totalExpensesSum}
            icon="⬆️"
            trend="15.7% vs last month"
            isNegative={true}
            iconBg="#fee2e2"
            iconColor="#ef4444"
          />
          <SummaryCard
            title="Savings"
            value={totalBalanceSum}
            icon="🐷"
            trend="10.2% vs last month"
            iconBg="#dbeafe"
            iconColor="#2563eb"
          />
          <SummaryCard
            title="This Month"
            value={totalExpensesSum}
            icon="📅"
            trend="Current Period"
            iconBg="#f3e8ff"
            iconColor="#9333ea"
          />
        </div>

        {/* Form Modal */}
        {showForm && (
          <ExpenseForm
            categories={categories}
            initialData={editingExpense}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Clean Filter Toolbar */}
        <div className="dashboard-card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'center' }}>
            {/* Search */}
            <input
              type="text"
              placeholder="🔍 Search transactions..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                fontSize: '0.9rem'
              }}
            />

            {/* Category Dropdown */}
            <select
              value={categoryId}
              onChange={(e) => { setCategoryId(e.target.value); setCurrentPage(1); }}
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                fontSize: '0.9rem'
              }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Type Dropdown */}
            <select
              value={transactionType}
              onChange={(e) => { setTransactionType(e.target.value); setCurrentPage(1); }}
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                fontSize: '0.9rem'
              }}
            >
              <option value="ALL">All Types</option>
              <option value="EXPENSE">Expenses Only</option>
              <option value="INCOME">Income Only</option>
            </select>

            {/* Start Date */}
            <input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                fontSize: '0.9rem'
              }}
            />

            {/* End Date */}
            <input
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                fontSize: '0.9rem'
              }}
            />

            {/* Reset */}
            <button
              onClick={handleResetFilters}
              style={{
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#64748b',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Transactions Table & Pagination Container */}
        {loading ? (
          <div className="dashboard-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div className="status-badge loading" style={{ display: 'inline-flex' }}>
              <span className="dot loading"></span>
              Loading transactions...
            </div>
          </div>
        ) : error ? (
          <div className="dashboard-card">
            <div className="status-badge error" style={{ width: '100%' }}>
              <span className="dot error"></span>
              {error}
            </div>
          </div>
        ) : (
          <div className="dashboard-card" style={{ padding: '0', overflow: 'hidden' }}>
            <TransactionTable
              transactions={paginatedExpenses}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />

            <TransactionPagination
              totalItems={filteredExpenses.length}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={(page) => setCurrentPage(page)}
              onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Expenses;
