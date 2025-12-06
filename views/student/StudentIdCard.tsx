
import React, { useState } from 'react';
import { User } from '../../types';
import { Card, Button } from '../../components/UIComponents';
import { Download, Share2, RotateCw, ShieldCheck, Phone, MapPin } from 'lucide-react';
// @ts-ignore
import { jsPDF } from 'jspdf';

interface Props { user: User; }

const StudentIdCard: React.FC<Props> = ({ user }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const downloadIdCard = () => {
    const doc = new jsPDF();
    doc.setFillColor(255, 255, 255);
    doc.rect(20, 20, 100, 150, 'F');
    doc.setDrawColor(0);
    doc.rect(20, 20, 100, 150);
    doc.setFontSize(16);
    doc.text("EduMark University", 70, 40, { align: 'center' });
    doc.setFontSize(12);
    doc.text("Student Identity Card", 70, 50, { align: 'center' });
    doc.text(`Name: ${user.name}`, 30, 80);
    doc.text(`ID: ${user.id.toUpperCase()}`, 30, 90);
    doc.text(`Dept: Computer Science`, 30, 100);
    doc.save('ID_Card.pdf');
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500 py-8 perspective-1000">
      <div className="relative group perspective">
        <div 
            className={`relative w-[320px] h-[500px] transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
        >
            {/* Front Side */}
            <div className="absolute inset-0 backface-hidden w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                {/* ID Header */}
                <div className="h-32 bg-indigo-600 relative">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                        <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-md">
                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div className="text-center pt-6 text-white">
                        <h3 className="font-bold text-lg tracking-wide uppercase">EduMark University</h3>
                    </div>
                </div>

                {/* ID Body */}
                <div className="pt-20 px-6 text-center space-y-1">
                    <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                    <p className="text-indigo-600 font-bold">{user.id.toUpperCase()}</p>
                    <p className="text-sm text-slate-500">B.Tech - Computer Science</p>
                    
                    <div className="mt-3 inline-block bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        <p className="text-xs font-mono font-semibold text-slate-600 tracking-wider">Card No: 2024-{user.id.toUpperCase().replace('S', '')}-089</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-left text-xs mt-6 bg-slate-50 p-4 rounded-xl">
                        <div>
                            <p className="text-slate-400 uppercase font-bold text-[10px]">Date of Birth</p>
                            <p className="font-semibold text-slate-700">15 Jan 2003</p>
                        </div>
                        <div>
                            <p className="text-slate-400 uppercase font-bold text-[10px]">Blood Group</p>
                            <p className="font-semibold text-slate-700">O+</p>
                        </div>
                        <div>
                            <p className="text-slate-400 uppercase font-bold text-[10px]">Valid Thru</p>
                            <p className="font-semibold text-slate-700">May 2025</p>
                        </div>
                        <div>
                            <p className="text-slate-400 uppercase font-bold text-[10px]">Emergency</p>
                            <p className="font-semibold text-slate-700">555-0123</p>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-center">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${user.id}`} alt="QR" className="w-12 h-12 opacity-80" />
                    </div>
                </div>
            </div>

            {/* Back Side */}
            <div className="absolute inset-0 backface-hidden w-full h-full bg-slate-900 text-white rounded-2xl shadow-2xl overflow-hidden rotate-y-180 p-8 flex flex-col justify-between">
                <div>
                    <h3 className="text-center font-bold text-lg mb-6 border-b border-slate-700 pb-4">Terms & Details</h3>
                    <div className="space-y-4 text-sm text-slate-300">
                        <div className="flex gap-3">
                            <MapPin className="w-5 h-5 text-indigo-400 shrink-0"/>
                            <p>EduMark Campus, 42 Knowledge Park, Silicon Valley, CA 94025</p>
                        </div>
                        <div className="flex gap-3">
                            <Phone className="w-5 h-5 text-indigo-400 shrink-0"/>
                            <p>+1 (555) 987-6543 (Admin)</p>
                        </div>
                        <div className="flex gap-3">
                            <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0"/>
                            <p className="text-xs">This card is the property of EduMark University. If found, please return to the administrative office.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl text-center">
                    <img src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${user.id}&scale=3&height=10&includetext`} alt="Barcode" className="w-full h-12 object-contain" />
                    <p className="text-slate-900 text-xs font-bold mt-2">Library Access Code</p>
                </div>

                <div className="text-center text-[10px] text-slate-500">
                    <p>Dean of Student Affairs</p>
                    <div className="w-24 h-8 mx-auto mt-1 bg-white/10 rounded"></div> 
                    <p className="mt-1">Authorized Signature</p>
                </div>
            </div>
        </div>
      </div>

      <div className="flex gap-4">
         <Button onClick={() => setIsFlipped(!isFlipped)} variant="secondary">
             <RotateCw className="w-4 h-4 mr-2"/> Flip Card
         </Button>
         <Button onClick={downloadIdCard}><Download className="w-4 h-4 mr-2"/> Download PDF</Button>
      </div>
      
      <style>{`
        .perspective { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default StudentIdCard;
