
import React from 'react';
import { MOCK_RESULTS, MOCK_INTERNAL_ASSESSMENTS } from '../../../constants';
import { Card, Button, Badge } from '../../../components/UIComponents';
import { Award, TrendingUp, Calendar, BookOpen, CheckCircle2, BarChart2, Eye } from 'lucide-react';

const StudentResults: React.FC = () => {
  // Calculate mock CGPA
  const totalMarks = MOCK_RESULTS.reduce((acc, curr) => acc + curr.totalMarks, 0);
  const obtainedMarks = MOCK_RESULTS.reduce((acc, curr) => acc + curr.marksObtained, 0);
  const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
  const cgpa = (percentage / 9.5).toFixed(2); // Simple approximation for demo

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex flex-col md:flex-row gap-6">
          {/* Summary Card */}
          <div className="flex-1 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Award className="w-32 h-32" />
             </div>
             <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-1">Academic Performance</h2>
                <p className="text-indigo-100 text-sm mb-6">Cumulative Grade Point Average</p>
                <div className="flex items-end gap-3">
                   <span className="text-5xl font-black">{cgpa}</span>
                   <span className="text-lg font-medium opacity-80 mb-1">/ 10.0</span>
                </div>
                <div className="mt-4 flex gap-4 text-sm font-medium">
                   <div className="bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                      <span className="opacity-75">Credits Earned:</span> 18
                   </div>
                   <div className="bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                      <span className="opacity-75">Exams Taken:</span> {MOCK_RESULTS.length}
                   </div>
                </div>
             </div>
          </div>
          
          {/* Action Card */}
          <Card className="flex-1 flex flex-col justify-center items-start">
             <h3 className="text-lg font-bold text-slate-900 mb-2">Examination Services</h3>
             <p className="text-sm text-slate-500 mb-6">Access hall tickets, apply for re-evaluation, or download semester grade sheets.</p>
             <div className="flex flex-wrap gap-3">
                <Button size="sm" variant="outline"><BookOpen className="w-4 h-4 mr-2"/> Grade Sheet</Button>
                <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700">Download Hall Ticket</Button>
             </div>
          </Card>
       </div>

       <div className="space-y-6">
          <div className="flex items-center justify-between">
             <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600"/> Past Exams & Results
             </h3>
             <div className="text-sm text-slate-500">Showing all semesters</div>
          </div>

          {/* Past Exams List */}
          <Card className="overflow-hidden p-0 border-0 shadow-md">
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                   <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                      <tr>
                         <th className="px-6 py-4 font-semibold">Exam Details</th>
                         <th className="px-6 py-4 font-semibold">Subject</th>
                         <th className="px-6 py-4 font-semibold min-w-[200px]">Performance</th>
                         <th className="px-6 py-4 text-center font-semibold">Grade</th>
                         <th className="px-6 py-4 text-right font-semibold">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 bg-white">
                      {MOCK_RESULTS.map(res => {
                         const pct = (res.marksObtained / res.totalMarks) * 100;
                         return (
                         <tr key={res.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4">
                               <div className="font-bold text-slate-900">{res.examName}</div>
                               <div className="text-xs text-slate-500 flex items-center mt-1">
                                  <Calendar className="w-3 h-3 mr-1"/> {res.date}
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <span className="font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded text-xs">
                                  {res.subject}
                               </span>
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex justify-between items-end mb-1">
                                  <span className="font-bold text-slate-900 text-sm">{res.marksObtained} <span className="text-slate-400 font-normal">/ {res.totalMarks}</span></span>
                                  <span className="text-xs font-bold text-indigo-600">{pct.toFixed(0)}%</span>
                               </div>
                               <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-indigo-500' : 'bg-yellow-500'}`} 
                                    style={{ width: `${pct}%` }}
                                  ></div>
                               </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                               <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold shadow-sm border-2 ${
                                  res.grade.startsWith('A') ? 'bg-green-50 text-green-700 border-green-100' : 
                                  res.grade.startsWith('B') ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                  res.grade.startsWith('C') ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 
                                  'bg-red-50 text-red-700 border-red-100'
                               }`}>
                                  {res.grade}
                               </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                               <Button variant="secondary" size="sm" className="h-8">
                                  <Eye className="w-3 h-3 mr-1"/> Details
                               </Button>
                            </td>
                         </tr>
                      );})}
                   </tbody>
                </table>
             </div>
          </Card>
       </div>

       {/* Internal Assessments (Kept as secondary section) */}
       <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
             <CheckCircle2 className="w-5 h-5 text-indigo-600"/> Internal Assessments
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
             {MOCK_INTERNAL_ASSESSMENTS.map(ia => (
                <Card key={ia.id} className="hover:border-indigo-200 transition-all cursor-pointer group">
                   <div className="flex justify-between items-start mb-3">
                      <Badge variant={ia.status === 'COMPLETED' ? 'success' : ia.status === 'UPCOMING' ? 'neutral' : 'error'}>{ia.status}</Badge>
                      <span className="text-xs text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded">{ia.date}</span>
                   </div>
                   <h4 className="font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{ia.title}</h4>
                   <p className="text-xs text-slate-500 mb-3 font-medium">{ia.subject}</p>
                   {ia.status === 'COMPLETED' ? (
                      <div className="flex items-center gap-2">
                         <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(ia.score / ia.totalScore) * 100}%` }}></div>
                         </div>
                         <span className="text-xs font-bold text-slate-700">{ia.score}/{ia.totalScore}</span>
                      </div>
                   ) : (
                      <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                         <BarChart2 className="w-3 h-3"/> Score pending
                      </div>
                   )}
                </Card>
             ))}
          </div>
       </div>
    </div>
  );
};

export default StudentResults;
