
import React, { useState } from 'react';
import { Card, Button, Badge } from '../../components/UIComponents';
import { Search, Book, Clock, Calendar, Bookmark, BarChart3, User, BookOpen } from 'lucide-react';
import { MOCK_USERS } from '../../constants';

const MOCK_BOOKS = [
  { id: 'b1', title: 'Introduction to Algorithms', author: 'Corman, Leiserson', category: 'CS', status: 'AVAILABLE', image: 'https://picsum.photos/seed/algo/100/150', totalCopies: 12, availableCopies: 8 },
  { id: 'b2', title: 'Clean Code', author: 'Robert C. Martin', category: 'CS', status: 'BORROWED', dueDate: '2023-11-05', image: 'https://picsum.photos/seed/clean/100/150', totalCopies: 5, availableCopies: 0 },
  { id: 'b3', title: 'Physics for Scientists', author: 'Serway, Jewett', category: 'Physics', status: 'AVAILABLE', image: 'https://picsum.photos/seed/phys/100/150', totalCopies: 20, availableCopies: 15 },
  { id: 'b4', title: 'Engineering Mechanics', author: 'Hibbeler', category: 'Mechanical', status: 'AVAILABLE', image: 'https://picsum.photos/seed/mech/100/150', totalCopies: 8, availableCopies: 2 },
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-slate-900">Digital Library</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Digital ID Card */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 bg-white/5 rounded-bl-full"></div>
             <div className="flex justify-between items-start mb-6 relative z-10">
                 <div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Library Membership</p>
                     <h3 className="text-xl font-bold mt-1">EduMark Library</h3>
                 </div>
                 <BookOpen className="w-8 h-8 text-indigo-400"/>
             </div>
             <div className="flex items-center gap-4 mb-6 relative z-10">
                 <img src={user.avatar} className="w-16 h-16 rounded-lg border-2 border-slate-600 bg-slate-700 object-cover" alt="User"/>
                 <div>
                     <p className="font-bold text-lg">{user.name}</p>
                     <p className="text-sm text-slate-400 font-mono">{user.id.toUpperCase()}</p>
                 </div>
             </div>
             <div className="grid grid-cols-2 gap-4 text-xs relative z-10">
                 <div>
                     <p className="text-slate-500 uppercase font-bold">Expires</p>
                     <p className="font-medium">Aug 2025</p>
                 </div>
                 <div>
                     <p className="text-slate-500 uppercase font-bold">Max Books</p>
                     <p className="font-medium">5 Items</p>
                 </div>
             </div>
             <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center relative z-10">
                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${user.id}`} className="w-10 h-10 opacity-80 bg-white p-1 rounded" alt="QR"/>
                 <span className="text-[10px] text-slate-500 uppercase">Scan to Borrow</span>
             </div>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="flex flex-col items-center justify-center text-center p-4 bg-indigo-50 border-indigo-100">
                  <div className="p-3 bg-white rounded-full shadow-sm mb-2 text-indigo-600"><Book className="w-5 h-5"/></div>
                  <h4 className="font-bold text-2xl text-slate-900">45k+</h4>
                  <p className="text-xs text-slate-500">Books Available</p>
              </Card>
              <Card className="flex flex-col items-center justify-center text-center p-4 bg-green-50 border-green-100">
                  <div className="p-3 bg-white rounded-full shadow-sm mb-2 text-green-600"><Bookmark className="w-5 h-5"/></div>
                  <h4 className="font-bold text-2xl text-slate-900">120</h4>
                  <p className="text-xs text-slate-500">Journals</p>
              </Card>
              <Card className="flex flex-col items-center justify-center text-center p-4 bg-purple-50 border-purple-100">
                  <div className="p-3 bg-white rounded-full shadow-sm mb-2 text-purple-600"><Clock className="w-5 h-5"/></div>
                  <h4 className="font-bold text-2xl text-slate-900">24/7</h4>
                  <p className="text-xs text-slate-500">Digital Access</p>
              </Card>
              <Card className="flex flex-col items-center justify-center text-center p-4 bg-orange-50 border-orange-100">
                  <div className="p-3 bg-white rounded-full shadow-sm mb-2 text-orange-600"><User className="w-5 h-5"/></div>
                  <h4 className="font-bold text-2xl text-slate-900">1</h4>
                  <p className="text-xs text-slate-500">Book Borrowed</p>
              </Card>
          </div>
      </div>

      {borrowedBooks.length > 0 && (
        <div className="space-y-3">
           <h3 className="font-bold text-slate-800 flex items-center"><Clock className="w-4 h-4 mr-2"/> Currently Borrowed</h3>
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {borrowedBooks.map(book => (
                 <Card key={book.id} className="flex gap-4 p-4 border-l-4 border-l-orange-400 relative overflow-hidden">
                    <img src={book.image} alt={book.title} className="w-20 h-28 object-cover rounded shadow-sm" />
                    <div className="flex-1">
                       <h4 className="font-bold text-slate-900 line-clamp-1">{book.title}</h4>
                       <p className="text-xs text-slate-500 mb-2">{book.author}</p>
                       <div className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded inline-flex items-center mb-2">
                          <Calendar className="w-3 h-3 mr-1"/> Due: {book.dueDate}
                       </div>
                       <Button size="sm" variant="outline" className="h-8 text-xs w-full">Renew Book</Button>
                    </div>
                 </Card>
              ))}
           </div>
        </div>
      )}

      <div className="space-y-4">
         <div className="flex flex-col md:flex-row justify-between items-center gap-4">
             <h3 className="font-bold text-slate-800 flex items-center"><Book className="w-4 h-4 mr-2"/> Catalog</h3>
             <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search title, author..." 
                  className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
         </div>
         
         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {availableBooks.map(book => (
               <div key={book.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full">
                  <div className="h-48 overflow-hidden relative bg-slate-100 flex items-center justify-center">
                     <img src={book.image} alt={book.title} className="h-full object-contain shadow-md group-hover:scale-105 transition-transform duration-500" />
                     <div className="absolute top-2 right-2"><Badge variant="success">Available</Badge></div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                     <h4 className="font-bold text-slate-900 line-clamp-1" title={book.title}>{book.title}</h4>
                     <p className="text-xs text-slate-500">{book.author}</p>
                     
                     <div className="flex justify-between items-center mt-3 text-xs text-slate-500">
                        <span className="bg-slate-100 px-2 py-0.5 rounded uppercase font-bold tracking-wider text-[10px]">{book.category}</span>
                        <span>{book.availableCopies} of {book.totalCopies} left</span>
                     </div>
                     
                     <div className="mt-auto pt-4">
                        <Button className="w-full" size="sm" onClick={() => handleReserve(book.id)}>
                            <Bookmark className="w-3 h-3 mr-2"/> Reserve
                        </Button>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default StudentLibrary;
