
import React from 'react';
import { MOCK_COLLEGE_INFO } from '../../constants';
import { Card, Badge } from '../../components/UIComponents';
import { MapPin, Phone, Mail, Globe, Award, User, Building2, Trophy, CheckCircle2 } from 'lucide-react';

const StudentCollegeInfo: React.FC = () => {
  const achievements = [
    { title: "Best Engineering College 2023", issuer: "Education Weekly" },
    { title: "Green Campus Award", issuer: "Environmental Board" },
    { title: "Excellence in Research", issuer: "National Science Foundation" }
  ];

  const facilities = [
    "State-of-the-art Robotics Lab",
    "Olympic-size Swimming Pool",
    "24/7 Digital Library Access",
    "Incubation Center for Startups"
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="relative bg-gradient-to-r from-indigo-800 to-indigo-600 rounded-2xl p-8 text-white overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 opacity-10">
           <Building2 className="w-64 h-64 -mr-10 -mt-10" />
        </div>
        <div className="relative z-10">
           <Badge className="bg-white/20 text-white border-none mb-3 backdrop-blur-sm">Est. {MOCK_COLLEGE_INFO.founded}</Badge>
           <h1 className="text-3xl md:text-4xl font-bold mb-2">{MOCK_COLLEGE_INFO.name}</h1>
           <p className="text-indigo-100 text-lg flex items-center gap-2">
             <Award className="w-5 h-5 text-yellow-400" /> {MOCK_COLLEGE_INFO.accreditation}
           </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Contact & Administration */}
        <div className="space-y-6">
           <Card title="Contact Information">
              <div className="space-y-4">
                 <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-indigo-500 mt-0.5" />
                    <div>
                       <p className="text-xs text-slate-500 font-bold uppercase">Address</p>
                       <p className="text-sm text-slate-700">{MOCK_COLLEGE_INFO.address}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-indigo-500 mt-0.5" />
                    <div>
                       <p className="text-xs text-slate-500 font-bold uppercase">Phone</p>
                       <p className="text-sm text-slate-700">{MOCK_COLLEGE_INFO.contact}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-indigo-500 mt-0.5" />
                    <div>
                       <p className="text-xs text-slate-500 font-bold uppercase">Email</p>
                       <p className="text-sm text-slate-700">{MOCK_COLLEGE_INFO.email}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-indigo-500 mt-0.5" />
                    <div>
                       <p className="text-xs text-slate-500 font-bold uppercase">Website</p>
                       <p className="text-sm text-slate-700">{MOCK_COLLEGE_INFO.website}</p>
                    </div>
                 </div>
              </div>
           </Card>

           <Card className="bg-indigo-50 border-indigo-100">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
                    <User className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-xs text-indigo-500 font-bold uppercase">Director</p>
                    <h3 className="text-base font-bold text-indigo-900">{MOCK_COLLEGE_INFO.director}</h3>
                 </div>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-indigo-200/50">
                 <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
                    <User className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-xs text-indigo-500 font-bold uppercase">Dean of Academics</p>
                    <h3 className="text-base font-bold text-indigo-900">{MOCK_COLLEGE_INFO.dean}</h3>
                 </div>
              </div>
           </Card>
        </div>

        {/* Vision & Achievements */}
        <div className="md:col-span-2 space-y-6">
           <Card title="About Us">
              <p className="text-slate-600 leading-relaxed">
                 {MOCK_COLLEGE_INFO.name} has been a pioneer in higher education since {MOCK_COLLEGE_INFO.founded}. 
                 We are committed to fostering academic excellence, innovation, and holistic development. 
                 Our campus provides a vibrant environment where students are encouraged to explore their potential 
                 and prepare for global challenges.
              </p>
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                 {facilities.map((fac, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                       <CheckCircle2 className="w-4 h-4 text-green-500" /> {fac}
                    </div>
                 ))}
              </div>
           </Card>

           <Card title="Awards & Achievements">
              <div className="grid gap-4">
                 {achievements.map((ach, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 border rounded-xl hover:shadow-sm transition-shadow">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                           <Trophy className="w-5 h-5" />
                        </div>
                        <div>
                           <h4 className="font-bold text-slate-900">{ach.title}</h4>
                           <p className="text-xs text-slate-500">{ach.issuer}</p>
                        </div>
                    </div>
                 ))}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentCollegeInfo;
