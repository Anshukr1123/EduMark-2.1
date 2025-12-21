
import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/UIComponents';
import { Search, Book, Clock, Calendar, Bookmark, User, BookOpen, ChevronRight, X, Star, Library as LibraryIcon, ShieldCheck, Sparkles } from 'lucide-react';
import { MOCK_USERS } from '../../constants';

const MOCK_BOOKS = [
  { id: 'b1', title: 'Introduction to Algorithms', author: 'Corman, Leiserson', category: 'Computer Science', status: 'AVAILABLE', image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=400', totalCopies: 12, availableCopies: 8, rating: 4.8 },
  { id: 'b2', title: 'Clean Code', author: 'Robert C. Martin', category: 'Software Engineering', status: 'BORROWED', dueDate: '2023-11-05', image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=400', totalCopies: 5, availableCopies: 0, rating: 4.9 },
  { id: 'b3', title: 'Quantum Mechanics', author: 'Serway, Jewett', category: 'Physics', status: 'AVAILABLE', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400', totalCopies: 20, availableCopies: 15, rating: 4.5 },
  { id: 'b4', title: 'Engineering Mechanics', author: 'Hibbeler', category: 'Mechanical', status: 'AVAILABLE', image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=400', totalCopies: 8, availableCopies: 2, rating: 4.2 },
  { id: 'b5', title: 'Neural Networks: A Comprehensive Foundation', author: 'Simon Haykin', category: 'AI & ML', status: 'AVAILABLE', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400', totalCopies: 6, availableCopies: 3, rating: 4.7 },
  { id: 'b6', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Software Engineering', status: 'AVAILABLE', image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=400', totalCopies: 10, availableCopies: 1, rating: 4.9 },
  { id: 'b7', title: 'Digital Logic & Design', author: 'Morris Mano', category: 'Electronics', status: 'AVAILABLE', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400', totalCopies: 15, availableCopies: 12, rating: 4.4 },
  { id: 'b8', title: 'Discrete Mathematics', author: 'Kenneth Rosen', category: 'Mathematics', status: 'AVAILABLE', image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=400', totalCopies: 30, availableCopies: 24, rating: 4.6 },
];

// Define interfaces for better typing
interface BookItem {
  id: string;
  title: string;
  author: string;
  category: string;
  status: string;
  image: string;
  totalCopies: number;
  availableCopies: number;
  rating: number;
  dueDate?: string;
}

interface BookCardProps {
  book: BookItem;
  onReserve: (id: string) => void;
}

// Added React.FC to handle special props like key and improved book typing to fix line 234 error
const BookCard: React.FC<BookCardProps> = ({ book, onReserve }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="flex flex-col h-full group perspective-1000">
      <div className="relative aspect-[3/4] rounded-[24px] overflow-hidden bg-slate-100 shadow-lg group-hover:shadow-2xl transition-all duration-700 transform group-hover:-translate-y-2 group-hover:rotate-1">
        {/* Shimmer Placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 animate-pulse flex items-center justify-center">
             <Book className="w-12 h-12 text-slate-200" />
          </div>
        )}
        
        <img 
          src={book.image} 
          alt={book.title} 
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'} group-hover:scale-110`} 
        />
        
        {/* Glassmorphism Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="absolute top-4 left-4 flex flex-col gap-2 translate-x-[-20px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-100">
          <Badge className="bg-white/90 backdrop-blur-md text-indigo-600 border-none font-black text-[8px] py-1 shadow-xl">
             <Star className="w-2.5 h-2.5 mr-1 fill-indigo-600" /> {book.rating}
          </Badge>
        </div>

        <div className="absolute top-4 right-4 translate-x-[20px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-100">
           <Badge variant="success" className="shadow-lg backdrop-blur-md bg-green-500/90 text-white border-none font-black text-[9px] px-3">
             {book.status}
           </Badge>
        </div>

        <div className="absolute bottom-4 left-4 right-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-200">
           <Button 
             className="w-full shadow-2xl shadow-indigo-600/50 h-10 text-[9px] font-black uppercase tracking-widest bg-indigo-600 hover:bg-white hover:text-indigo-600 border-none"
             onClick={() => onReserve(book.id)}
           >
             Secure Digital Loan
           </Button>
        </div>
      </div>

      <div className="mt-4 px-1 space-y-1">
        <h4 className="font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1 uppercase tracking-tighter text-sm" title={book.title}>
          {book.title}
        </h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{book.author}</p>
        
        <div className="flex justify-between items-center pt-2 text-[9px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-50">
           <span className="bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full border border-slate-100">{book.category}</span>
           <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span> {book.availableCopies} COPIES</span>
        </div>
      </div>
    </div>
  );
};

const StudentLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books] = useState<BookItem[]>(MOCK_BOOKS as BookItem[]);
  const user = MOCK_USERS[0];

  const borrowedBooks = books.filter(b => b.status === 'BORROWED');
  const availableBooks = books.filter(b => 
    b.status === 'AVAILABLE' && 
    (b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
     b.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleReserve = (id: string) => {
    alert("Resource reserved. Digital access keys sent to Institutional Node.");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-16">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in slide-in-from-top-2 duration-500">
         <div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Bibliotheca Terminal</h2>
            <p className="text-slate-400 text-xs mt-1.5 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Distributed Knowledge Network Node
            </p>
         </div>
         <div className="flex gap-2">
            <Button variant="outline" className="font-black border-slate-200 text-slate-500 hover:bg-slate-50 text-[10px] uppercase tracking-widest h-10 px-6 rounded-xl">
                Manuals
            </Button>
            <Button className="font-black bg-slate-900 hover:bg-slate-800 shadow-xl text-[10px] uppercase tracking-widest h-10 px-6 rounded-xl">
                Research Feed
            </Button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Identity Card - Ultra High Fidelity */}
          <div className="lg:col-span-4 bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-[80px] -ml-24 -mb-24"></div>
             
             <div className="relative z-10 space-y-6">
                 <div className="flex justify-between items-start">
                     <div>
                         <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Authorization Layer</p>
                         <h3 className="text-2xl font-black tracking-tighter uppercase leading-none">Libris Passport</h3>
                     </div>
                     <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md shadow-xl group-hover:rotate-12 transition-transform duration-500">
                         <LibraryIcon className="w-6 h-6 text-indigo-400"/>
                     </div>
                 </div>
                 
                 <div className="flex items-center gap-4 bg-white/5 p-4 rounded-[32px] border border-white/10 backdrop-blur-sm">
                     <div className="relative shrink-0">
                        <img src={user.avatar} className="w-16 h-16 rounded-[24px] border-2 border-white/10 object-cover shadow-2xl" alt="User"/>
                        <div className="absolute -bottom-1 -right-1 bg-green-500 h-4 w-4 rounded-full border-2 border-slate-900 shadow-lg animate-pulse"></div>
                     </div>
                     <div className="min-w-0">
                         <p className="font-black text-lg tracking-tighter uppercase truncate">{user.name}</p>
                         <div className="flex items-center gap-2 mt-1">
                             <Badge className="bg-indigo-600 text-white border-none text-[8px] font-black px-2 tracking-widest uppercase shadow-lg">CORE MEMBER</Badge>
                             <span className="text-[10px] text-slate-500 font-mono font-bold tracking-widest">{user.id.toUpperCase()}</span>
                         </div>
                     </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 pt-2">
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                         <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Access Tier</p>
                         <p className="font-black text-xs text-slate-200 flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-indigo-400" /> ELITE</p>
                     </div>
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                         <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Loan Limit</p>
                         <p className="font-black text-xs text-slate-200">12 UNITS</p>
                     </div>
                 </div>
             </div>
             
             <div className="pt-8 flex justify-between items-center relative z-10">
                 <div className="bg-white p-2.5 rounded-[20px] shadow-2xl hover:scale-110 transition-transform cursor-pointer">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=${user.id}`} className="w-12 h-12 grayscale opacity-90" alt="QR"/>
                 </div>
                 <div className="text-right">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1.5 underline underline-offset-4 decoration-indigo-500/50">Credential Sync</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em]">Institutional ID: Verified</p>
                 </div>
             </div>
          </div>

          {/* Quick Metrics */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Network Catalog', val: '45k+', sub: 'Global Assets', icon: Book, color: 'indigo' },
                { label: 'Live Sessions', val: '120', sub: 'Peer Seminars', icon: Bookmark, color: 'emerald' },
                { label: 'Uptime', val: '24/7', sub: 'Neural Sync', icon: Clock, color: 'purple' },
                { label: 'Operations', val: borrowedBooks.length.toString(), sub: 'Active Loans', icon: User, color: 'orange' }
              ].map((stat, i) => (
                  <Card key={i} className="flex flex-col items-center justify-center text-center p-6 border-slate-100 hover:shadow-xl transition-all group overflow-hidden relative rounded-[32px]">
                      <div className="absolute -top-4 -right-4 p-8 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                        <stat.icon className="w-24 h-24 rotate-12" />
                      </div>
                      <div className={`p-4 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl group-hover:bg-slate-900 group-hover:text-indigo-400 transition-all duration-500 mb-4 shadow-inner`}>
                        <stat.icon className="w-6 h-6"/>
                      </div>
                      <h4 className="font-black text-3xl text-slate-900 tracking-tighter tabular-nums leading-none">{stat.val}</h4>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 leading-none">{stat.sub}</p>
                  </Card>
              ))}

              <div className="col-span-2 md:col-span-4 bg-indigo-50/50 border border-indigo-100 rounded-[32px] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg"><Star className="w-5 h-5 fill-white" /></div>
                      <div>
                          <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight">Curated For You</h4>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Based on your "Artificial Intelligence" module enrollment.</p>
                      </div>
                  </div>
                  <Button variant="outline" className="bg-white border-indigo-200 text-indigo-600 font-black uppercase text-[9px] px-6 h-10 rounded-xl tracking-widest">Explore Recommendations</Button>
              </div>
          </div>
      </div>

      {/* Catalog Control Surface */}
      <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
         <div className="flex flex-col xl:flex-row justify-between items-center gap-8 bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
             <div className="flex items-center gap-6">
                <div className="p-4 bg-slate-900 rounded-[28px] text-indigo-400 shadow-2xl rotate-[-3deg]"><Search className="w-8 h-8"/></div>
                <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Catalog Filter</h3>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.25em] mt-1.5">Universal Resource Locator and Discovery</p>
                </div>
             </div>
             
             <div className="relative w-full xl:w-[600px] group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="ISBN, Title, Keyword, Author, or Module ID..." 
                  className="pl-16 pr-16 py-5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 rounded-[30px] text-base font-bold outline-none w-full transition-all shadow-inner placeholder:text-slate-300 tracking-tight"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="absolute right-6 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-200 rounded-full transition-all text-slate-400 hover:text-slate-900 shadow-sm">
                        <X className="w-5 h-5" />
                    </button>
                )}
             </div>
         </div>
         
         {/* Responsive High-Fidelity Grid */}
         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-8 gap-y-12 px-2">
            {availableBooks.map((book) => (
               <BookCard key={book.id} book={book} onReserve={handleReserve} />
            ))}
         </div>

         {availableBooks.length === 0 && (
             <div className="flex flex-col items-center justify-center py-40 text-center bg-slate-50/30 rounded-[60px] border-4 border-dashed border-slate-100 animate-in fade-in duration-500">
                 <div className="p-8 bg-white rounded-[40px] shadow-2xl mb-8 transform hover:scale-110 transition-transform">
                    <BookOpen className="w-16 h-16 text-slate-200" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Catalog Exhausted</h3>
                 <p className="text-slate-400 text-sm mt-3 font-bold uppercase tracking-widest max-w-sm">No institutional records match your current query parameter.</p>
                 <Button variant="outline" className="mt-10 font-black uppercase tracking-[0.2em] text-[10px] px-12 h-12 rounded-2xl border-slate-200" onClick={() => setSearchTerm('')}>Reset Neural Filter</Button>
             </div>
         )}
      </div>
      
      {/* Borrowing / POS Section Integration */}
      {borrowedBooks.length > 0 && (
        <div className="space-y-6 pt-8 animate-in slide-in-from-bottom-8 duration-1000">
           <div className="flex items-center gap-4 px-2">
                <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-100"><User className="w-6 h-6" /></div>
                <div>
                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Borrowed Portfolio</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active digital and physical loan state</p>
                </div>
           </div>
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {borrowedBooks.map(book => (
                 <Card key={book.id} className="flex gap-6 p-6 border-none shadow-xl rounded-[40px] bg-white group hover:shadow-2xl transition-all border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-orange-500"></div>
                    <div className="relative w-28 h-36 flex-shrink-0">
                        <img src={book.image} alt={book.title} loading="lazy" className="w-full h-full object-cover rounded-2xl shadow-xl transition-all duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl"></div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                       <div className="space-y-1">
                          <h4 className="font-black text-slate-900 text-lg tracking-tighter leading-tight uppercase line-clamp-2">{book.title}</h4>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{book.author}</p>
                       </div>
                       <div className="mt-4 space-y-3">
                           <div className="text-[9px] font-black text-orange-600 bg-orange-50 px-3 py-2 rounded-xl border border-orange-100 flex items-center justify-between shadow-sm">
                              <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-2"/> DEADLINE</span>
                              <span>{book.dueDate}</span>
                           </div>
                           <Button size="sm" variant="outline" className="h-10 text-[9px] font-black uppercase tracking-widest w-full border-slate-100 text-slate-500 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 rounded-xl transition-all">Extend Lease</Button>
                       </div>
                    </div>
                 </Card>
              ))}
           </div>
        </div>
      )}

      {/* Marketing / Newsletter Footer */}
      <div className="bg-indigo-600 rounded-[50px] p-16 text-white relative overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-1000 group">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:scale-110 transition-transform duration-1000"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
              <div className="flex-1 text-center lg:text-left space-y-8">
                  <Badge className="bg-white/20 text-white border-none font-black text-[10px] px-6 py-2 tracking-[0.4em] uppercase backdrop-blur-xl">Institutional Bulletin</Badge>
                  <h3 className="text-6xl font-black tracking-tighter leading-[0.9] uppercase">Knowledge <br/> Expansion 2024</h3>
                  <p className="text-indigo-100 text-xl font-medium opacity-80 max-w-lg leading-relaxed">The 2024 Engineering & Physics modules have been fully virtualized. New access keys for "Distributed Systems" are now active for all premium members.</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="secondary" className="px-12 h-14 rounded-2xl font-black text-indigo-700 uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all bg-white border-none">
                        Synchronize Catalog
                    </Button>
                    <button className="flex items-center justify-center text-xs font-black uppercase tracking-[0.2em] text-white hover:text-indigo-200 transition-colors">
                        View Expansion Notes <ChevronRight className="ml-2 w-5 h-5"/>
                    </button>
                  </div>
              </div>
              
              <div className="hidden lg:grid grid-cols-2 gap-6 rotate-[12deg] group-hover:rotate-[8deg] transition-all duration-1000">
                   <div className="w-40 h-56 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6 flex flex-col justify-end translate-y-8">
                        <div className="h-1.5 w-12 bg-white/20 rounded-full mb-3"></div>
                        <div className="h-1.5 w-20 bg-white/10 rounded-full"></div>
                   </div>
                   <div className="w-40 h-56 bg-white/20 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-6 flex flex-col justify-end">
                        <div className="h-1.5 w-16 bg-white/30 rounded-full mb-3"></div>
                        <div className="h-1.5 w-24 bg-white/10 rounded-full"></div>
                   </div>
                   <div className="w-40 h-56 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 flex flex-col justify-end translate-y-12 -translate-x-4">
                        <div className="h-1.5 w-10 bg-white/10 rounded-full mb-3"></div>
                        <div className="h-1.5 w-28 bg-white/5 rounded-full"></div>
                   </div>
                   <div className="w-40 h-56 bg-white/15 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6 flex flex-col justify-end translate-y-4">
                        <div className="h-1.5 w-14 bg-white/20 rounded-full mb-3"></div>
                        <div className="h-1.5 w-20 bg-white/10 rounded-full"></div>
                   </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default StudentLibrary;
