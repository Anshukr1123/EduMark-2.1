
import React, { useState } from 'react';
import { Card, Button, Badge } from '../../components/UIComponents';
import { Search, Book, Clock, Calendar, Bookmark, BarChart3, User, BookOpen, ChevronRight, X } from 'lucide-react';
import { MOCK_USERS } from '../../constants';

const MOCK_BOOKS = [
  { id: 'b1', title: 'Introduction to Algorithms', author: 'Corman, Leiserson', category: 'CS', status: 'AVAILABLE', image: 'https://picsum.photos/seed/algo/300/450', totalCopies: 12, availableCopies: 8 },
  { id: 'b2', title: 'Clean Code', author: 'Robert C. Martin', category: 'CS', status: 'BORROWED', dueDate: '2023-11-05', image: 'https://picsum.photos/seed/clean/300/450', totalCopies: 5, availableCopies: 0 },
  { id: 'b3', title: 'Physics for Scientists', author: 'Serway, Jewett', category: 'Physics', status: 'AVAILABLE', image: 'https://picsum.photos/seed/phys/300/450', totalCopies: 20, availableCopies: 15 },
  { id: 'b4', title: 'Engineering Mechanics', author: 'Hibbeler', category: 'Mechanical', status: 'AVAILABLE', image: 'https://picsum.photos/seed/mech/300/450', totalCopies: 8, availableCopies: 2 },
];

const StudentLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState(MOCK_BOOKS);
  const user = MOCK_USERS[0]; // Assuming current user for ID card display

  const borrowedBooks = books.filter(b => b.status === 'BORROWED');
  const availableBooks = books.filter(b => b.status === 'AVAILABLE' && b.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleReserve = (id: string) => {
    alert("Book reserved! Please collect it from the library within 24 hours.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in slide-in-from-top-2 duration-300">
         <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Digital Library</h2>
            <p className="text-slate-500 text-sm mt-1 font-medium">Access institutional repositories, research papers, and textbooks.</p>
         </div>
         <Button variant="outline" className="font-bold border-slate-200 text-slate-600 hover:bg-slate-50">
             <BookOpen className="w-4 h-4 mr-2"/> Library Rules
         </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-top-4 duration-500 delay-75 fill-mode-backwards">
          {/* Digital ID Card */}
          <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-16 bg-white/5 rounded-bl-full group-hover:scale-110 transition-transform duration-700"></div>
             <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
             
             <div className="flex justify-between items-start mb-8 relative z-10">
                 <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1.5">Membership ID</p>
                     <h3 className="text-xl font-black tracking-tight">EDUMARK CENTRAL</h3>
                 </div>
                 <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10"><BookOpen className="w-6 h-6 text-indigo-400"/></div>
             </div>
             
             <div className="flex items-center gap-5 mb-8 relative z-10">
                 <div className="relative">
                    <img src={user.avatar} className="w-20 h-20 rounded-2xl border-2 border-white/20 bg-slate-800 object-cover shadow-lg" alt="User"/>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 h-5 w-5 rounded-full border-4 border-slate-900"></div>
                 </div>
                 <div>
                     <p className="font-black text-xl tracking-tight leading-none">{user.name}</p>
                     <p className="text-xs text-indigo-400 font-black uppercase tracking-widest mt-2">{user.id.toUpperCase()}</p>
                 </div>
             </div>
             
             <div className="grid grid-cols-2 gap-6 text-xs relative z-10 mb-8">
                 <div>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Valid Until</p>
                     <p className="font-bold text-slate-200">August 2025</p>
                 </div>
                 <div>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Capacity</p>
                     <p className="font-bold text-slate-200">5 Active Loans</p>
                 </div>
             </div>
             
             <div className="pt-6 border-t border-white/10 flex justify-between items-center relative z-10">
                 <div className="bg-white p-2 rounded-xl group-hover:rotate-[-5deg] transition-transform duration-500 shadow-xl">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=${user.id}`} className="w-10 h-10 opacity-90" alt="QR"/>
                 </div>
                 <div className="text-right">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Scan for Auth</p>
                    <Badge className="bg-white/5 text-white border-white/10 text-[9px] px-3 font-black uppercase tracking-widest">Tier: Premier</Badge>
                 </div>
             </div>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Books', val: '45k+', sub: 'Available', icon: Book, color: 'indigo' },
                { label: 'Journals', val: '120', sub: 'Scientific', icon: Bookmark, color: 'emerald' },
                { label: 'Support', val: '24/7', sub: 'Digital Access', icon: Clock, color: 'purple' },
                { label: 'In Hand', val: '1', sub: 'Borrowed', icon: User, color: 'orange' }
              ].map((stat, i) => (
                  <Card key={i} className={`flex flex-col items-center justify-center text-center p-6 border-slate-100 hover:shadow-xl transition-all group overflow-hidden relative`}>
                      <div className={`absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity`}>
                        <stat.icon className="w-16 h-16" />
                      </div>
                      <div className={`p-4 bg-slate-50 rounded-2xl group-hover:bg-${stat.color}-500 group-hover:text-white transition-all duration-500 mb-4 shadow-inner`}>
                        <stat.icon className="w-6 h-6"/>
                      </div>
                      <h4 className="font-black text-3xl text-slate-900 tabular-nums">{stat.val}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{stat.sub}</p>
                  </Card>
              ))}
          </div>
      </div>

      {borrowedBooks.length > 0 && (
        <div className="space-y-4 animate-in slide-in-from-top-4 duration-500 delay-150 fill-mode-backwards">
           <div className="flex items-center gap-3 px-1">
               <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter flex items-center">
                   <span className="w-6 h-1 bg-orange-500 rounded-full mr-3"></span>
                   In Your Possession
               </h3>
               <Badge variant="warning" className="text-[10px] font-black uppercase px-2">{borrowedBooks.length} Active</Badge>
           </div>
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {borrowedBooks.map(book => (
                 <Card key={book.id} className="flex gap-5 p-5 border-l-4 border-l-orange-500 relative overflow-hidden group hover:shadow-xl transition-all">
                    <div className="relative w-24 h-32 flex-shrink-0">
                        <img src={book.image} alt={book.title} className="w-full h-full object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-xl"></div>
                    </div>
                    <div className="flex-1 flex flex-col min-w-0">
                       <h4 className="font-black text-slate-900 text-lg leading-tight line-clamp-1">{book.title}</h4>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 mb-3">{book.author}</p>
                       <div className="mt-auto space-y-3">
                           <div className="text-[10px] font-black text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 flex items-center w-fit uppercase tracking-widest">
                              <Calendar className="w-3.5 h-3.5 mr-2"/> Due: {book.dueDate}
                           </div>
                           <Button size="sm" variant="outline" className="h-9 text-[10px] font-black uppercase tracking-widest w-full border-slate-200 text-slate-600 hover:bg-slate-50">Renew Loan</Button>
                       </div>
                    </div>
                 </Card>
              ))}
           </div>
        </div>
      )}

      <div className="space-y-6 animate-in slide-in-from-top-4 duration-500 delay-200 fill-mode-backwards">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><Search className="w-6 h-6"/></div>
                <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Global Catalog</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Search across 45,000 resources</p>
                </div>
             </div>
             <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search by ISBN, title, or author..." 
                  className="pl-12 pr-12 py-3.5 bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-[20px] text-sm outline-none w-full transition-all shadow-inner"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="absolute right-4 top-3.5 p-0.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900">
                        <X className="w-4 h-4" />
                    </button>
                )}
             </div>
         </div>
         
         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {availableBooks.map((book, i) => (
               <div key={book.id} className="flex flex-col h-full animate-in fade-in slide-in-from-top-2 duration-500 group" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="relative aspect-[2/3] rounded-[24px] overflow-hidden bg-slate-100 shadow-lg group-hover:shadow-2xl transition-all duration-500 mb-5">
                     <img src={book.image} alt={book.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                     <div className="absolute top-4 right-4"><Badge variant="success" className="shadow-lg backdrop-blur-md bg-white/90 border-none font-black text-[9px]">AVAILABLE</Badge></div>
                     <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <Button className="w-full shadow-2xl shadow-indigo-600/50 h-10 text-[10px] font-black uppercase tracking-widest" onClick={() => handleReserve(book.id)}>Reserve Copy</Button>
                     </div>
                  </div>
                  <div className="px-1 flex flex-col flex-1">
                     <h4 className="font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2 min-h-[2.5rem]" title={book.title}>{book.title}</h4>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{book.author}</p>
                     
                     <div className="flex justify-between items-center mt-auto pt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-50">
                        <span className="bg-slate-100 px-2 py-1 rounded-lg text-slate-500 font-black">{book.category}</span>
                        <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> {book.availableCopies} Left</span>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {availableBooks.length === 0 && (
             <div className="flex flex-col items-center justify-center py-32 text-center bg-slate-50/50 rounded-[40px] border border-dashed border-slate-200">
                 <div className="p-6 bg-white rounded-3xl shadow-xl mb-6">
                    <Search className="w-12 h-12 text-slate-200" />
                 </div>
                 <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">No results found</h3>
                 <p className="text-slate-400 text-sm mt-2 font-medium max-w-xs">We couldn't find any books matching your search. Try checking the keyword or browsing modules.</p>
                 <Button variant="outline" className="mt-8 font-black uppercase tracking-widest text-[10px]" onClick={() => setSearchTerm('')}>Reset Catalog</Button>
             </div>
         )}
      </div>
      
      {/* Newsletter / Feature Banner */}
      <div className="bg-indigo-600 rounded-[40px] p-12 text-white relative overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500 delay-300 fill-mode-backwards">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-1 text-center md:text-left">
                  <h3 className="text-4xl font-black tracking-tighter leading-none mb-4 uppercase">New Arrivals for CSE</h3>
                  <p className="text-indigo-100 text-lg font-medium opacity-80 max-w-md">The 2024 editions of Database Systems and ML Engineering are now available for digital lending.</p>
                  <Button variant="secondary" className="mt-8 px-10 h-12 rounded-2xl font-black text-indigo-700 uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">Browse New Collection <ChevronRight className="ml-2 w-5 h-5"/></Button>
              </div>
              <div className="hidden lg:flex gap-4 rotate-[15deg]">
                   <div className="w-32 h-44 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl"></div>
                   <div className="w-32 h-44 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl -mt-8"></div>
                   <div className="w-32 h-44 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl"></div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default StudentLibrary;
