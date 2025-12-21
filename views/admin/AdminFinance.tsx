
import React, { useState } from 'react';
import { Card, Button, Badge, Modal } from '../../components/UIComponents';
import { Download, TrendingUp, AlertCircle, Plus, Trash2, Edit2, Wallet } from 'lucide-react';
import { MOCK_FEES } from '../../constants';

interface FeeStructure {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  frequency: string;
}

// Added missing onShowToast to Props interface
interface Props { 
  activeTab: string; 
  onShowToast?: (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

// Added onShowToast to component parameters
const AdminFinance: React.FC<Props> = ({ activeTab, onShowToast }) => {
  // State for Fee Structure Management
  const [feeStructure, setFeeStructure] = useState<FeeStructure[]>([
    { id: '1', name: 'Semester Tuition Fee', amount: 45000, dueDate: '2024-01-15', frequency: 'Semester' },
    { id: '2', name: 'Lab Maintenance Fee', amount: 5000, dueDate: '2024-02-01', frequency: 'Annual' },
    { id: '3', name: 'Library Access Fee', amount: 2000, dueDate: '2024-01-20', frequency: 'Annual' },
    { id: '4', name: 'Hostel Rent (Block A)', amount: 25000, dueDate: '2024-01-10', frequency: 'Semester' },
  ]);

  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [newFee, setNewFee] = useState({ name: '', amount: '', dueDate: '', frequency: 'Semester' });

  const handleAddFee = () => {
      if(!newFee.name || !newFee.amount) return;
      const fee: FeeStructure = {
          id: Math.random().toString(),
          name: newFee.name,
          amount: parseFloat(newFee.amount),
          dueDate: newFee.dueDate,
          frequency: newFee.frequency
      };
      setFeeStructure([...feeStructure, fee]);
      setIsFeeModalOpen(false);
      setNewFee({ name: '', amount: '', dueDate: '', frequency: 'Semester' });
      if (onShowToast) onShowToast("Fee Added", "New institutional fee structure has been recorded.", "success");
  };

  const handleDeleteFee = (id: string) => {
      if(confirm('Are you sure you want to remove this fee type?')) {
          setFeeStructure(prev => prev.filter(f => f.id !== id));
          if (onShowToast) onShowToast("Fee Removed", "Structure deleted from records.", "info");
      }
  };

  if (activeTab === 'fees') return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex justify-between items-center">
           <h2 className="text-2xl font-bold text-slate-900">Fees & Finance</h2>
           <Button variant="outline"><Download className="w-4 h-4 mr-2"/> Export Data</Button>
       </div>

       {/* Summary Stats */}
       <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-green-50 border-green-100 p-4">
              <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600"><TrendingUp className="w-5 h-5"/></div>
                  <span className="font-bold text-green-700 text-sm uppercase tracking-wide">Collected</span>
              </div>
              <p className="text-3xl font-bold text-green-800">₹42.5L</p>
              <p className="text-xs text-green-600 mt-1">+12% vs last year</p>
          </Card>
          <Card className="bg-amber-50 border-amber-100 p-4">
              <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><AlertCircle className="w-5 h-5"/></div>
                  <span className="font-bold text-amber-700 text-sm uppercase tracking-wide">Pending</span>
              </div>
              <p className="text-3xl font-bold text-amber-800">₹12.5L</p>
              <p className="text-xs text-amber-600 mt-1">Due within 30 days</p>
          </Card>
          <Card className="bg-blue-50 border-blue-100 p-4">
              <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Wallet className="w-5 h-5"/></div>
                  <span className="font-bold text-blue-700 text-sm uppercase tracking-wide">Projected</span>
              </div>
              <p className="text-3xl font-bold text-blue-800">₹55.0L</p>
              <p className="text-xs text-blue-600 mt-1">Total for Semester</p>
          </Card>
       </div>

       {/* Fee Structure Management Section */}
       <Card className="overflow-hidden">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-slate-100 bg-slate-50/50">
               <div>
                   <h3 className="text-lg font-bold text-slate-900">Fee Structure Configuration</h3>
                   <p className="text-sm text-slate-500">Define standard fees for the current academic year.</p>
               </div>
               <Button onClick={() => setIsFeeModalOpen(true)} className="mt-4 sm:mt-0">
                   <Plus className="w-4 h-4 mr-2"/> Add Fee Type
               </Button>
           </div>
           <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                   <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                       <tr>
                           <th className="px-6 py-4 font-semibold">Fee Type Name</th>
                           <th className="px-6 py-4 font-semibold">Frequency</th>
                           <th className="px-6 py-4 font-semibold">Standard Amount</th>
                           <th className="px-6 py-4 font-semibold">Default Due Date</th>
                           <th className="px-6 py-4 text-right font-semibold">Actions</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                       {feeStructure.map(fee => (
                           <tr key={fee.id} className="hover:bg-slate-50 transition-colors">
                               <td className="px-6 py-4 font-medium text-slate-900">{fee.name}</td>
                               <td className="px-6 py-4"><Badge variant="neutral">{fee.frequency}</Badge></td>
                               <td className="px-6 py-4 font-mono font-medium">₹{fee.amount.toLocaleString()}</td>
                               <td className="px-6 py-4 text-slate-600">{fee.dueDate || 'N/A'}</td>
                               <td className="px-6 py-4 text-right">
                                   <div className="flex justify-end gap-2">
                                       <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Edit"><Edit2 className="w-4 h-4"/></button>
                                       <button onClick={() => handleDeleteFee(fee.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete"><Trash2 className="w-4 h-4"/></button>
                                   </div>
                               </td>
                           </tr>
                       ))}
                       {feeStructure.length === 0 && (
                           <tr><td colSpan={5} className="text-center py-8 text-slate-500">No fee structures defined. Add one to get started.</td></tr>
                       )}
                   </tbody>
               </table>
           </div>
       </Card>

       <Card title="Recent Transactions">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                    <tr><th className="px-6 py-3">Transaction</th><th className="px-6 py-3">Date</th><th className="px-6 py-3">Amount</th><th className="px-6 py-3">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {MOCK_FEES.map(f => (
                        <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">{f.title}</td>
                            <td className="px-6 py-4 text-slate-500">{f.datePaid || '-'}</td>
                            <td className="px-6 py-4 font-medium">₹{f.amount.toLocaleString()}</td>
                            <td className="px-6 py-4"><Badge variant={f.status === 'PAID' ? 'success' : 'warning'}>{f.status}</Badge></td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
       </Card>

       {/* Add Fee Modal */}
       <Modal isOpen={isFeeModalOpen} onClose={() => setIsFeeModalOpen(false)} title="Add New Fee Type">
           <div className="space-y-4">
               <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700">Fee Name</label>
                   <input 
                       type="text" 
                       className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                       placeholder="e.g. Examination Fee" 
                       value={newFee.name} 
                       onChange={e => setNewFee({...newFee, name: e.target.value})} 
                   />
               </div>
               <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Amount (₹)</label>
                       <input 
                           type="number" 
                           className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                           placeholder="0.00" 
                           value={newFee.amount} 
                           onChange={e => setNewFee({...newFee, amount: e.target.value})} 
                       />
                   </div>
                   <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Frequency</label>
                       <select 
                           className="w-full border p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                           value={newFee.frequency}
                           onChange={e => setNewFee({...newFee, frequency: e.target.value})}
                       >
                           <option value="One-Time">One-Time</option>
                           <option value="Semester">Semester</option>
                           <option value="Annual">Annual</option>
                           <option value="Monthly">Monthly</option>
                       </select>
                   </div>
               </div>
               <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700">Default Due Date</label>
                   <input 
                       type="date" 
                       className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                       value={newFee.dueDate} 
                       onChange={e => setNewFee({...newFee, dueDate: e.target.value})} 
                   />
               </div>
               <Button className="w-full mt-2" onClick={handleAddFee}>Create Fee Structure</Button>
           </div>
       </Modal>
    </div>
  );
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-slate-900">Reports Center</h2><Button variant="outline"><Download className="w-4 h-4 mr-2"/> Download All</Button></div>
      <div className="grid gap-4 md:grid-cols-2">
         {['Fee Collection Report', 'Outstanding Dues Report', 'Scholarship Disbursement', 'Expense Summary'].map(r => (
            <Card key={r} className="flex justify-between items-center hover:shadow-md transition-shadow">
               <span className="font-medium text-slate-700">{r}</span>
               <Button size="sm" variant="secondary" onClick={() => onShowToast && onShowToast("Download Started", `Preparing ${r} for download...`, "info")}><Download className="w-4 h-4"/></Button>
            </Card>
         ))}
      </div>
    </div>
  );
};

export default AdminFinance;
