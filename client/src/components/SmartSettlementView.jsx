import React, { useMemo, useState } from 'react';

const SmartSettlementView = ({ group, optimizedSettlements, userId, onSettleUp, settlingId, onSendReminder }) => {
  const [remindedStatus, setRemindedStatus] = useState({});

  const handleSendReminderClick = async (s) => {
    if (!onSendReminder) return;
    const key = `${s.payer}-${s.receiver}`;
    setRemindedStatus(prev => ({ ...prev, [key]: 'sending' }));
    try {
      await onSendReminder(s);
      setRemindedStatus(prev => ({ ...prev, [key]: 'sent' }));
      setTimeout(() => {
        setRemindedStatus(prev => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      }, 3000);
    } catch (err) {
      setRemindedStatus(prev => ({ ...prev, [key]: 'error' }));
      setTimeout(() => {
        setRemindedStatus(prev => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      }, 3000);
    }
  };

  // Filter relevant settlements
  const mySettlements = optimizedSettlements.filter(s => s.payer === userId || s.receiver === userId);
  
  // Calculate node positions on a circle
  const nodes = useMemo(() => {
    if (!group || !group.members) return [];
    const members = group.members;
    const n = members.length;
    return members.map((member, i) => {
      // offset by -PI/2 to start at the top
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
      return {
        id: member._id.toString(),
        name: member.name,
        isMe: member._id.toString() === userId,
        cx: 400 + 220 * Math.cos(angle),
        cy: 300 + 220 * Math.sin(angle),
        initials: member.name.charAt(0).toUpperCase()
      };
    });
  }, [group, userId]);

  const nodeMap = useMemo(() => {
    const map = {};
    nodes.forEach(n => map[n.id] = n);
    return map;
  }, [nodes]);

  // Edges
  const edges = useMemo(() => {
    return optimizedSettlements.map((s, idx) => {
      const payerNode = nodeMap[s.payer];
      const receiverNode = nodeMap[s.receiver];
      if (!payerNode || !receiverNode) return null;

      const dx = receiverNode.cx - payerNode.cx;
      const dy = receiverNode.cy - payerNode.cy;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      const nodeRadius = 45; // radius + padding for arrowhead
      
      // Calculate intersection with node boundaries
      const startX = payerNode.cx + (dx / dist) * nodeRadius;
      const startY = payerNode.cy + (dy / dist) * nodeRadius;
      const endX = receiverNode.cx - (dx / dist) * nodeRadius;
      const endY = receiverNode.cy - (dy / dist) * nodeRadius;

      // Draw curved line (Quadratic Bezier) slightly offset towards center
      const midX = (payerNode.cx + receiverNode.cx) / 2;
      const midY = (payerNode.cy + receiverNode.cy) / 2;
      
      // Control point is pulled towards center (400,300)
      const qx = midX + (400 - midX) * 0.3; 
      const qy = midY + (300 - midY) * 0.3;
      
      // Calculate actual midpoint of quadratic bezier curve for label placement
      const curveMidX = 0.25 * startX + 0.5 * qx + 0.25 * endX;
      const curveMidY = 0.25 * startY + 0.5 * qy + 0.25 * endY;
      
      const pathData = `M ${startX} ${startY} Q ${qx} ${qy} ${endX} ${endY}`;
      
      const isMyEdge = s.payer === userId || s.receiver === userId;
      
      return {
        id: `edge-${idx}`,
        path: pathData,
        payer: payerNode,
        receiver: receiverNode,
        amount: s.amount,
        isMyEdge,
        midX: curveMidX, 
        midY: curveMidY,
        startX, startY, endX, endY
      };
    }).filter(Boolean);
  }, [optimizedSettlements, nodeMap, userId]);

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full animate-in fade-in duration-500">
      {/* Left: Network Graph */}
      <div className="flex-1 bg-[#12131a] border border-white/5 rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col min-h-[500px] shadow-2xl">
        {/* Header */}
        <div className="mb-4 z-10 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary">account_tree</span>
              <h2 className="text-2xl font-bold text-white tracking-wide font-display-lg">Network Optimization</h2>
            </div>
            <p className="text-on-surface-variant text-sm">Smart algorithm running continuously to minimize transaction volume.</p>
          </div>
          <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2 shrink-0 self-start">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#00f5a0]" />
            <span className="text-xs text-primary font-bold tracking-wider uppercase">Optimization Active</span>
          </div>
        </div>

        {/* Graph Container */}
        <div className="flex-1 w-full relative min-h-[400px] flex items-center justify-center">
          {/* SVG Layer */}
          <svg viewBox="0 0 800 600" className="absolute inset-0 w-full h-full preserve-3d overflow-visible pointer-events-none" style={{ zIndex: 0 }}>
            <defs>
              {edges.map(edge => (
                <linearGradient 
                  key={`grad-${edge.id}`} 
                  id={`grad-${edge.id}`} 
                  x1={edge.startX} 
                  y1={edge.startY} 
                  x2={edge.endX} 
                  y2={edge.endY} 
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#ff5252" stopOpacity={edge.isMyEdge ? "0.8" : "0.3"} /> {/* Red for Payer (Owes) */}
                  <stop offset="100%" stopColor="#00f5a0" stopOpacity={edge.isMyEdge ? "0.8" : "0.3"} /> {/* Green for Receiver (Gets) */}
                </linearGradient>
              ))}
            </defs>

            {edges.map(edge => (
              <g key={edge.id}>
                {/* Background dashed line */}
                <path 
                  d={edge.path} 
                  fill="none" 
                  stroke={`url(#grad-${edge.id})`} 
                  strokeWidth="2" 
                  strokeDasharray="6 6"
                  opacity={edge.isMyEdge ? "0.5" : "0.2"}
                />
                
                {/* Foreground animated line */}
                {edge.isMyEdge && (
                  <path 
                    d={edge.path} 
                    fill="none" 
                    stroke={`url(#grad-${edge.id})`}
                    strokeWidth="3"
                    className="dash-animate"
                    strokeDasharray="10 20"
                  />
                )}
                
                {/* Amount Label Background */}
                <rect 
                  x={edge.midX - 45} 
                  y={edge.midY - 15} 
                  width="90" 
                  height="30" 
                  rx="15" 
                  fill="#12131a" 
                  stroke={edge.isMyEdge ? "#00f5a0" : "rgba(255,255,255,0.15)"}
                />
                {/* Amount Label */}
                <text 
                  x={edge.midX} 
                  y={edge.midY + 4} 
                  textAnchor="middle" 
                  fill={edge.isMyEdge ? "#00f5a0" : "rgba(255,255,255,0.6)"} 
                  fontSize="12" 
                  fontWeight="bold"
                >
                  ₹{edge.amount.toLocaleString()}
                </text>
                
              </g>
            ))}
          </svg>

          {/* HTML Nodes overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
            <div className="relative w-full h-full max-w-[800px] max-h-[600px] mx-auto">
              {nodes.map(node => (
                <div 
                  key={node.id} 
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 pointer-events-auto transition-transform hover:scale-110`}
                  style={{ left: `${(node.cx / 800) * 100}%`, top: `${(node.cy / 600) * 100}%` }}
                >
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center font-display-lg text-xl md:text-2xl font-bold shadow-2xl ${
                    node.isMe 
                      ? 'bg-[#12131a] border-2 border-primary text-white shadow-[0_0_30px_rgba(0,245,160,0.2)]' 
                      : 'bg-surface-container border border-white/10 text-on-surface'
                  }`}>
                    {node.initials}
                  </div>
                  <span className={`text-xs md:text-sm font-medium tracking-wide ${node.isMe ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {node.isMe ? 'You' : node.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer text */}
        <div className="text-center mt-6 z-10 hidden md:block">
          <p className="text-xs text-on-surface-variant/70 tracking-widest uppercase">Smart Settlement algorithms run continuously to minimize transaction volume.</p>
        </div>
      </div>

      {/* Right: To Settle Panel */}
      <div className="w-full xl:w-[350px] shrink-0 bg-[#12131a] border border-white/5 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-container/30">
          <h3 className="text-xl font-bold text-white font-display-lg">To Settle</h3>
          {mySettlements.length > 0 && (
            <span className="px-3 py-1 bg-error/10 text-error text-[10px] uppercase tracking-wider rounded-full border border-error/20 font-bold">Action Required</span>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {mySettlements.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center gap-3 text-center opacity-50 py-20">
              <span className="material-symbols-outlined text-5xl">task_alt</span>
              <p className="text-sm font-medium">You're all settled up!</p>
            </div>
          ) : (
            mySettlements.map((s, idx) => {
              const isPayer = s.payer === userId;
              
              return (
                <div key={idx} className="bg-surface-container-low border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-white/10 transition-colors">
                  {/* Decorative glow */}
                  <div className={`absolute -top-10 -right-10 w-32 h-32 blur-[40px] opacity-[0.15] rounded-full pointer-events-none transition-opacity group-hover:opacity-30 ${isPayer ? 'bg-error' : 'bg-primary'}`} />
                  
                  <div className="flex items-center gap-4 mb-5 relative z-10">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border ${
                      isPayer ? 'bg-error/5 text-error border-error/10' : 'bg-primary/5 text-primary border-primary/10'
                    }`}>
                      {isPayer ? s.receiverName.charAt(0).toUpperCase() : s.payerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs text-on-surface-variant font-medium tracking-wide">
                        {isPayer ? `You owe ${s.receiverName}` : `${s.payerName} owes you`}
                      </p>
                      <p className={`text-2xl font-bold mt-1 ${isPayer ? 'text-white' : 'text-primary'}`}>
                        ₹{s.amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    {isPayer ? (
                      <button 
                        onClick={() => onSettleUp(s)}
                        disabled={settlingId === s.receiver}
                        className="w-full py-3 rounded-xl bg-primary text-black font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        {settlingId === s.receiver ? (
                          <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[18px]">check_circle</span>
                            Mark as Settled
                          </>
                        )}
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleSendReminderClick(s)}
                        disabled={remindedStatus[`${s.payer}-${s.receiver}`] === 'sending'}
                        className={`w-full py-3 rounded-xl font-semibold transition-colors border flex items-center justify-center gap-2
                          ${remindedStatus[`${s.payer}-${s.receiver}`] === 'sent' 
                            ? 'bg-primary/20 text-primary border-primary/20' 
                            : remindedStatus[`${s.payer}-${s.receiver}`] === 'error'
                            ? 'bg-error/20 text-error border-error/20'
                            : 'bg-surface-container-highest text-on-surface hover:bg-surface-variant border-white/5'
                          }`}
                      >
                        {remindedStatus[`${s.payer}-${s.receiver}`] === 'sending' ? (
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : remindedStatus[`${s.payer}-${s.receiver}`] === 'sent' ? (
                          <>
                            <span className="material-symbols-outlined text-[18px]">done</span>
                            Reminder Sent
                          </>
                        ) : remindedStatus[`${s.payer}-${s.receiver}`] === 'error' ? (
                          <>
                            <span className="material-symbols-outlined text-[18px]">error</span>
                            Failed
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[18px]">notifications</span>
                            Send Reminder
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartSettlementView;
