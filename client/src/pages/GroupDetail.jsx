import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AddExpenseModal from '../components/AddExpenseModal';
import { io } from 'socket.io-client';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const GroupDetail = () => {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [optimizedSettlements, setOptimizedSettlements] = useState([]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [settlingId, setSettlingId] = useState(null);

  // Fix P1: Extract fetchGroupData into a reusable callback
  const fetchGroupData = useCallback(async () => {
    try {
      const [groupRes, settlementsRes] = await Promise.all([
        axios.get(`${API}/api/groups/${id}`),
        axios.get(`${API}/api/settlements/group/${id}`)
      ]);

      setGroup(groupRes.data.group);
      setExpenses(groupRes.data.expenses);
      setSettlements(groupRes.data.settlements);
      setOptimizedSettlements(settlementsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchGroupData();

    // Fix P1: Pass auth token in socket handshake
    const newSocket = io(API, {
      auth: { token },
    });
    newSocket.emit('joinGroup', id);

    newSocket.on('newExpense', (newExpense) => {
      setExpenses((prev) => {
        // Prevent duplicates
        if (prev.some(e => e._id === newExpense._id)) return prev;
        return [newExpense, ...prev];
      });
    });

    newSocket.on('newSettlement', () => {
      // Re-fetch from server for accurate data rather than patching state manually
      fetchGroupData();
    });

    return () => {
      newSocket.disconnect();
    };
  }, [id, fetchGroupData, token]);

  const handleSettleUp = async (settlement) => {
    setSettlingId(settlement.receiver);
    try {
      await axios.post(`${API}/api/settlements`, {
        receiver: settlement.receiver,
        amount: settlement.amount,
        group: id
      });
      // Fix P1: Don't reload page — re-fetch data properly
      await fetchGroupData();
    } catch (err) {
      alert(err.response?.data?.message || 'Settlement failed');
      console.error(err);
    } finally {
      setSettlingId(null);
    }
  };

  // Fix P1: Called when AddExpenseModal succeeds — re-fetch group data
  const handleExpenseAdded = async () => {
    await fetchGroupData();
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-on-surface-variant text-sm">Loading group...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!group) {
    return (
      <MainLayout>
        <div className="p-8">
          <p className="text-error">Group not found or you are not a member.</p>
          <Link to="/groups" className="text-primary hover:underline mt-4 block">← Back to Groups</Link>
        </div>
      </MainLayout>
    );
  }

  const userId = user?.id || user?._id?.toString();

  // Fix P1: Normalize all IDs to string for comparison
  let netBalance = 0;
  expenses.forEach(expense => {
    const paidById = expense.paidBy?._id?.toString() || expense.paidBy?.toString();
    if (paidById === userId) {
      netBalance += expense.amount;
    }
    expense.splits?.forEach(split => {
      const splitUserId = split.user?._id?.toString() || split.user?.toString();
      if (splitUserId === userId) {
        netBalance -= split.amount;
      }
    });
  });

  // Apply settlements to net balance
  settlements.forEach(settlement => {
    const payerId = settlement.payer?._id?.toString() || settlement.payer?.toString();
    const receiverId = settlement.receiver?._id?.toString() || settlement.receiver?.toString();
    if (payerId === userId) netBalance += settlement.amount;
    if (receiverId === userId) netBalance -= settlement.amount;
  });

  const totalGroupExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Build per-member balance map for Balances tab
  const memberBalances = {};
  group.members.forEach(m => {
    memberBalances[m._id.toString()] = { name: m.name, balance: 0 };
  });
  expenses.forEach(expense => {
    const paidById = expense.paidBy?._id?.toString() || expense.paidBy?.toString();
    if (memberBalances[paidById] !== undefined) {
      memberBalances[paidById].balance += expense.amount;
    }
    expense.splits?.forEach(split => {
      const splitUserId = split.user?._id?.toString() || split.user?.toString();
      if (memberBalances[splitUserId] !== undefined) {
        memberBalances[splitUserId].balance -= split.amount;
      }
    });
  });
  settlements.forEach(s => {
    const payerId = s.payer?._id?.toString() || s.payer?.toString();
    const receiverId = s.receiver?._id?.toString() || s.receiver?.toString();
    if (memberBalances[payerId]) memberBalances[payerId].balance += s.amount;
    if (memberBalances[receiverId]) memberBalances[receiverId].balance -= s.amount;
  });

  return (
    <MainLayout>
      <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-32 md:pb-12 pt-8">

        {/* Group Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-surface-container-high rounded-full font-label-sm text-on-surface-variant border border-white/5 uppercase tracking-widest text-[10px]">
                Active
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">{group.name}</h1>
            <div className="flex items-center">
              <div className="flex -space-x-3">
                {group.members.map((member, i) => (
                  <div
                    key={member._id}
                    className="w-10 h-10 rounded-full border-2 border-background bg-surface-container-highest flex items-center justify-center text-xs overflow-hidden font-bold"
                    style={{ zIndex: 10 - i }}
                    title={member.name}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                ))}
              </div>
              <span className="ml-4 font-body-md text-on-surface-variant text-sm">{group.members.length} Members</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              className="px-6 py-3 rounded-xl bg-primary-container text-on-primary-container text-black font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
              onClick={() => setIsExpenseModalOpen(true)}
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add Expense
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/10 mb-8 overflow-x-auto">
          <nav className="flex gap-8 min-w-max pb-px">
            {['Overview', 'Expenses', 'Balances', 'Settlements'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm pb-4 transition-colors ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Your Net Balance */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h2 className="text-base font-semibold text-on-surface mb-1">Your Net Balance</h2>
              <p className="text-on-surface-variant text-sm mb-5">Across all expenses in this group</p>
              <div className={`text-4xl font-bold mb-6 ${netBalance >= 0 ? 'text-primary' : 'text-error'}`}>
                {netBalance >= 0 ? '+' : '-'}₹{Math.abs(netBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>

              {/* Optimized settlements involving the current user */}
              <div className="space-y-3">
                {optimizedSettlements.filter(s => s.payer === userId || s.receiver === userId).map((s, idx) => {
                  const isPayer = s.payer === userId;
                  return (
                    <div key={idx} className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-white/5">
                      <div>
                        <p className="text-sm text-on-surface">
                          {isPayer ? `Pay ${s.receiverName}` : `${s.payerName} pays you`}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-bold text-sm ${isPayer ? 'text-error' : 'text-primary'}`}>
                          ₹{s.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        {isPayer && (
                          <button
                            onClick={() => handleSettleUp(s)}
                            disabled={settlingId === s.receiver}
                            className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-xs font-medium hover:bg-primary/30 transition-colors disabled:opacity-50"
                          >
                            {settlingId === s.receiver ? '...' : 'Pay'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {optimizedSettlements.filter(s => s.payer === userId || s.receiver === userId).length === 0 && (
                  <p className="text-sm text-on-surface-variant text-center py-2">✅ All settled up!</p>
                )}
              </div>
            </div>

            {/* Group Spending Summary */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h3 className="text-base font-semibold text-on-surface mb-5">Group Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Total Group Expense</span>
                  <span className="font-bold text-on-surface">₹{totalGroupExpense.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Total Members</span>
                  <span className="font-bold text-on-surface">{group.members.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Total Expenses</span>
                  <span className="font-bold text-on-surface">{expenses.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Settlements</span>
                  <span className="font-bold text-on-surface">{settlements.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-white/10 flex flex-col min-h-[500px]">

            {/* Overview / Expenses Tab */}
            {(activeTab === 'Overview' || activeTab === 'Expenses') && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-on-surface">Expenses</h2>
                  <span className="text-xs text-on-surface-variant">{expenses.length} total</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1">
                  {expenses.length === 0 ? (
                    <div className="py-12 flex flex-col items-center gap-3 text-center">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant">receipt_long</span>
                      <p className="text-on-surface-variant">No expenses in this group yet.</p>
                      <button onClick={() => setIsExpenseModalOpen(true)} className="text-primary text-sm hover:underline">
                        Add the first expense
                      </button>
                    </div>
                  ) : (
                    expenses.map(expense => {
                      const paidById = expense.paidBy?._id?.toString();
                      const isPaidByMe = paidById === userId;
                      const mySplit = expense.splits?.find(s => {
                        const splitUserId = s.user?._id?.toString() || s.user?.toString();
                        return splitUserId === userId;
                      });
                      const myShare = mySplit ? mySplit.amount : 0;

                      let statusText = '';
                      let statusColor = '';
                      if (isPaidByMe && myShare < expense.amount) {
                        statusText = `You lent ₹${(expense.amount - myShare).toFixed(2)}`;
                        statusColor = 'text-primary';
                      } else if (!isPaidByMe && myShare > 0) {
                        statusText = `You owe ₹${myShare.toFixed(2)}`;
                        statusColor = 'text-error';
                      } else if (isPaidByMe) {
                        statusText = 'You paid for yourself';
                        statusColor = 'text-on-surface-variant';
                      } else {
                        statusText = 'Not involved';
                        statusColor = 'text-on-surface-variant';
                      }

                      return (
                        <div key={expense._id} className="flex items-center justify-between p-4 hover:bg-surface-container-low rounded-xl transition-colors border border-transparent hover:border-white/5">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center border border-white/5">
                              <span className="material-symbols-outlined text-primary text-[18px]">receipt_long</span>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-on-surface mb-0.5">{expense.description}</h4>
                              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                                <span>Paid by {isPaidByMe ? 'You' : expense.paidBy?.name}</span>
                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                <span>{new Date(expense.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-on-surface">₹{expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            <div className={`text-xs mt-0.5 ${statusColor}`}>{statusText}</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}

            {/* Balances Tab — Fix P1: was just placeholder text */}
            {activeTab === 'Balances' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-on-surface">Member Balances</h2>
                </div>
                <div className="flex-1 space-y-3">
                  {Object.entries(memberBalances).map(([memberId, { name, balance }]) => {
                    const roundedBalance = Math.round(balance * 100) / 100;
                    const isMe = memberId === userId;
                    return (
                      <div key={memberId} className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-sm border border-white/10">
                            {name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-on-surface">{isMe ? `${name} (You)` : name}</p>
                            <p className="text-xs text-on-surface-variant">
                              {roundedBalance > 0 ? 'Is owed' : roundedBalance < 0 ? 'Owes' : 'Settled up'}
                            </p>
                          </div>
                        </div>
                        <div className={`text-lg font-bold ${roundedBalance > 0 ? 'text-primary' : roundedBalance < 0 ? 'text-error' : 'text-on-surface-variant'}`}>
                          {roundedBalance > 0 ? '+' : ''}₹{Math.abs(roundedBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Settlements Tab */}
            {activeTab === 'Settlements' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-on-surface">Completed Settlements</h2>
                </div>
                <div className="flex-1 space-y-2">
                  {settlements.length === 0 ? (
                    <div className="py-12 flex flex-col items-center gap-3 text-center">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant">payments</span>
                      <p className="text-on-surface-variant">No settlements yet.</p>
                    </div>
                  ) : (
                    settlements.map(settlement => (
                      <div key={settlement._id} className="flex items-center justify-between p-4 hover:bg-surface-container-low rounded-xl border border-transparent hover:border-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-[18px]">payments</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-on-surface">
                              <span className="text-primary">{settlement.payer?.name}</span>
                              {' '}paid{' '}
                              <span className="text-on-surface">{settlement.receiver?.name}</span>
                            </h4>
                            <p className="text-xs text-on-surface-variant">{new Date(settlement.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="font-bold text-primary">
                          ₹{settlement.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onExpenseAdded={handleExpenseAdded}
        groupId={id}
      />
    </MainLayout>
  );
};

export default GroupDetail;
