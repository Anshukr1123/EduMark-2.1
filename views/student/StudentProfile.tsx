
import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { Card, Button, Badge } from '../../components/UIComponents';
import { User as UserIcon, Mail, Phone, MapPin, Save, Camera, Calendar, Droplet, Clock, Briefcase, GraduationCap, TrendingUp, AlertTriangle, Shield, Edit2, X, Plus, Trash2, Award, Github, Linkedin, Globe } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface StudentProfileProps {
  user: User;
  onShowToast?: (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ user, onShowToast }) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Initial state with defaults
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

  const [profileData, setProfileData] = useState(initialState);
  // Backup state to revert changes on Cancel
  const [displayData, setDisplayData] = useState(initialState);
  const [isSaving, setIsSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  // Load from local storage on mount to simulate persistence
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
    
    // Simulate API/Cloud delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save to local storage
    localStorage.setItem(`profile_${user.id}`, JSON.stringify(profileData));
    
    setDisplayData(profileData);
    setIsSaving(false);
    setIsEditingProfile(false);
    
    if (onShowToast) {
        onShowToast("Profile Updated", "Your changes have been saved successfully.", "success");
    }
  };

  const handleCancel = () => {
      setIsEditingProfile(false);
      setProfileData(displayData);
  };

  // Calculate Profile Completion
  const fields = Object.values(displayData);
  const filledFields = fields.filter(f => f && f.toString().length > 0).length;
  const completionRate = Math.round((filledFields / fields.length) * 100);

  // Mock Attendance Data for the Graph
  const attendanceData = [
    { name: 'Present', value: 85, color: '#4ade80' },
    { name: 'Absent', value: 15, color: '#f87171' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">My Profile</h2>
            <p className="text-slate-500 text-sm">Manage your personal information and preferences.</p>
          </div>
          <div className="flex gap-3">
             {!isEditingProfile && (
                <Button onClick={() => setIsEditingProfile(true)}>
                    <Edit2 className="w-4 h-4 mr-2"/> Edit Profile
                </Button>
             )}
          </div>
       </div>

       <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Avatar & Summary */}
          <div className="space-y-6">
              <Card className="overflow-hidden">
                 <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-24"></div>
                 <div className="flex flex-col items-center text-center p-6 -mt-12">
                    <div className="relative group mb-4">
                       <div className="h-32 w-32 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                          {profileData.avatar ? (
                             <img src={profileData.avatar} alt="Profile" className="h-full w-full object-cover" />
                          ) : (
                             <div className="h-full w-full bg-slate-100 flex items-center justify-center">
                                 <UserIcon className="h-16 w-16 text-slate-300" />
                             </div>
                          )}
                       </div>
                       {isEditingProfile && (
                          <label className="absolute bottom-0 right-0 bg-indigo-600 p-2.5 rounded-full text-white shadow-lg cursor-pointer hover:bg-indigo-700 transition-all transform hover:scale-105 border-2 border-white">
                             <Camera className="w-4 h-4" />
                             <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                          </label>
                       )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
                    <p className="text-slate-500 text-sm font-medium mb-3">Student ID: {user.id.toUpperCase()}</p>
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                       <Badge variant="neutral" className="bg-indigo-50 text-indigo-700 border-indigo-100">B.Tech {displayData.major}</Badge>
                       <Badge variant="success">Semester 5</Badge>
                    </div>

                    <div className="flex gap-4 justify-center mb-6">
                        {displayData.socials.github && <a href={`https://${displayData.socials.github}`} target="_blank" className="p-2 bg-slate-100 rounded-full hover:bg-indigo-100 hover:text-indigo-600 transition-colors"><Github className="w-4 h-4"/></a>}
                        {displayData.socials.linkedin && <a href={`https://${displayData.socials.linkedin}`} target="_blank" className="p-2 bg-slate-100 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"><Linkedin className="w-4 h-4"/></a>}
                        {displayData.socials.website && <a href={`https://${displayData.socials.website}`} target="_blank" className="p-2 bg-slate-100 rounded-full hover:bg-green-100 hover:text-green-600 transition-colors"><Globe className="w-4 h-4"/></a>}
                    </div>

                    <div className="w-full">
                        <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                            <span>Profile Completion</span>
                            <span>{completionRate}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-green-500 h-2 rounded-full transition-all duration-1000" style={{width: `${completionRate}%`}}></div>
                        </div>
                    </div>
                 </div>
                 
                 <div className="border-t border-slate-100 p-6 bg-slate-50/50">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm group">
                            <span className="text-slate-500 flex items-center"><Shield className="w-4 h-4 mr-2 text-slate-400"/> Account Status</span>
                            <span className="font-bold text-green-600 flex items-center"><div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div> Active</span>
                        </div>
                        <div className="flex items-center justify-between text-sm group">
                            <span className="text-slate-500 flex items-center"><Clock className="w-4 h-4 mr-2 text-slate-400"/> Last Login</span>
                            <span className="font-medium text-slate-700">Today, {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                    </div>
                 </div>
              </Card>

              {/* Attendance Mini Graph */}
              <Card title="Attendance Overview">
                  <div className="flex items-center justify-center h-40 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={attendanceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {attendanceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="text-center">
                              <span className="text-2xl font-bold text-slate-800">85%</span>
                              <p className="text-[10px] text-slate-400 uppercase font-bold">Overall</p>
                          </div>
                      </div>
                  </div>
              </Card>
          </div>

          {/* Right Column: Details Forms */}
          <div className="lg:col-span-2 space-y-6">
             {/* Personal & Contact Information */}
             <Card title="Personal Information">
                 {isEditingProfile ? (
                    <div className="space-y-5 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                       <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700">Bio / About</label>
                          <textarea 
                             rows={2}
                             value={profileData.bio}
                             onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                             className="block w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                             placeholder="Tell us about yourself..."
                          />
                       </div>
                       
                       <div className="grid md:grid-cols-2 gap-5">
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                             <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input 
                                   type="email" 
                                   value={profileData.email}
                                   onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                   className="block w-full rounded-lg border border-slate-300 pl-10 p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                             <div className="relative">
                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input 
                                   type="text" 
                                   value={profileData.phone}
                                   onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                   className="block w-full rounded-lg border border-slate-300 pl-10 p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                             </div>
                          </div>
                          <div className="space-y-2 md:col-span-2">
                             <label className="text-xs font-bold text-slate-500 uppercase">Address</label>
                             <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <textarea 
                                   rows={2}
                                   value={profileData.address}
                                   onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                                   className="block w-full rounded-lg border border-slate-300 pl-10 p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 uppercase">Date of Birth</label>
                             <input 
                                type="date" 
                                value={profileData.dob}
                                onChange={(e) => setProfileData({...profileData, dob: e.target.value})}
                                className="block w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 uppercase">Blood Group</label>
                             <select 
                                value={profileData.bloodGroup}
                                onChange={(e) => setProfileData({...profileData, bloodGroup: e.target.value})}
                                className="block w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                             >
                                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                                   <option key={bg} value={bg}>{bg}</option>
                                ))}
                             </select>
                          </div>
                       </div>
                    </div>
                 ) : (
                    <div className="space-y-6 mt-2">
                       <p className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                          "{displayData.bio}"
                       </p>
                       <div className="grid md:grid-cols-2 gap-y-6 gap-x-8">
                          <div>
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                             <div className="flex items-center text-slate-900 font-medium break-all">
                                <Mail className="h-4 w-4 mr-2 text-indigo-500 flex-shrink-0" /> {displayData.email}
                             </div>
                          </div>
                          <div>
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                             <div className="flex items-center text-slate-900 font-medium">
                                <Phone className="h-4 w-4 mr-2 text-indigo-500" /> {displayData.phone}
                             </div>
                          </div>
                          <div className="md:col-span-2">
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Address</p>
                             <div className="flex items-start text-slate-900 font-medium">
                                <MapPin className="h-4 w-4 mr-2 text-indigo-500 mt-0.5 flex-shrink-0" /> {displayData.address}
                             </div>
                          </div>
                          <div>
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date of Birth</p>
                             <div className="flex items-center text-slate-900 font-medium">
                                <Calendar className="h-4 w-4 mr-2 text-indigo-500" /> {new Date(displayData.dob).toLocaleDateString()}
                             </div>
                          </div>
                          <div>
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Blood Group</p>
                             <div className="flex items-center text-slate-900 font-medium">
                                <Droplet className="h-4 w-4 mr-2 text-red-500" /> {displayData.bloodGroup}
                             </div>
                          </div>
                       </div>
                    </div>
                 )}
             </Card>

             {/* Skills & Achievements - New Section */}
             <Card title="Skills & Achievements">
                 <div className="space-y-6 mt-2">
                     <div>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Skills</p>
                         <div className="flex flex-wrap gap-2">
                             {displayData.skills.map((skill, i) => (
                                 <Badge key={i} variant="neutral" className="bg-indigo-50 text-indigo-700 border-indigo-100 flex items-center">
                                     {skill}
                                     {isEditingProfile && <button onClick={() => handleRemoveSkill(skill)} className="ml-1 text-indigo-400 hover:text-indigo-900"><X className="w-3 h-3"/></button>}
                                 </Badge>
                             ))}
                             {isEditingProfile && (
                                 <div className="flex items-center gap-2">
                                     <input 
                                        className="text-xs border rounded p-1 outline-none focus:border-indigo-500" 
                                        placeholder="Add skill..." 
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                                     />
                                     <button onClick={handleAddSkill} className="bg-slate-100 p-1 rounded hover:bg-slate-200"><Plus className="w-3 h-3"/></button>
                                 </div>
                             )}
                         </div>
                     </div>
                     <div>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Achievements</p>
                         <ul className="space-y-2">
                             {displayData.achievements.map((ach, i) => (
                                 <li key={i} className="flex items-center text-sm text-slate-700">
                                     <Award className="w-4 h-4 mr-2 text-yellow-500"/> {ach}
                                 </li>
                             ))}
                         </ul>
                     </div>
                 </div>
             </Card>

             <Card title="Academic Information">
                 <div className="mt-2 grid md:grid-cols-2 gap-6">
                    <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Major</p>
                        <div className="flex items-center text-slate-900 font-medium">
                            <GraduationCap className="h-4 w-4 mr-2 text-indigo-600" /> {displayData.major}
                        </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Minor / Specialization</p>
                        <div className="flex items-center text-slate-900 font-medium">
                            <TrendingUp className="h-4 w-4 mr-2 text-indigo-600" /> {displayData.minor}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Academic Advisor</p>
                        <div className="flex items-center text-slate-900 font-medium">
                            <Briefcase className="h-4 w-4 mr-2 text-slate-400" /> {displayData.advisor}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Enrolled Since</p>
                        <div className="flex items-center text-slate-900 font-medium">
                            <Clock className="h-4 w-4 mr-2 text-slate-400" /> {displayData.admissionYear}
                        </div>
                    </div>
                 </div>
             </Card>

             <Card title="Emergency Contact">
                 {isEditingProfile ? (
                     <div className="grid md:grid-cols-2 gap-5 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                         <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 uppercase">Contact Name</label>
                             <input 
                                type="text" 
                                value={profileData.emergencyContactName}
                                onChange={(e) => setProfileData({...profileData, emergencyContactName: e.target.value})}
                                className="block w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                             />
                         </div>
                         <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 uppercase">Relation</label>
                             <input 
                                type="text" 
                                value={profileData.emergencyContactRelation}
                                onChange={(e) => setProfileData({...profileData, emergencyContactRelation: e.target.value})}
                                className="block w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                             />
                         </div>
                         <div className="space-y-2 md:col-span-2">
                             <label className="text-xs font-bold text-slate-500 uppercase">Contact Number</label>
                             <input 
                                type="text" 
                                value={profileData.emergencyContactPhone}
                                onChange={(e) => setProfileData({...profileData, emergencyContactPhone: e.target.value})}
                                className="block w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                             />
                         </div>
                     </div>
                 ) : (
                     <div className="grid md:grid-cols-2 gap-6 mt-2">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Name</p>
                            <p className="font-medium text-slate-900">{displayData.emergencyContactName} <span className="text-slate-500 text-sm">({displayData.emergencyContactRelation})</span></p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                            <div className="flex items-center text-slate-900 font-medium">
                                <AlertTriangle className="h-4 w-4 mr-2 text-red-500" /> {displayData.emergencyContactPhone}
                            </div>
                        </div>
                     </div>
                 )}
             </Card>

             {isEditingProfile && (
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 sticky bottom-0 bg-slate-50/80 backdrop-blur-sm p-4 -mx-4 -mb-4 rounded-b-xl animate-in slide-in-from-bottom-4 duration-300 z-10">
                    <Button variant="secondary" onClick={handleCancel}>
                        <X className="w-4 h-4 mr-2" /> Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} isLoading={isSaving} className="shadow-lg shadow-indigo-100">
                        <Save className="w-4 h-4 mr-2" /> Save Changes
                    </Button>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default StudentProfile;
