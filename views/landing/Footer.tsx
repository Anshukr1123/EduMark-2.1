
import React from 'react';
import { MOCK_COLLEGE_INFO } from '../../constants';
import { GraduationCap, MapPin, Phone, Mail, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-slate-900 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
                <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center gap-2 text-white mb-6">
                        <GraduationCap className="w-8 h-8 text-indigo-400" />
                        <span className="text-2xl font-bold">EduMark</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        Empowering the next generation of leaders through excellence in education and innovation.
                    </p>
                    <div className="flex gap-4">
                        {[Instagram, Twitter, Facebook, Linkedin].map((Icon, i) => (
                            <a key={i} href="#" className="p-2 bg-slate-800 rounded-full hover:bg-indigo-600 hover:text-white transition-colors">
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>
                
                <div>
                    <h4 className="text-white font-bold mb-6">Quick Links</h4>
                    <ul className="space-y-3 text-sm">
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">Admissions</a></li>
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">Academic Calendar</a></li>
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">Exam Results</a></li>
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">Alumni Network</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6">Resources</h4>
                    <ul className="space-y-3 text-sm">
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">Student Portal</a></li>
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">Faculty Login</a></li>
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">Library</a></li>
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">IT Support</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6">Contact Us</h4>
                    <ul className="space-y-4 text-sm">
                        <li className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-indigo-400 shrink-0" />
                            <span>{MOCK_COLLEGE_INFO.address}</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-indigo-400 shrink-0" />
                            <span>{MOCK_COLLEGE_INFO.contact}</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-indigo-400 shrink-0" />
                            <span>{MOCK_COLLEGE_INFO.email}</span>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                <p>© 2024 EduMark Institute of Technology. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-white">Privacy Policy</a>
                    <a href="#" className="hover:text-white">Terms of Service</a>
                    <a href="#" className="hover:text-white">Cookie Policy</a>
                </div>
            </div>
        </div>
    </footer>
  );
};
