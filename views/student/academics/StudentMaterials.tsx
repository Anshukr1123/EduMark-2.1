
import React, { useState } from 'react';
import { MOCK_COURSE_MATERIALS } from '../../../constants';
import { Subject } from '../../../types';
import { Card, Button } from '../../../components/UIComponents';
import { Download, Video, Link as LinkIcon, File as FileIcon, Filter, Search } from 'lucide-react';

interface Props { 
  isOnline: boolean;
  subjects: Subject[];
}

const StudentMaterials: React.FC<Props> = ({ isOnline, subjects }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMaterials = MOCK_COURSE_MATERIALS.filter(item => {
    const matchesSubject = selectedSubject === 'ALL' || item.subject === selectedSubject;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h2 className="text-2xl font-bold text-slate-900">Course Materials</h2>
            <p className="text-slate-500 text-sm">Access lecture notes, videos, and references.</p>
         </div>
         <Button variant="outline" onClick={() => alert('All materials downloaded as ZIP')}><Download className="w-4 h-4 mr-2"/> Download All</Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search materials..." 
             className="pl-9 pr-4 py-2 w-full border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
        <div className="flex-1 w-full overflow-x-auto pb-2 md:pb-0">
           <div className="flex gap-2">
              <button 
                onClick={() => setSelectedSubject('ALL')}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${selectedSubject === 'ALL' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                All Subjects
              </button>
              {subjects.map(sub => (
                <button 
                  key={sub.id}
                  onClick={() => setSelectedSubject(sub.name)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${selectedSubject === sub.name ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  {sub.name}
                </button>
              ))}
           </div>
        </div>
      </div>

      {selectedSubject === 'ALL' && (
         <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-100">
            <div className="flex justify-between items-center">
                <div>
                   <h3 className="font-bold text-indigo-900">Course Syllabus 2024</h3>
                   <p className="text-xs text-indigo-700 mt-1">Updated curriculum for Semester 5 (All Subjects)</p>
                </div>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 border-none">Download Syllabus</Button>
            </div>
         </Card>
      )}

      {filteredMaterials.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
           {filteredMaterials.map(item => (
              <Card key={item.id} className="hover:shadow-md transition-shadow group">
                 <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg flex-shrink-0 transition-colors ${item.type === 'PDF' ? 'bg-red-50 text-red-600 group-hover:bg-red-100' : item.type === 'VIDEO' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'}`}>
                       {item.type === 'PDF' && <FileIcon className="w-6 h-6"/>}
                       {item.type === 'VIDEO' && <Video className="w-6 h-6"/>}
                       {item.type === 'LINK' && <LinkIcon className="w-6 h-6"/>}
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-slate-900 truncate pr-2 group-hover:text-indigo-700 transition-colors">{item.title}</h4>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${item.type === 'PDF' ? 'bg-red-100 text-red-700' : item.type === 'VIDEO' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>{item.type}</span>
                       </div>
                       <div className="flex items-center text-xs text-slate-500 mt-1 space-x-2">
                          <span className="font-medium bg-slate-50 px-1.5 rounded border border-slate-100">{item.subject}</span>
                          <span>•</span>
                          <span>{item.date}</span>
                       </div>
                       <button onClick={() => !isOnline && alert('Offline: Cannot download file.')} className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center transition-colors">
                          {item.type === 'LINK' ? 'Open Resource' : 'Download'} <Download className="w-3 h-3 ml-1"/>
                       </button>
                    </div>
                 </div>
              </Card>
           ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
           <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <Filter className="w-6 h-6 text-slate-400" />
           </div>
           <h3 className="text-slate-900 font-medium">No materials found</h3>
           <p className="text-slate-500 text-sm mt-1">Try changing the subject filter or search query.</p>
           <Button variant="outline" size="sm" className="mt-4" onClick={() => { setSelectedSubject('ALL'); setSearchQuery(''); }}>Clear Filters</Button>
        </div>
      )}
    </div>
  );
};

export default StudentMaterials;
