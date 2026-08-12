import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { getCategoriesApi, createExpenseApi } from '../services/expenses.api';

const CATEGORY_OPTIONS = [
  'Food & Dining',
  'Transport',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Health',
  'Education',
  'Rent',
  'Hostel',
  'Other'
];

const PAYMENT_METHODS = [
  'Cash',
  'UPI',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Other'
];

const AddExpense = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  // Form Fields
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [expenseTime, setExpenseTime] = useState(
    new Date().toTimeString().slice(0, 5)
  );
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('Food & Dining');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [transactionType, setTransactionType] = useState('EXPENSE'); // EXPENSE | INCOME
  const [notes, setNotes] = useState('');

  // Receipt File Attachment State
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptError, setReceiptError] = useState('');

  // UI States
  const [formError, setFormError] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Categories on Mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategoriesApi();
        if (data.success && data.categories?.length > 0) {
          setCategories(data.categories);
          setCategoryId(data.categories[0].id);
          setCategoryName(data.categories[0].name);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const selectedId = Number(e.target.value);
    setCategoryId(selectedId);
    const found = categories.find(c => c.id === selectedId);
    if (found) {
      setCategoryName(found.name);
    }
  };

  // Receipt File Upload Handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setReceiptError('');

    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setReceiptError('Only JPG, PNG, and PDF files are allowed.');
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      setReceiptError('File size exceeds the 5MB maximum limit.');
      return;
    }

    setReceiptFile(file);
  };

  const handleRemoveFile = () => {
    setReceiptFile(null);
    setReceiptError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessToast('');

    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setFormError('Please enter a valid amount greater than 0.');
      return;
    }

    if (!description.trim()) {
      setFormError('Description is required.');
      return;
    }

    if (!expenseDate) {
      setFormError('Please select a date.');
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        category_id: categoryId || 1,
        amount: numAmount,
        description: description.trim(),
        expense_date: expenseDate,
        notes: notes ? notes.trim() : undefined,
        payment_method: paymentMethod
      };

      const res = await createExpenseApi(payload);
      if (res.success) {
        setSuccessToast('Expense saved successfully!');
        setTimeout(() => {
          navigate('/expenses');
        }, 1200);
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Live amount preview display
  const numericAmount = Number(amount) || 0;
  const isIncome = transactionType === 'INCOME';

  return (
    <div className="dashboard-layout-wrapper">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="dashboard-main-content">
        {/* Top Header */}
        <div className="dashboard-top-header" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <button
              onClick={() => navigate('/expenses')}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.1rem',
                color: '#334155'
              }}
              title="Back to transactions"
            >
              ⬅️
            </button>
            <div>
              <h1 className="dashboard-greeting">Add Expense</h1>
              <p className="dashboard-subgreeting">
                Add a new expense to track your spending
              </p>
            </div>
          </div>

          <button
            onClick={() => alert('Recurring Expense feature selected.')}
            style={{
              padding: '0.65rem 1.1rem',
              borderRadius: '10px',
              border: '1px solid #16a34a',
              backgroundColor: '#ffffff',
              color: '#16a34a',
              fontWeight: '600',
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            🔄 Recurring Expense
          </button>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="status-badge connected" style={{ width: '100%', marginBottom: '1.25rem', padding: '0.85rem' }}>
            <span className="dot connected"></span>
            {successToast}
          </div>
        )}

        {/* Error Alert */}
        {formError && (
          <div className="status-badge error" style={{ width: '100%', marginBottom: '1.25rem', padding: '0.85rem' }}>
            <span className="dot error"></span>
            {formError}
          </div>
        )}

        {/* Two-Column Grid Layout */}
        <div className="dashboard-grid-2" style={{ gridTemplateColumns: '1.4fr 1fr', alignItems: 'start' }}>
          {/* LEFT COLUMN: Large Add Expense Form Card */}
          <div className="dashboard-card" style={{ padding: '1.75rem' }}>
            <form onSubmit={handleSubmit}>
              {/* 5. TRANSACTION TYPE SEGMENTED TOGGLE */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="auth-input-label" style={{ marginBottom: '0.5rem' }}>Transaction Type</label>
                <div style={{
                  display: 'flex',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '10px',
                  padding: '4px',
                  gap: '4px'
                }}>
                  <button
                    type="button"
                    onClick={() => setTransactionType('EXPENSE')}
                    style={{
                      flex: 1,
                      padding: '0.65rem',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: transactionType === 'EXPENSE' ? '#fef2f2' : 'transparent',
                      color: transactionType === 'EXPENSE' ? '#dc2626' : '#64748b',
                      border: transactionType === 'EXPENSE' ? '1px solid #fecaca' : 'none'
                    }}
                  >
                    💸 Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransactionType('INCOME')}
                    style={{
                      flex: 1,
                      padding: '0.65rem',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: transactionType === 'INCOME' ? '#f0fdf4' : 'transparent',
                      color: transactionType === 'INCOME' ? '#16a34a' : '#64748b',
                      border: transactionType === 'INCOME' ? '1px solid #bbf7d0' : 'none'
                    }}
                  >
                    💰 Income
                  </button>
                </div>
              </div>

              {/* A. PROMINENT AMOUNT FIELD */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="auth-input-label">Amount *</label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '0.6rem 1rem',
                  backgroundColor: '#ffffff',
                  transition: 'border-color 0.2s ease'
                }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: '800', color: '#16a34a', marginRight: '0.6rem' }}>₹</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    required
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      fontSize: '1.75rem',
                      fontWeight: '800',
                      color: '#0f172a',
                      backgroundColor: 'transparent'
                    }}
                  />
                </div>
              </div>

              {/* B. DESCRIPTION FIELD */}
              <div className="auth-input-group" style={{ marginBottom: '1.25rem' }}>
                <label className="auth-input-label">Description *</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">📝</span>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What did you spend on? (e.g. Hostel Fee)"
                    className="auth-input-field"
                    required
                  />
                </div>
              </div>

              {/* C. DATE + TIME SIDE-BY-SIDE */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label className="auth-input-label">Date *</label>
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="auth-input-field"
                    style={{ paddingLeft: '1rem' }}
                    required
                  />
                </div>

                <div>
                  <label className="auth-input-label">Time</label>
                  <input
                    type="time"
                    value={expenseTime}
                    onChange={(e) => setExpenseTime(e.target.value)}
                    className="auth-input-field"
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>
              </div>

              {/* D. CATEGORY + PAYMENT METHOD SIDE-BY-SIDE */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label className="auth-input-label">Category *</label>
                  <select
                    value={categoryId}
                    onChange={handleCategoryChange}
                    className="auth-input-field"
                    style={{ paddingLeft: '1rem' }}
                    required
                  >
                    {categories.length > 0
                      ? categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))
                      : CATEGORY_OPTIONS.map((name, idx) => (
                          <option key={name} value={idx + 1}>{name}</option>
                        ))}
                  </select>
                </div>

                <div>
                  <label className="auth-input-label">Payment Method *</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="auth-input-field"
                    style={{ paddingLeft: '1rem' }}
                    required
                  >
                    {PAYMENT_METHODS.map(pm => (
                      <option key={pm} value={pm}>{pm}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* F. NOTES (OPTIONAL) */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label className="auth-input-label" style={{ marginBottom: 0 }}>Notes (Optional)</label>
                  <span style={{ fontSize: '0.78rem', color: notes.length > 200 ? '#ef4444' : '#94a3b8' }}>
                    {notes.length} / 200
                  </span>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value.slice(0, 200))}
                  placeholder="Add any additional notes..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'none'
                  }}
                />
              </div>

              {/* G. RECEIPT UPLOAD BOX */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label className="auth-input-label">Attach Receipt (Optional)</label>

                {receiptFile ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#166534' }}>
                      <span>📄</span>
                      <span style={{ fontWeight: '600' }}>{receiptFile.name}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        ({(receiptFile.size / 1024).toFixed(0)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                      title="Remove file"
                    >
                      🗑️
                    </button>
                  </div>
                ) : (
                  <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem',
                    border: '2px dashed #cbd5e1',
                    borderRadius: '12px',
                    backgroundColor: '#f8fafc',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease'
                  }}>
                    <span style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>📁</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#334155' }}>
                      Drag & drop your receipt here or click to upload
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                      JPG, PNG or PDF (Max. 5MB)
                    </span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}

                {receiptError && (
                  <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                    {receiptError}
                  </div>
                )}
              </div>

              {/* H. FORM BUTTONS */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem' }}>
                <button
                  type="button"
                  onClick={() => navigate('/expenses')}
                  disabled={isSubmitting}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '10px',
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
                  disabled={isSubmitting}
                  className="btn-auth-primary"
                  style={{ width: 'auto', padding: '0.75rem 1.75rem' }}
                >
                  {isSubmitting ? 'Saving...' : 'Save Expense'}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: PREVIEW CARD & QUICK TIPS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 9. EXPENSE PREVIEW CARD */}
            <div className="dashboard-card" style={{ padding: '1.5rem' }}>
              <h3 className="dashboard-card-title" style={{ marginBottom: '1rem' }}>
                Expense Preview
              </h3>

              <div style={{
                backgroundColor: isIncome ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${isIncome ? '#bbf7d0' : '#fecaca'}`,
                borderRadius: '12px',
                padding: '1.25rem',
                textAlign: 'center',
                marginBottom: '1.25rem'
              }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {isIncome ? 'Income Amount' : 'Expense Amount'}
                </span>
                <div style={{
                  fontSize: '1.75rem',
                  fontWeight: '800',
                  color: isIncome ? '#16a34a' : '#dc2626',
                  marginTop: '0.2rem'
                }}>
                  {isIncome ? '+' : '-'} ₹{numericAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b' }}>Description</span>
                  <span style={{ fontWeight: '600', color: '#0f172a' }}>{description || 'Hostel Fee'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b' }}>Category</span>
                  <span style={{ fontWeight: '600', color: '#16a34a' }}>{categoryName}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b' }}>Type</span>
                  <span style={{ fontWeight: '600', color: isIncome ? '#16a34a' : '#dc2626' }}>
                    {transactionType}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b' }}>Date & Time</span>
                  <span style={{ fontWeight: '500', color: '#0f172a' }}>
                    {new Date(expenseDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} at {expenseTime}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b' }}>Payment Method</span>
                  <span style={{ fontWeight: '600', color: '#0f172a' }}>{paymentMethod}</span>
                </div>

                {notes && (
                  <div style={{ paddingTop: '0.25rem' }}>
                    <span style={{ color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Notes</span>
                    <p style={{ fontSize: '0.8rem', color: '#334155', fontStyle: 'italic' }}>"{notes}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* QUICK TIPS CARD */}
            <div className="dashboard-card" style={{ padding: '1.5rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#166534', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                💡 Quick Tips
              </h4>
              <ul style={{ fontSize: '0.85rem', color: '#15803d', paddingLeft: '1.25rem', lineHeight: '1.6' }}>
                <li>Categorize expenses accurately for better budget reports.</li>
                <li>Attach receipts to keep reliable tax and warranty records.</li>
                <li>Use recurring expense options for automated monthly bills.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddExpense;
