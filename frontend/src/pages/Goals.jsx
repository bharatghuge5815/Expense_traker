import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';

const DEFAULT_GOALS = [
  { id: 1, title: 'Emergency Fund', icon: '🛡️', targetAmount: 100000, currentSaved: 65000, targetDate: '2026-12-31' },
  { id: 2, title: 'New Laptop', icon: '💻', targetAmount: 85000, currentSaved: 52000, targetDate: '2026-10-15' },
  { id: 3, title: 'Vacation Trip', icon: '✈️', targetAmount: 50000, currentSaved: 30000, targetDate: '2026-11-20' },
  { id: 4, title: 'House Downpayment', icon: '🏠', targetAmount: 500000, currentSaved: 180000, targetDate: '2027-06-30' }
];

const EMOJI_GOAL_OPTIONS = ['🛡️', '💻', '✈️', '🏠', '🚗', '📱', '🎓', '💍', '🌴', '🚴'];

const Goals = () => {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('user_financial_goals');
    return saved ? JSON.parse(saved) : DEFAULT_GOALS;
  });

  // Add/Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [titleInput, setTitleInput] = useState('');
  const [targetInput, setTargetInput] = useState('');
  const [savedInput, setSavedInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🛡️');

  // Quick Deposit Modal State
  const [depositGoal, setDepositGoal] = useState(null);
  const [depositAmountInput, setDepositAmountInput] = useState('');

  const saveGoalsState = (updatedGoals) => {
    setGoals(updatedGoals);
    localStorage.setItem('user_financial_goals', JSON.stringify(updatedGoals));
  };

  // Calculations
  const totalTarget = goals.reduce((acc, g) => acc + Number(g.targetAmount || 0), 0);
  const totalSaved = goals.reduce((acc, g) => acc + Number(g.currentSaved || 0), 0);
  const totalRemaining = Math.max(0, totalTarget - totalSaved);
  const overallPercent = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  const handleOpenAdd = () => {
    setEditingGoal(null);
    setTitleInput('');
    setTargetInput('');
    setSavedInput('0');
    setDateInput(new Date().toISOString().split('T')[0]);
    setSelectedEmoji('🛡️');
    setShowModal(true);
  };

  const handleOpenEdit = (goal) => {
    setEditingGoal(goal);
    setTitleInput(goal.title);
    setTargetInput(goal.targetAmount.toString());
    setSavedInput(goal.currentSaved.toString());
    setDateInput(goal.targetDate || '');
    setSelectedEmoji(goal.icon || '🎯');
    setShowModal(true);
  };

  const handleSaveGoal = (e) => {
    e.preventDefault();
    const targetVal = Number(targetInput);
    const savedVal = Number(savedInput);

    if (!titleInput.trim() || isNaN(targetVal) || targetVal <= 0) {
      alert('Please enter a valid goal title and target amount.');
      return;
    }

    if (editingGoal) {
      const updated = goals.map(g => g.id === editingGoal.id ? {
        ...g,
        title: titleInput.trim(),
        targetAmount: targetVal,
        currentSaved: Math.min(targetVal, Math.max(0, savedVal)),
        targetDate: dateInput,
        icon: selectedEmoji
      } : g);
      saveGoalsState(updated);
    } else {
      const newGoal = {
        id: Date.now(),
        title: titleInput.trim(),
        targetAmount: targetVal,
        currentSaved: Math.min(targetVal, Math.max(0, savedVal)),
        targetDate: dateInput,
        icon: selectedEmoji
      };
      saveGoalsState([...goals, newGoal]);
    }

    setShowModal(false);
  };

  const handleDeleteGoal = (id) => {
    if (!window.confirm('Are you sure you want to delete this financial goal?')) return;
    const updated = goals.filter(g => g.id !== id);
    saveGoalsState(updated);
  };

  const handleSaveDeposit = (e) => {
    e.preventDefault();
    const deposit = Number(depositAmountInput);
    if (isNaN(deposit) || deposit <= 0) {
      alert('Please enter a valid deposit amount.');
      return;
    }

    const updated = goals.map(g => {
      if (g.id === depositGoal.id) {
        const newSaved = Math.min(g.targetAmount, g.currentSaved + deposit);
        return { ...g, currentSaved: newSaved };
      }
      return g;
    });

    saveGoalsState(updated);
    setDepositGoal(null);
    setDepositAmountInput('');
  };

  return (
    <div className="dashboard-layout-wrapper">
      <Sidebar />

      <main className="dashboard-main-content">
        {/* Top Header */}
        <div className="dashboard-top-header" style={{ marginBottom: '1.5rem' }}>
          <div>
            <h1 className="dashboard-greeting">Financial Goals 🎯</h1>
            <p className="dashboard-subgreeting">
              Set savings targets, track progress, and achieve your financial milestones
            </p>
          </div>

          <button className="btn-add-expense" onClick={handleOpenAdd}>
            + Add New Goal
          </button>
        </div>

        {/* Top Summary Stat Cards */}
        <div className="dashboard-grid-4" style={{ marginBottom: '1.75rem' }}>
          <div className="stat-card">
            <div className="stat-title">Total Target Amount</div>
            <div className="stat-value">₹ {totalTarget.toLocaleString('en-IN')}</div>
            <div className="stat-trend positive">{goals.length} active targets</div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Total Saved So Far</div>
            <div className="stat-value" style={{ color: '#16a34a' }}>
              ₹ {totalSaved.toLocaleString('en-IN')}
            </div>
            <div className="stat-trend positive">{overallPercent}% of total goal</div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Remaining Target</div>
            <div className="stat-value" style={{ color: '#2563eb' }}>
              ₹ {totalRemaining.toLocaleString('en-IN')}
            </div>
            <div className="stat-trend positive">Left to save</div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Overall Progress</div>
            <div className="stat-value">{overallPercent}%</div>
            <div className="stat-trend positive">Combined progress</div>
          </div>
        </div>

        {/* Add/Edit Goal Modal */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="dashboard-card" style={{ width: '100%', maxWidth: '450px', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.25rem' }}>
                {editingGoal ? 'Edit Financial Goal' : 'Create New Goal'}
              </h3>

              <form onSubmit={handleSaveGoal}>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="auth-input-label">Goal Title *</label>
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    placeholder="e.g. Emergency Fund"
                    className="auth-input-field"
                    style={{ paddingLeft: '1rem' }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                  <div>
                    <label className="auth-input-label">Target Amount (₹) *</label>
                    <input
                      type="number"
                      value={targetInput}
                      onChange={(e) => setTargetInput(e.target.value)}
                      placeholder="100000"
                      className="auth-input-field"
                      style={{ paddingLeft: '1rem' }}
                      required
                    />
                  </div>

                  <div>
                    <label className="auth-input-label">Saved So Far (₹)</label>
                    <input
                      type="number"
                      value={savedInput}
                      onChange={(e) => setSavedInput(e.target.value)}
                      placeholder="0"
                      className="auth-input-field"
                      style={{ paddingLeft: '1rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label className="auth-input-label">Target Date</label>
                  <input
                    type="date"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    className="auth-input-field"
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="auth-input-label">Select Icon</label>
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.35rem' }}>
                    {EMOJI_GOAL_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedEmoji(emoji)}
                        style={{
                          width: '36px', height: '36px', borderRadius: '8px',
                          border: selectedEmoji === emoji ? '2px solid #16a34a' : '1px solid #e2e8f0',
                          backgroundColor: selectedEmoji === emoji ? '#f0fdf4' : '#ffffff',
                          fontSize: '1.2rem', cursor: 'pointer'
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
                      padding: '0.65rem 1.1rem', borderRadius: '8px',
                      border: '1px solid #e2e8f0', backgroundColor: '#ffffff',
                      color: '#64748b', fontWeight: '600', cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-auth-primary"
                    style={{ width: 'auto', padding: '0.65rem 1.25rem' }}
                  >
                    Save Goal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Savings Deposit Modal */}
        {depositGoal && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="dashboard-card" style={{ width: '100%', maxWidth: '400px', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.4rem' }}>
                Add Savings Deposit
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                Goal: <strong style={{ color: '#16a34a' }}>{depositGoal.title}</strong>
              </p>

              <form onSubmit={handleSaveDeposit}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="auth-input-label">Deposit Amount (₹)</label>
                  <input
                    type="number"
                    value={depositAmountInput}
                    onChange={(e) => setDepositAmountInput(e.target.value)}
                    placeholder="Enter deposit amount e.g. 5000"
                    className="auth-input-field"
                    style={{ paddingLeft: '1rem', fontSize: '1.1rem', fontWeight: '700' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setDepositGoal(null)}
                    style={{
                      padding: '0.65rem 1.1rem', borderRadius: '8px',
                      border: '1px solid #e2e8f0', backgroundColor: '#ffffff',
                      color: '#64748b', fontWeight: '600', cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-auth-primary"
                    style={{ width: 'auto', padding: '0.65rem 1.25rem' }}
                  >
                    Add Deposit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Goal Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {goals.map((goal) => {
            const percent = Math.min(100, Math.round((goal.currentSaved / goal.targetAmount) * 100));
            const isAchieved = goal.currentSaved >= goal.targetAmount;
            const remaining = Math.max(0, goal.targetAmount - goal.currentSaved);

            return (
              <div key={goal.id} className="dashboard-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '12px',
                      backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.5rem'
                    }}>
                      {goal.icon || '🎯'}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>
                        {goal.title}
                      </h3>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        Target: {new Date(goal.targetDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <span style={{
                    padding: '0.25rem 0.65rem', borderRadius: '9999px',
                    fontSize: '0.75rem', fontWeight: '600',
                    backgroundColor: isAchieved ? '#dcfce7' : '#eff6ff',
                    color: isAchieved ? '#16a34a' : '#2563eb'
                  }}>
                    {isAchieved ? '🎉 Achieved' : '🎯 On Track'}
                  </span>
                </div>

                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: '#64748b' }}>Progress</span>
                    <span style={{ fontWeight: '700', color: '#0f172a' }}>
                      ₹{goal.currentSaved.toLocaleString('en-IN')} / ₹{goal.targetAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div style={{
                    height: '10px', width: '100%', backgroundColor: '#f1f5f9',
                    borderRadius: '9999px', overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%', width: `${percent}%`,
                      backgroundColor: isAchieved ? '#16a34a' : '#3b82f6',
                      borderRadius: '9999px', transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.85rem' }}>
                  <span style={{ fontSize: '0.825rem', fontWeight: '600', color: '#475569' }}>
                    {percent}% completed ({remaining > 0 ? `₹${remaining.toLocaleString('en-IN')} left` : 'Fully funded'})
                  </span>

                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      onClick={() => setDepositGoal(goal)}
                      style={{
                        padding: '0.35rem 0.65rem', borderRadius: '6px',
                        border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4',
                        color: '#16a34a', fontWeight: '600', fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      + Deposit
                    </button>
                    <button
                      onClick={() => handleOpenEdit(goal)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
                      title="Edit goal"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
                      title="Delete goal"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Goals;
