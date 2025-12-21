
import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { Card, Button, Badge } from '../../components/UIComponents';
import { User as UserIcon, Mail, Phone, MapPin, Save, Camera, Calendar, Droplet, Clock, Briefcase, GraduationCap, TrendingUp, AlertTriangle, Shield, Edit2, X, Plus, Trash2, Award, Github, Linkedin, Globe, BookOpen } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

interface StudentProfileProps {
  user: User;
  onShowToast?: (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ user, onShowToast }) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  const initialState = {
    email: user.email,
    phone: user.phone || '+1 (555) 000-0000',
    address: user.address || 'Campus Dorm, Block B',
    avatar: user.avatar || '',
    dob: '2003-01-15',
    bloodGroup: 'O+',
    bio: 'Computer Science student passionate about AI and Web Development.',
    admissionYear: '2021',
    advisor: 'Prof. Alan Turing',
    emergencyContactName: 'John Doe Sr.',
    emergencyContactRelation: 'Father',
    emergencyContactPhone: '+1 (555) 999-8888',
    major: 'Computer Science',
    minor: 'Data Science',
    skills: ['Python', 'React', 'Data Structures', 'Machine Learning'],
    achievements: ['Hackathon Winner 2023', 'Dean\'s List (Sem 3, 4)'],
    socials: { github: 'github.com/alice', linkedin: 'linkedin.com/in/alice', website: 'alice.dev' }
  };

  const performanceHistory = [
      { sem: 'Sem 1', gpa: 8.2 },
      { sem: 'Sem 2', gpa: 7.9 },
      { sem: 'Sem 3', gpa: 8.5 },
      { sem: 'Sem 4', gpa: 8.8 },
      { sem: 'Sem 5', gpa: 8.6 },
  ];

  const [profileData, setProfileData] = useState(initialState);
  const [displayData, setDisplayData] = useState(initialState);
  const [isSaving, setIsSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(`profile_${user.id}`);
    if (saved) {
        const parsed = JSON.parse(saved);
        setProfileData(prev => ({...prev, ...parsed}));
        setDisplayData(prev => ({...prev, ...parsed}));
    }
  }, [user.id]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setProfileData(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAddSkill = () => {
      if (newSkill && !profileData.skills.includes(newSkill)) {
          setProfileData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
          setNewSkill('');
      }
  };

  const handleRemoveSkill = (skill: string) => {
      setProfileData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    localStorage.setItem(`profile_${user.id}`, JSON.stringify(profileData));
    setDisplayData(profileData);
    setIsSaving(false);
    setIsEditingProfile(false);
    if (onShowToast) onShowToast("Profile Updated", "Your changes have been saved successfully.", "success");
  };

  const handleCancel = () => {
      setIsEditingProfile(false);
      setProfileData(displayData);
  };

  const fields = Object.values(displayData);
  const filledFields = fields.filter(f => f && f.toString().length > 0).length;
  const completionRate = Math.round((filledFields / fields.length) * 100);

  const attendanceData = [
    { name: 'Present', value: 85, color: '#4ade80' },
    { name: 'Absent', value: 15, color: '#f87171' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Detailed Student Profile</h2>
            <p className="text-slate-500 text-sm">Manage personal credentials and track academic milestones.</p>
          </div>
          {!isEditingProfile && <Button onClick={() => setIsEditingProfile(true)}><Edit2 className="w-4 h-4 mr-2"/> Edit Details</Button>}
       </div>

       <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6">
              <Card className="overflow-hidden">
                 <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-24"></div>
                 <div className="flex flex-col items-center text-center p-6 -mt-12">
                    <div className="relative group mb-4">
                       <div className="h-32 w-32 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                          {profileData.avatar ? <img src={profileData.avatar} alt="Profile" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-slate-100 flex items-center justify-center"><UserIcon className="h-16 w-16 text-slate-300" /></div>}
                       </div>
                       {isEditingProfile && (
                          <label className="absolute bottom-0 right-0 bg-indigo-600 p-2.5 rounded-full text-white shadow-lg cursor-pointer hover:bg-indigo-700 transition-all transform hover:scale-105 border-2 border-white">
                             <Camera className="w-4 h-4" /><input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                          </label>
                       )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
                    <p className="text-slate-500 text-sm font-medium mb-3">ID: {user.id.toUpperCase()}</p>
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                       <Badge variant="neutral" className="bg-indigo-50 text-indigo-700 border-indigo-100">B.Tech {displayData.major}</Badge>
                       <Badge variant="success">Semester 5</Badge>
                    </div>
                    <div className="w-full">
                        <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1"><span>Profile Completion</span><span>{completionRate}%</span></div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden"><div className="bg-green-500 h-2 rounded-full transition-all duration-1000" style={{width: `${completionRate}%`}}></div></div>
                    </div>
                 </div>
              </Card>

              <Card title="Attendance Overview">
                  <div className="flex items-center justify-center h-40 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={attendanceData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                            {attendanceData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="text-center"><span className="text-2xl font-bold text-slate-800">85%</span><p className="text-[10px] text-slate-400 uppercase font-bold">Overall</p></div>
                      </div>
                  </div>
              </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
             <Card title="GPA Progression Details">
                <div className="h-64 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceHistory}>
                            <defs>
                                <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                            <XAxis dataKey="sem" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Area type="monotone" dataKey="gpa" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorGpa)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Current CGPA</p>
                        <p className="text-2xl font-black text-indigo-600">8.42</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase">Class Rank</p>
                        <p className="text-2xl font-black text-slate-800">12 / 140</p>
                    </div>
                </div>
             </Card>

             <Card title="Personal Information">
                 {isEditingProfile ? (
                    <div className="space-y-5 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                       <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700">Bio / About</label>
                          <textarea rows={2} value={profileData.bio} onChange={(e) => setProfileData({...profileData, bio: e.target.value})} className="block w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Tell us about yourself..." />
                       </div>
                       <div className="grid md:grid-cols-2 gap-5">
                          <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Email</label><input type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} className="block w-full rounded-lg border border-slate-300 p-2 text-sm" /></div>
                          <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Phone</label><input type="text" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className="block w-full rounded-lg border border-slate-300 p-2 text-sm" /></div>
                          <div className="space-y-2 md:col-span-2"><label className="text-xs font-bold text-slate-500 uppercase">Address</label><textarea rows={2} value={profileData.address} onChange={(e) => setProfileData({...profileData, address: e.target.value})} className="block w-full rounded-lg border border-slate-300 p-2.5 text-sm" /></div>
                       </div>
                    </div>
                 ) : (
                    <div className="grid md:grid-cols-2 gap-y-6 gap-x-8 mt-2">
                       <div className="md:col-span-2 text-sm text-slate-600 italic bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">"{displayData.bio}"</div>
                       <div><p className="text-xs font-bold text-slate-400 uppercase mb-1">Email</p><div className="flex items-center text-slate-900 font-medium"><Mail className="h-4 w-4 mr-2 text-indigo-500" /> {displayData.email}</div></div>
                       <div><p className="text-xs font-bold text-slate-400 uppercase mb-1">Phone</p><div className="flex items-center text-slate-900 font-medium"><Phone className="h-4 w-4 mr-2 text-indigo-500" /> {displayData.phone}</div></div>
                       <div className="md:col-span-2"><p className="text-xs font-bold text-slate-400 uppercase mb-1">Current Address</p><div className="flex items-start text-slate-900 font-medium"><MapPin className="h-4 w-4 mr-2 text-indigo-500 mt-0.5" /> {displayData.address}</div></div>
                    </div>
                 )}
             </Card>

             <Card title="Skills & Recognition">
                 <div className="space-y-6 mt-2">
                     <div>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Technical Proficiencies</p>
                         <div className="flex flex-wrap gap-2">
                             {displayData.skills.map((skill, i) => (<Badge key={i} variant="neutral" className="bg-indigo-50 text-indigo-700 border-indigo-100">{skill}</Badge>))}
                         </div>
                     </div>
                     <div>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Academic Awards</p>
                         <ul className="grid sm:grid-cols-2 gap-3">
                             {displayData.achievements.map((ach, i) => (<li key={i} className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-700 font-medium"><Award className="w-5 h-5 text-yellow-500 shrink-0"/> {ach}</li>))}
                         </ul>
                     </div>
                 </div>
             </Card>

             {isEditingProfile && (
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 sticky bottom-0 bg-slate-50/80 backdrop-blur-sm p-4 -mx-4 -mb-4 rounded-b-xl animate-in slide-in-from-bottom-4 duration-300 z-10">
                    <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleSaveProfile} isLoading={isSaving} className="shadow-lg shadow-indigo-100"><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default StudentProfile;
