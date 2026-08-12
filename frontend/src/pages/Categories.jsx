import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { getCategoriesApi, getExpensesApi } from '../services/expenses.api';

const DEFAULT_CATEGORY_ICONS = {
  'Food & Dining': '🍔',
  'Food': '🍔',
  'Transport': '🚌',
  'Travel': '🚌',
  'Shopping': '🛍️',
  'Bills & Utilities': '⚡',
  'Bills': '⚡',
  'Entertainment': '🍿',
  'Health': '🏥',
  'Education': '🎓',
  'Rent': '🏠',
  'Hostel': '🏠',
  'Other': '📦'
};

const EMOJI_OPTIONS = ['🍔', '🚌', '🛍️', '⚡', '🍿', '🏥', '🎓', '🏠', '📦', '✈️', '🎮', '🏋️', '☕', '🚗', '💡'];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryNameInput, setCategoryNameInput] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🍔');

  // Custom added categories stored locally
  const [customCategories, setCustomCategories] = useState(() => {
    const saved = localStorage.getItem('custom_user_categories');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, expRes] = await Promise.all([
          getCategoriesApi(),
          getExpensesApi()
        ]);

        if (catRes.success) setCategories(catRes.categories || []);
        if (expRes.success) setExpenses(expRes.expenses || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute transactions count & total spent per category
  const catStatsMap = {};
  expenses.forEach((e) => {
    const cat = e.category_name || 'Other';
    if (!catStatsMap[cat]) {
      catStatsMap[cat] = { count: 0, total: 0 };
    }
    catStatsMap[cat].count += 1;
    catStatsMap[cat].total += Number(e.amount || 0);
  });

  // Combine database categories + custom categories
  const allCategoryList = Array.from(new Set([
    ...categories.map(c => c.name),
    ...customCategories.map(c => c.name),
    'Food & Dining', 'Transport', 'Shopping', 'Bills & Utilities', 'Entertainment', 'Health', 'Education', 'Other'
  ])).map(name => {
    const foundCustom = customCategories.find(c => c.name === name);
    return {
      name,
      icon: foundCustom?.icon || DEFAULT_CATEGORY_ICONS[name] || '📦',
      count: catStatsMap[name]?.count || 0,
      total: catStatsMap[name]?.total || 0
    };
  });

  const mostSpentCategory = allCategoryList.length > 0
    ? [...allCategoryList].sort((a, b) => b.total - a.total)[0]
    : { name: 'Food & Dining', total: 0 };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setCategoryNameInput('');
    setSelectedEmoji('🍔');
    setShowModal(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat.name);
    setCategoryNameInput(cat.name);
    setSelectedEmoji(cat.icon);
    setShowModal(true);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!categoryNameInput.trim()) {
      alert('Please enter a valid category name.');
      return;
    }

    const name = categoryNameInput.trim();

    if (editingCategory) {
      // Edit existing
      const updated = customCategories.map(c => c.name === editingCategory ? { name, icon: selectedEmoji } : c);
      if (!customCategories.some(c => c.name === editingCategory)) {
        updated.push({ name, icon: selectedEmoji });
      }
      setCustomCategories(updated);
      localStorage.setItem('custom_user_categories', JSON.stringify(updated));
    } else {
      // Add new
      const updated = [...customCategories, { name, icon: selectedEmoji }];
      setCustomCategories(updated);
      localStorage.setItem('custom_user_categories', JSON.stringify(updated));
    }

    setShowModal(false);
  };

  const handleDeleteCategory = (catName) => {
    if (!window.confirm(`Are you sure you want to delete "${catName}" category?`)) return;
    const updated = customCategories.filter(c => c.name !== catName);
    setCustomCategories(updated);
    localStorage.setItem('custom_user_categories', JSON.stringify(updated));
  };

  return (
    <div className="dashboard-layout-wrapper">
      <Sidebar />

      <main className="dashboard-main-content">
        {/* Top Header */}
        <div className="dashboard-top-header" style={{ marginBottom: '1.5rem' }}>
          <div>
            <h1 className="dashboard-greeting">Categories 🏷️</h1>
            <p className="dashboard-subgreeting">
              Manage expense categories, budget tags, and icons
            </p>
          </div>

          <button className="btn-add-expense" onClick={handleOpenAdd}>
            + Add Category
          </button>
        </div>

        {/* Stat Cards */}
        <div className="dashboard-grid-4" style={{ marginBottom: '1.75rem' }}>
          <div className="stat-card">
            <div className="stat-title">Total Categories</div>
            <div className="stat-value">{allCategoryList.length}</div>
            <div className="stat-trend positive">Configured tags</div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Active Categories</div>
            <div className="stat-value">
              {allCategoryList.filter(c => c.count > 0).length}
            </div>
            <div className="stat-trend positive">With transactions</div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Most Spent Category</div>
            <div className="stat-value" style={{ fontSize: '1.2rem', color: '#16a34a' }}>
              {mostSpentCategory?.name}
            </div>
            <div className="stat-trend positive">
              ₹ {mostSpentCategory?.total.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Category System</div>
            <div className="stat-value" style={{ fontSize: '1.2rem' }}>✅ Active</div>
            <div className="stat-trend positive">All categories live</div>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="dashboard-card" style={{ width: '100%', maxWidth: '420px', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>

              <form onSubmit={handleSaveCategory}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="auth-input-label">Category Name *</label>
                  <input
                    type="text"
                    value={categoryNameInput}
                    onChange={(e) => setCategoryNameInput(e.target.value)}
                    placeholder="e.g. Fitness & Gym"
                    className="auth-input-field"
                    style={{ paddingLeft: '1rem' }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="auth-input-label">Select Emoji Icon</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.4rem' }}>
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedEmoji(emoji)}
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '8px',
                          border: selectedEmoji === emoji ? '2px solid #16a34a' : '1px solid #e2e8f0',
                          backgroundColor: selectedEmoji === emoji ? '#f0fdf4' : '#ffffff',
                          fontSize: '1.25rem',
                          cursor: 'pointer'
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      padding: '0.65rem 1.1rem',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      color: '#64748b',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-auth-primary"
                    style={{ width: 'auto', padding: '0.65rem 1.25rem' }}
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Category Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {allCategoryList.map((cat) => (
            <div key={cat.name} className="dashboard-card" style={{ padding: '1.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem'
                  }}>
                    {cat.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>
                      {cat.name}
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {cat.count} transactions
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
                    title="Edit category"
                  >
                    ✏️
                  </button>
                  {customCategories.some(c => c.name === cat.name) && (
                    <button
                      onClick={() => handleDeleteCategory(cat.name)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
                      title="Delete category"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Total Spent</span>
                <span style={{ fontSize: '1rem', fontWeight: '700', color: '#16a34a' }}>
                  ₹ {cat.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Categories;
