import React, { useState, useEffect, useCallback } from 'react';
import { getExpensesApi, getCategoriesApi, createExpenseApi, updateExpenseApi, deleteExpenseApi } from '../services/expenses.api';
import ExpenseList from '../components/expenses/ExpenseList';
import ExpenseForm from '../components/expenses/ExpenseForm';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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
    }, 300); // 300ms debounce for search input
    return () => clearTimeout(timer);
  }, [fetchExpenses]);

  // Total Summary Calculation
  const totalAmount = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);

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
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await deleteExpenseApi(id);
      fetchExpenses();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete expense');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategoryId('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div>
      {/* Top Banner / Summary */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem', marginBottom: '0.25rem' }}>
            My Expenses
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage and track your personal spending
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Spent
            </span>
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>
              ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <button
            onClick={handleOpenAddForm}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.95rem',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            }}
          >
            + Add Expense
          </button>
        </div>
      </div>

      {/* Expense Form Modal / Collapsible */}
      {showForm && (
        <ExpenseForm
          categories={categories}
          initialData={editingExpense}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Filters Toolbar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'center' }}>
          {/* Search Input */}
          <input
            type="text"
            placeholder="🔍 Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              backgroundColor: '#0f172a',
              color: 'var(--text-main)',
              fontSize: '0.9rem'
            }}
          />

          {/* Category Select Filter */}
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              backgroundColor: '#0f172a',
              color: 'var(--text-main)',
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

          {/* Start Date */}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="From Date"
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              backgroundColor: '#0f172a',
              color: 'var(--text-main)',
              fontSize: '0.9rem'
            }}
          />

          {/* End Date */}
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="To Date"
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              backgroundColor: '#0f172a',
              color: 'var(--text-main)',
              fontSize: '0.9rem'
            }}
          />

          {/* Reset Filters */}
          <button
            onClick={handleResetFilters}
            title="Reset Filters"
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              backgroundColor: '#334155',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Expense List Container */}
      <ExpenseList
        expenses={expenses}
        loading={loading}
        error={error}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
      />
    </div>
  );
};

export default Expenses;
