
import React, { useState } from 'react';
import { Card, Button, Modal, Badge } from '../../components/UIComponents';
import { Save, Plus, Image, FileText, Calendar, UploadCloud, X, Trash2, Edit, Clock, MapPin, Layout } from 'lucide-react';
import { MOCK_NOTICES, MOCK_COLLEGE_EVENTS } from '../../constants';
import { CollegeEvent, Notice } from '../../types';

// Extended type for local state to support images in notices
interface ExtendedNotice extends Notice {
  image?: string;
}

interface GalleryItem {
  id: string;
  url: string;
  caption: string;
}

interface Props { activeTab: string; }

const AdminSystem: React.FC<Props> = ({ activeTab }) => {
  const [activeCmsTab, setActiveCmsTab] = useState('news');

  // --- News State ---
  const [newsItems, setNewsItems] = useState<ExtendedNotice[]>(MOCK_NOTICES.map(n => ({...n, image: ''})));
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [newNews, setNewNews] = useState<Partial<ExtendedNotice>>({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    type: 'ACADEMIC',
    sender: 'Admin',
    image: ''
  });

  // --- Event State ---
  const [events, setEvents] = useState<CollegeEvent[]>(MOCK_COLLEGE_EVENTS);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CollegeEvent>>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'WORKSHOP',
    registrationStatus: 'OPEN',
    organizer: 'Admin',
    image: ''
  });

  // --- Gallery State ---
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([
      { id: 'g1', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80', caption: 'Central Library' },
      { id: 'g2', url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80', caption: 'Science Lab' },
      { id: 'g3', url: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80', caption: 'Student Center' }
  ]);

  // --- Banner State ---
  const [bannerData, setBannerData] = useState({
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80',
      title: 'Empowering Future Leaders',
      description: 'Welcome to EduMark Institute. A world-class institution fostering innovation, academic excellence, and holistic development for a brighter tomorrow.'
  });

  // --- Handlers ---

  // Generic Image Upload Helper
  const handleImageUpload = (
      e: React.ChangeEvent<HTMLInputElement>, 
      setter: React.Dispatch<React.SetStateAction<any>>,
      field: string = 'image'
  ) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setter((prev: any) => ({ ...prev, [field]: ev.target?.result as string }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (ev) => {
            const newItem: GalleryItem = {
                id: Math.random().toString(),
                url: ev.target?.result as string,
                caption: file.name.split('.')[0]
            };
            setGalleryImages([newItem, ...galleryImages]);
        };
        reader.readAsDataURL(file);
      }
  };

  const handleDeleteGalleryImage = (id: string) => {
      if(confirm('Delete this image?')) {
          setGalleryImages(prev => prev.filter(img => img.id !== id));
      }
  };

  const handleSaveNews = () => {
      if (!newNews.title || !newNews.content) return;
      const item: ExtendedNotice = {
          id: Math.random().toString(),
          title: newNews.title!,
          content: newNews.content!,
          date: newNews.date || new Date().toISOString().split('T')[0],
          type: newNews.type || 'ADMIN',
          sender: 'Administration',
          image: newNews.image
      };
      setNewsItems([item, ...newsItems]);
      setIsNewsModalOpen(false);
      setNewNews({ title: '', content: '', date: new Date().toISOString().split('T')[0], type: 'ACADEMIC', sender: 'Admin', image: '' });
  };

  const handleSaveEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    const event: CollegeEvent = {
        id: Math.random().toString(),
        title: newEvent.title!,
        description: newEvent.description || '',
        date: newEvent.date!,
        time: newEvent.time || '09:00 AM',
        location: newEvent.location || 'TBA',
        category: newEvent.category as any,
        registrationStatus: 'OPEN',
        organizer: 'Administration',
        image: newEvent.image || 'https://picsum.photos/seed/default/400/200'
    };
    setEvents([event, ...events]);
    setIsEventModalOpen(false);
    setNewEvent({ title: '', description: '', date: '', time: '', location: '', category: 'WORKSHOP', registrationStatus: 'OPEN', organizer: 'Admin', image: '' });
  };

  if (activeTab === 'cms') return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex justify-between items-center">
           <h2 className="text-2xl font-bold text-slate-900">Website CMS</h2>
           <Button variant="outline"><Save className="w-4 h-4 mr-2"/> Publish Changes</Button>
       </div>
       
       <div className="flex gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
          {['banner', 'news', 'events', 'gallery'].map(tab => (
             <button key={tab} onClick={() => setActiveCmsTab(tab)} className={`px-4 py-2 capitalize font-medium transition-colors whitespace-nowrap ${activeCmsTab === tab ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>{tab}</button>
          ))}
       </div>
       
       {/* --- BANNER TAB --- */}
       {activeCmsTab === 'banner' && (
          <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-slate-900 flex items-center"><Layout className="w-5 h-5 mr-2 text-indigo-600"/> Homepage Banner Configuration</h3>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">1920 x 1080px recommended</span>
                  </div>
                  
                  {/* Preview Section */}
                  <div className="relative w-full h-64 rounded-xl overflow-hidden mb-6 group border border-slate-200 bg-slate-900">
                      <img src={bannerData.image} alt="Banner Preview" className="w-full h-full object-cover opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-8 text-white">
                          <h2 className="text-3xl font-bold mb-2 max-w-lg leading-tight">{bannerData.title}</h2>
                          <p className="text-sm opacity-90 max-w-md leading-relaxed">{bannerData.description}</p>
                      </div>
                      
                      {/* Upload Overlay */}
                      <label className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-slate-900 px-4 py-2 rounded-lg cursor-pointer shadow-lg font-medium text-sm transition-all flex items-center backdrop-blur-sm">
                          <UploadCloud className="w-4 h-4 mr-2"/> Change Banner Image
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setBannerData, 'image')} />
                      </label>
                  </div>

                  {/* Edit Form */}
                  <div className="grid gap-5 border-t border-slate-100 pt-5">
                      <div className="grid md:grid-cols-2 gap-5">
                          <div className="space-y-2">
                              <label className="text-sm font-semibold text-slate-700">Banner Title / Headline</label>
                              <input 
                                  type="text" 
                                  value={bannerData.title}
                                  onChange={(e) => setBannerData({...bannerData, title: e.target.value})}
                                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                  placeholder="Enter main headline..."
                              />
                          </div>
                          <div className="space-y-2">
                              <label className="text-sm font-semibold text-slate-700">Call to Action (Optional)</label>
                              <div className="flex gap-2">
                                  <input disabled value="Explore Campus" className="w-full p-2.5 border rounded-lg bg-slate-50 text-slate-500" />
                                  <input disabled value="/explore" className="w-full p-2.5 border rounded-lg bg-slate-50 text-slate-500" />
                              </div>
                          </div>
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700">Short Description</label>
                          <textarea 
                              rows={2}
                              value={bannerData.description}
                              onChange={(e) => setBannerData({...bannerData, description: e.target.value})}
                              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                              placeholder="Enter sub-text..."
                          />
                      </div>
                      <div className="flex justify-end">
                          <Button onClick={() => alert("Banner updated successfully!")} className="bg-indigo-600 hover:bg-indigo-700">
                              <Save className="w-4 h-4 mr-2"/> Save Banner Settings
                          </Button>
                      </div>
                  </div>
              </div>
          </div>
       )}
       
       {/* --- NEWS TAB --- */}
       {activeCmsTab === 'news' && (
          <div className="space-y-4">
             <div className="flex justify-end"><Button onClick={() => setIsNewsModalOpen(true)}><Plus className="w-4 h-4 mr-2"/> Add News</Button></div>
             <div className="grid gap-4">
                {newsItems.map(n => (
                    <Card key={n.id} className="flex gap-4 p-4 items-start group">
                        {n.image && (
                            <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                                <img src={n.image} alt={n.title} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">{n.title}</h3>
                                    <div className="flex gap-2 text-sm text-slate-500 mt-1">
                                        <Badge variant="neutral">{n.type}</Badge>
                                        <span>•</span>
                                        <span>{n.date}</span>
                                    </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <Button size="sm" variant="outline"><Edit className="w-3 h-3"/></Button>
                                    <Button size="sm" variant="danger"><Trash2 className="w-3 h-3"/></Button>
                                </div>
                            </div>
                            <p className="text-slate-600 text-sm mt-2 line-clamp-2">{n.content}</p>
                        </div>
                    </Card>
                ))}
             </div>
          </div>
       )}

       {/* --- EVENTS TAB --- */}
       {activeCmsTab === 'events' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                 <div>
                     <h3 className="font-bold text-indigo-900">Event Management</h3>
                     <p className="text-sm text-indigo-700">Create, edit, and categorize campus events.</p>
                 </div>
                 <Button onClick={() => setIsEventModalOpen(true)}><Plus className="w-4 h-4 mr-2"/> Add Event</Button>
             </div>
             
             <div className="grid gap-4">
                 {events.map(e => (
                    <Card key={e.id} className="flex flex-col sm:flex-row gap-4 p-4 hover:shadow-md transition-all group">
                        <div className="relative w-full sm:w-48 h-32 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                            <img src={e.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={e.title}/>
                            <div className="absolute top-2 right-2"><Badge className="bg-white/90 shadow-sm backdrop-blur">{e.category}</Badge></div>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-lg text-slate-900">{e.title}</h3>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="sm" variant="outline"><Edit className="w-4 h-4"/></Button>
                                    <Button size="sm" variant="danger"><Trash2 className="w-4 h-4"/></Button>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 mt-1 line-clamp-2">{e.description || 'No description provided.'}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-500 mt-3 font-medium">
                                <span className="flex items-center"><Calendar className="w-3 h-3 mr-1"/> {e.date}</span>
                                <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {e.time}</span>
                                <span className="flex items-center"><MapPin className="w-3 h-3 mr-1"/> {e.location}</span>
                            </div>
                        </div>
                    </Card>
                 ))}
             </div>
          </div>
       )}

       {/* --- GALLERY TAB --- */}
       {activeCmsTab === 'gallery' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
                 <p className="text-slate-500 text-sm">Manage campus photo gallery.</p>
                 <div className="relative">
                     <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleGalleryUpload} />
                     <Button variant="outline" className="pointer-events-none"><UploadCloud className="w-4 h-4 mr-2"/> Upload New Image</Button>
                 </div>
             </div>
             
             {galleryImages.length > 0 ? (
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {galleryImages.map(img => (
                         <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                             <img src={img.url} alt={img.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                                 <p className="text-white text-xs font-medium truncate mb-2">{img.caption}</p>
                                 <button 
                                    onClick={() => handleDeleteGalleryImage(img.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg self-end transition-colors"
                                 >
                                     <Trash2 className="w-4 h-4" />
                                 </button>
                             </div>
                         </div>
                     ))}
                 </div>
             ) : (
                <Card className="text-center py-16 text-slate-500 border-dashed bg-slate-50">
                    <Image className="w-16 h-16 mx-auto mb-4 opacity-20"/>
                    <h3 className="text-lg font-medium text-slate-900">Gallery Empty</h3>
                    <p>Upload photos from recent campus activities.</p>
                </Card>
             )}
          </div>
       )}

       {/* --- MODALS --- */}

       {/* Add News Modal */}
       <Modal isOpen={isNewsModalOpen} onClose={() => setIsNewsModalOpen(false)} title="Add News / Announcement">
           <div className="space-y-4">
               {/* Featured Image */}
               <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700">Featured Image (Optional)</label>
                   {newNews.image ? (
                       <div className="relative w-full h-40 rounded-lg overflow-hidden border border-slate-200 group">
                           <img src={newNews.image} alt="Preview" className="w-full h-full object-cover" />
                           <button 
                               onClick={() => setNewNews(prev => ({...prev, image: ''}))} 
                               className="absolute top-2 right-2 bg-white/80 hover:bg-white text-slate-700 p-1.5 rounded-full shadow-sm transition-all"
                           >
                               <X className="w-4 h-4" />
                           </button>
                       </div>
                   ) : (
                       <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                           <div className="flex flex-col items-center justify-center pt-5 pb-6">
                               <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                               <p className="text-xs text-slate-500">Click to upload featured image</p>
                           </div>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setNewNews)} />
                       </label>
                   )}
               </div>

               <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700">Headline</label>
                   <input className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="News Title" value={newNews.title} onChange={e => setNewNews({...newNews, title: e.target.value})} />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Category</label>
                       <select className="w-full border p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none" value={newNews.type} onChange={e => setNewNews({...newNews, type: e.target.value as any})}>
                           <option value="ACADEMIC">Academic</option>
                           <option value="ADMIN">Administrative</option>
                           <option value="EVENT">Event</option>
                           <option value="OTHER">Other</option>
                       </select>
                   </div>
                   <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Date</label>
                       <input type="date" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={newNews.date} onChange={e => setNewNews({...newNews, date: e.target.value})} />
                   </div>
               </div>

               <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700">Content</label>
                   <textarea rows={4} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="News content details..." value={newNews.content} onChange={e => setNewNews({...newNews, content: e.target.value})} />
               </div>

               <Button className="w-full mt-2" onClick={handleSaveNews} disabled={!newNews.title}>Publish News</Button>
           </div>
       </Modal>

       {/* Add Event Modal */}
       <Modal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} title="Create New Event">
           <div className="space-y-4">
               {/* Featured Image */}
               <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700">Event Banner</label>
                   {newEvent.image ? (
                       <div className="relative w-full h-40 rounded-lg overflow-hidden border border-slate-200 group">
                           <img src={newEvent.image} alt="Preview" className="w-full h-full object-cover" />
                           <button 
                               onClick={() => setNewEvent(prev => ({...prev, image: ''}))} 
                               className="absolute top-2 right-2 bg-white/80 hover:bg-white text-slate-700 p-1.5 rounded-full shadow-sm transition-all"
                           >
                               <X className="w-4 h-4" />
                           </button>
                       </div>
                   ) : (
                       <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                           <div className="flex flex-col items-center justify-center pt-5 pb-6">
                               <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                               <p className="text-xs text-slate-500">Click to upload banner (16:9)</p>
                           </div>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setNewEvent)} />
                       </label>
                   )}
               </div>

               <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700">Event Title</label>
                   <input type="text" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Annual Tech Symposium" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
               </div>

               <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Category</label>
                       <select className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none" value={newEvent.category} onChange={e => setNewEvent({...newEvent, category: e.target.value as any})}>
                           <option value="WORKSHOP">Workshop</option>
                           <option value="SEMINAR">Seminar</option>
                           <option value="CULTURAL">Cultural</option>
                           <option value="SPORTS">Sports</option>
                       </select>
                   </div>
                   <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Date</label>
                       <input type="date" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                   </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Time</label>
                       <input type="time" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Location</label>
                       <input type="text" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Main Auditorium" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} />
                   </div>
               </div>

               <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700">Description</label>
                   <textarea rows={3} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Event details..." value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})}></textarea>
               </div>

               <div className="pt-2">
                   <Button className="w-full" onClick={handleSaveEvent} disabled={!newEvent.title || !newEvent.date}>Publish Event</Button>
               </div>
           </div>
       </Modal>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <h2 className="text-2xl font-bold text-slate-900">System Settings</h2>
       <Card title="General Config">
           <div className="space-y-4">
               <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded transition-colors">
                   <span className="font-medium text-slate-700">Academic Year</span>
                   <select className="border p-2 rounded bg-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                       <option>2023-24</option>
                       <option>2024-25</option>
                   </select>
               </div>
               <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded transition-colors">
                   <span className="font-medium text-slate-700">Maintenance Mode</span>
                   <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                   </label>
               </div>
               <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded transition-colors">
                   <span className="font-medium text-slate-700">System Notifications</span>
                   <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                   </label>
               </div>
               <Button className="w-full mt-4"><Save className="w-4 h-4 mr-2"/> Save Changes</Button>
           </div>
       </Card>
    </div>
  );
};

export default AdminSystem;
