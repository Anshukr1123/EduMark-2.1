
import React, { useState } from 'react';
import { User, FeeRecord } from '../../../types';
import { Card, Button, Badge, Modal } from '../../../components/UIComponents';
import { CreditCard, Smartphone, CheckCircle2, History, AlertTriangle, Download, Wallet, ArrowRight, Receipt, FileText, ChevronRight, PieChart as PieChartIcon, TrendingUp, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
// @ts-ignore
import { jsPDF } from 'jspdf';

interface Props { user: User; fees: FeeRecord[]; setFees: React.Dispatch<React.SetStateAction<FeeRecord[]>>; }

const StudentFees: React.FC<Props> = ({ user, fees, setFees }) => {
  const [activeTab, setActiveTab] = useState<'PENDING' | 'HISTORY'>('PENDING');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null);
  const [viewingFee, setViewingFee] = useState<FeeRecord | null>(null);
  
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'UPI'>('CARD');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const pendingFees = fees.filter(f => f.status === 'PENDING' || f.status === 'OVERDUE');
  const paidFees = fees.filter(f => f.status === 'PAID');
  const pendingAmount = pendingFees.reduce((acc, curr) => acc + curr.amount, 0);
  
  const totalFees = fees.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPaid = paidFees.reduce((acc, curr) => acc + curr.amount, 0);
  const progressPercentage = totalFees > 0 ? (totalPaid / totalFees) * 100 : 0;

  // Chart Data Preparation
  const historyChartData = paidFees.map(fee => ({
      name: fee.title,
      amount: fee.amount,
      date: fee.datePaid ? new Date(fee.datePaid).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handlePayFee = () => {
    if (!selectedFee) return;
    setIsProcessingPayment(true);
    // Simulate API delay
    setTimeout(() => {
       setFees(prev => prev.map(f => f.id === selectedFee.id ? { ...f, status: 'PAID', datePaid: new Date().toISOString().split('T')[0] } : f));
       setIsProcessingPayment(false);
       setPaymentSuccess(true);
       setTimeout(() => { 
           setPaymentSuccess(false); 
           setIsPaymentModalOpen(false); 
           setSelectedFee(null); 
           setActiveTab('HISTORY'); // Switch to history tab to show the new payment
       }, 2000);
    }, 2000);
  };

  const handleDownloadReceipt = (fee: FeeRecord) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(67, 56, 202); // Indigo 700
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("EduMark Institute", 105, 25, { align: "center" });
    
    // Receipt Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text("Fee Payment Receipt", 105, 60, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`Receipt No: #TXN-${fee.id}98X`, 20, 80);
    doc.text(`Date: ${fee.datePaid || new Date().toISOString().split('T')[0]}`, 150, 80);
    
    // Student Info
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 85, 190, 85);
    
    doc.text(`Student Name:`, 20, 100);
    doc.setFont(undefined, 'bold');
    doc.text(user.name, 60, 100);
    doc.setFont(undefined, 'normal');
    
    doc.text(`Student ID:`, 20, 110);
    doc.setFont(undefined, 'bold');
    doc.text(user.id.toUpperCase(), 60, 110);
    doc.setFont(undefined, 'normal');

    // Payment Info
    doc.line(20, 120, 190, 120);
    
    doc.text(`Description:`, 20, 135);
    doc.text(fee.title, 60, 135);
    
    doc.text(`Payment Mode:`, 20, 145);
    doc.text("Online / Digital", 60, 145);
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`Total Amount:`, 120, 160);
    doc.text(`Rs. ${fee.amount.toLocaleString()}`, 160, 160);
    
    // Footer
    doc.setFontSize(10);
    doc.setFont(undefined, 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text("This is a computer generated receipt.", 105, 200, { align: "center" });
    
    doc.save(`Receipt_${fee.title.replace(/\s+/g, '_')}.pdf`);
  };

  return (
      <div className="space-y-6 animate-in fade-in duration-500">
         {/* Summary Cards */}
         <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-900 text-white border-none relative overflow-hidden flex flex-col justify-between min-h-[180px] md:col-span-2">
               <div className="relative z-10 flex-1">
                   <div className="flex justify-between items-start">
                       <div>
                           <h3 className="text-slate-400 font-medium flex items-center gap-2 mb-1 text-sm uppercase tracking-wider">
                               <Wallet className="w-4 h-4 text-emerald-400"/> Financial Overview
                           </h3>
                           <div className="flex items-baseline gap-2 mt-2">
                               <span className="text-4xl font-bold">₹{pendingAmount.toLocaleString()}</span>
                               <span className="text-slate-400 text-sm">Outstanding</span>
                           </div>
                       </div>
                       <div className="text-right">
                           <p className="text-xs text-slate-400">Total Fees (Annual)</p>
                           <p className="text-lg font-bold">₹{totalFees.toLocaleString()}</p>
                       </div>
                   </div>
                   
                   {pendingAmount > 0 ? (
                       <p className="text-xs text-amber-400 mt-2 font-medium flex items-center bg-amber-500/10 w-fit px-2 py-1 rounded border border-amber-500/20">
                           <AlertTriangle className="w-3 h-3 mr-1.5"/> Due by Oct 30, 2023
                       </p>
                   ) : (
                       <p className="text-xs text-emerald-400 mt-2 font-medium flex items-center bg-emerald-500/10 w-fit px-2 py-1 rounded border border-emerald-500/20">
                           <CheckCircle2 className="w-3 h-3 mr-1.5"/> All dues cleared
                       </p>
                   )}
               </div>

               {/* Progress Bar */}
               <div className="relative z-10 w-full mt-6 pt-4 border-t border-slate-700/50">
                   <div className="flex justify-between text-xs text-slate-300 mb-2 font-medium">
                       <span className="flex items-center gap-1"><DollarSign className="w-3 h-3 text-emerald-400"/> Fee Payment Progress</span>
                       <span className="text-emerald-400 font-bold">{Math.round(progressPercentage)}% Paid</span>
                   </div>
                   <div className="w-full h-4 bg-slate-800/50 rounded-full p-0.5 border border-slate-700 shadow-inner">
                       <div 
                           className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(16,185,129,0.4)] relative" 
                           style={{width: `${progressPercentage}%`}}
                       >
                           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                       </div>
                   </div>
                   <div className="flex justify-between text-[10px] mt-2 font-medium text-slate-400">
                       <div className="flex flex-col">
                           <span>Total Paid</span>
                           <span className="text-white">₹{totalPaid.toLocaleString()}</span>
                       </div>
                       <div className="flex flex-col text-right">
                           <span>Remaining Balance</span>
                           <span className="text-white">₹{(totalFees - totalPaid).toLocaleString()}</span>
                       </div>
                   </div>
               </div>

               <div className="absolute right-[-20px] bottom-[-40px] opacity-5 rotate-[-15deg] pointer-events-none">
                    <PieChartIcon className="w-64 h-64 text-white" />
               </div>
            </Card>
            
             <Card title="Quick Actions" className="flex flex-col justify-between bg-white">
                 <div className="grid grid-cols-1 gap-3 h-full pt-2">
                     <button 
                        onClick={() => setActiveTab('HISTORY')}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group text-left"
                     >
                         <div className="flex items-center gap-3">
                             <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                <History className="w-5 h-5 text-slate-600 group-hover:text-indigo-600"/>
                             </div>
                             <div>
                                <span className="block text-sm font-bold text-slate-700 group-hover:text-indigo-800">View History</span>
                                <span className="text-[10px] text-slate-500">Past transactions</span>
                             </div>
                         </div>
                         <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
                     </button>
                     
                     <button 
                        onClick={() => { setActiveTab('HISTORY'); setTimeout(() => alert("Statement downloaded"), 500); }}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group text-left"
                     >
                         <div className="flex items-center gap-3">
                             <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                <FileText className="w-5 h-5 text-slate-600 group-hover:text-indigo-600"/>
                             </div>
                             <div>
                                <span className="block text-sm font-bold text-slate-700 group-hover:text-indigo-800">Download Statement</span>
                                <span className="text-[10px] text-slate-500">Financial year 2023-24</span>
                             </div>
                         </div>
                         <Download className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
                     </button>
                 </div>
            </Card>
         </div>

         {/* Navigation Tabs */}
         <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-2 pt-2">
             <button
                 className={`px-6 py-3 text-sm font-bold transition-all relative rounded-t-lg ${activeTab === 'PENDING' ? 'text-indigo-600 bg-indigo-50/50 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                 onClick={() => setActiveTab('PENDING')}
             >
                 Due Fees
                 {pendingFees.length > 0 && <span className="ml-2 bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full text-[10px] border border-amber-200">{pendingFees.length}</span>}
             </button>
             <button
                 className={`px-6 py-3 text-sm font-bold transition-all relative rounded-t-lg ${activeTab === 'HISTORY' ? 'text-indigo-600 bg-indigo-50/50 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                 onClick={() => setActiveTab('HISTORY')}
             >
                 Payment History
             </button>
         </div>

         {/* Content Area */}
         <div className="min-h-[300px]">
            {activeTab === 'PENDING' ? (
                <Card className="border-t-0 rounded-tl-none rounded-tr-none shadow-sm rounded-xl">
                   {pendingFees.length > 0 ? (
                       <div className="overflow-x-auto">
                           <table className="w-full text-sm text-left">
                              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                                  <tr>
                                      <th className="px-6 py-4 font-semibold">Description</th>
                                      <th className="px-6 py-4 font-semibold">Due Date</th>
                                      <th className="px-6 py-4 font-semibold">Breakdown</th>
                                      <th className="px-6 py-4 font-semibold">Amount</th>
                                      <th className="px-6 py-4 text-center font-semibold">Status</th>
                                      <th className="px-6 py-4 text-right font-semibold">Action</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                 {pendingFees.map(fee => (
                                    <tr key={fee.id} className="hover:bg-slate-50 transition-colors group">
                                       <td className="px-6 py-4">
                                           <div className="font-bold text-slate-900">{fee.title}</div>
                                           <div className="text-xs text-slate-500">ID: {fee.id.toUpperCase()}</div>
                                       </td>
                                       <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                                           {fee.dueDate}
                                           {fee.status === 'OVERDUE' && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">LATE</span>}
                                       </td>
                                       <td className="px-6 py-4 text-xs text-slate-500">
                                           Base: ₹{(fee.amount * 0.9).toFixed(0)} <br/>
                                           Tax: ₹{(fee.amount * 0.1).toFixed(0)}
                                       </td>
                                       <td className="px-6 py-4 font-bold text-slate-900">₹{fee.amount.toLocaleString()}</td>
                                       <td className="px-6 py-4 text-center"><Badge variant={fee.status === 'OVERDUE' ? 'error' : 'warning'}>{fee.status}</Badge></td>
                                       <td className="px-6 py-4 text-right">
                                           <Button 
                                               size="sm" 
                                               className="shadow-sm hover:shadow-md transition-all"
                                               onClick={() => { setSelectedFee(fee); setIsPaymentModalOpen(true); setPaymentSuccess(false); }}
                                           >
                                               Pay Now <ArrowRight className="w-3 h-3 ml-1"/>
                                           </Button>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                       </div>
                   ) : (
                       <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                           <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 border border-green-100">
                               <CheckCircle2 className="w-8 h-8 text-green-500" />
                           </div>
                           <h3 className="text-lg font-bold text-slate-900">All caught up!</h3>
                           <p className="text-sm mt-1">You have no outstanding dues.</p>
                       </div>
                   )}
                </Card>
            ) : (
                <div className="space-y-6">
                    {/* Payment Analytics Section */}
                    {paidFees.length > 0 && (
                        <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
                            <Card className="md:col-span-2" title="Payment Analytics">
                                <div className="h-64 w-full mt-2">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={historyChartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9"/>
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="date" type="category" tick={{fontSize: 12, fill: '#64748b'}} width={60} axisLine={false} tickLine={false} />
                                            <Tooltip 
                                                cursor={{fill: '#f8fafc'}}
                                                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Paid Amount']}
                                            />
                                            <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={20} fill="#4f46e5">
                                                {historyChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#6366f1'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 flex flex-col justify-center items-center text-center p-6">
                                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-green-600">
                                    <TrendingUp className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-black text-green-700">₹{totalPaid.toLocaleString()}</h3>
                                <p className="text-sm text-green-600 font-medium mt-1">Total Paid This Year</p>
                                <div className="mt-4 text-xs text-green-600/80 bg-white/50 px-3 py-1 rounded-full">
                                    {paidFees.length} Transactions Completed
                                </div>
                            </Card>
                        </div>
                    )}

                    <Card className="border-t-0 rounded-tl-none rounded-tr-none shadow-sm rounded-xl">
                        {paidFees.length > 0 ? (
                           <div className="overflow-x-auto">
                               <table className="w-full text-sm text-left">
                                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                                      <tr>
                                          <th className="px-6 py-4 font-semibold">Transaction ID</th>
                                          <th className="px-6 py-4 font-semibold">Description</th>
                                          <th className="px-6 py-4 font-semibold">Payment Date</th>
                                          <th className="px-6 py-4 font-semibold">Breakdown</th>
                                          <th className="px-6 py-4 font-semibold">Method</th>
                                          <th className="px-6 py-4 font-semibold">Amount</th>
                                          <th className="px-6 py-4 text-center font-semibold">Status</th>
                                          <th className="px-6 py-4 text-right font-semibold">Action</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                     {paidFees.map(fee => (
                                        <tr key={fee.id} className="hover:bg-slate-50 transition-colors">
                                           <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                               TXN-{fee.id}98X
                                           </td>
                                           <td className="px-6 py-4">
                                               <div className="font-bold text-slate-900">{fee.title}</div>
                                           </td>
                                           <td className="px-6 py-4 text-slate-600">{fee.datePaid}</td>
                                           <td className="px-6 py-4 text-xs text-slate-500">
                                               Base: ₹{(fee.amount * 0.9).toFixed(0)} <br/>
                                               Tax: ₹{(fee.amount * 0.1).toFixed(0)}
                                           </td>
                                           <td className="px-6 py-4 text-slate-500 text-xs">Online</td>
                                           <td className="px-6 py-4 font-bold text-slate-900">₹{fee.amount.toLocaleString()}</td>
                                           <td className="px-6 py-4 text-center"><Badge variant="success">PAID</Badge></td>
                                           <td className="px-6 py-4 text-right">
                                               <Button size="sm" variant="outline" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50" onClick={() => { setViewingFee(fee); setIsDetailsModalOpen(true); }}>
                                                   <Receipt className="w-3 h-3 mr-1"/> Details
                                               </Button>
                                           </td>
                                        </tr>
                                     ))}
                                  </tbody>
                               </table>
                           </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                                <History className="w-12 h-12 text-slate-200 mb-3" />
                                <p>No payment history found.</p>
                            </div>
                        )}
                    </Card>
                </div>
            )}
         </div>

         {/* Mock Payment Gateway Modal */}
         <Modal isOpen={isPaymentModalOpen} onClose={() => !isProcessingPayment && setIsPaymentModalOpen(false)} title="EduMark Secure Pay">
            <div className="space-y-6">
                {!paymentSuccess ? (
                    <>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Payment For</p>
                        <div className="flex justify-between items-center">
                            <h4 className="font-bold text-lg text-slate-900">{selectedFee?.title}</h4>
                            <span className="font-mono font-bold text-lg text-indigo-600">₹{selectedFee?.amount.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            className={`flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${paymentMethod === 'CARD' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`} 
                            onClick={() => setPaymentMethod('CARD')}
                        >
                            <CreditCard className="w-5 h-5" /> Card
                        </button>
                        <button 
                            className={`flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${paymentMethod === 'UPI' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`} 
                            onClick={() => setPaymentMethod('UPI')}
                        >
                            <Smartphone className="w-5 h-5" /> UPI
                        </button>
                    </div>

                    {paymentMethod === 'CARD' ? (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <input type="text" placeholder="Card Number" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono" />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="MM/YY" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono" />
                                <input type="password" placeholder="CVV" maxLength={3} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono" />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="save-card" className="rounded text-indigo-600 focus:ring-indigo-500" />
                                <label htmlFor="save-card" className="text-sm text-slate-600">Save card securely for future payments</label>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 text-center py-4 animate-in fade-in duration-300">
                            <div className="bg-white p-4 inline-block rounded-xl border border-slate-200 shadow-sm">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=edumark@bank&pn=EduMark&am=${selectedFee?.amount}`} alt="UPI QR" className="w-40 h-40" />
                            </div>
                            <p className="text-sm font-medium text-slate-600">Scan with any UPI App (GPay, PhonePe, Paytm)</p>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">Or enter VPA</span></div>
                            </div>
                            <input type="text" placeholder="username@upi" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                    )}
                    
                    <Button className="w-full py-3.5 text-base shadow-lg shadow-indigo-200" onClick={handlePayFee} isLoading={isProcessingPayment}>
                        Pay ₹{selectedFee?.amount.toLocaleString()}
                    </Button>
                    <p className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3 h-3"/> 256-bit SSL Encrypted Payment
                    </p>
                    </>
                ) : (
                    <div className="text-center py-8 animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h3>
                        <p className="text-slate-500 mb-6">Transaction ID: TXN-{Math.floor(Math.random()*1000000)}</p>
                        <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)}>Close</Button>
                    </div>
                )}
            </div>
         </Modal>

         {/* Transaction Details Modal */}
         <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title="Transaction Details">
             {viewingFee && (
                 <div className="space-y-6">
                     <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 text-center">
                         <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                             <CheckCircle2 className="w-6 h-6 text-green-500" />
                         </div>
                         <h3 className="text-2xl font-bold text-indigo-900">₹{viewingFee.amount.toLocaleString()}</h3>
                         <p className="text-sm text-indigo-700 font-medium mt-1">Payment Successful</p>
                         <p className="text-xs text-indigo-400 mt-2 font-mono">TXN-{viewingFee.id}98X</p>
                     </div>

                     <div className="space-y-3 text-sm">
                         <div className="flex justify-between py-2 border-b border-slate-100">
                             <span className="text-slate-500">Paid On</span>
                             <span className="font-medium text-slate-900">{viewingFee.datePaid}</span>
                         </div>
                         <div className="flex justify-between py-2 border-b border-slate-100">
                             <span className="text-slate-500">Payment For</span>
                             <span className="font-medium text-slate-900">{viewingFee.title}</span>
                         </div>
                         <div className="flex justify-between py-2 border-b border-slate-100">
                             <span className="text-slate-500">Payment Method</span>
                             <span className="font-medium text-slate-900">Online Banking</span>
                         </div>
                         <div className="flex justify-between py-2 border-b border-slate-100">
                             <span className="text-slate-500">Status</span>
                             <Badge variant="success">COMPLETED</Badge>
                         </div>
                     </div>

                     <div className="flex gap-3">
                         <Button variant="secondary" className="flex-1" onClick={() => setIsDetailsModalOpen(false)}>Close</Button>
                         <Button className="flex-1" onClick={() => handleDownloadReceipt(viewingFee)}>
                             <Download className="w-4 h-4 mr-2" /> Receipt
                         </Button>
                     </div>
                 </div>
             )}
         </Modal>
      </div>
  );
};
export default StudentFees;
