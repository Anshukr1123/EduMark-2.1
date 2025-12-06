
import React from 'react';
import { Card, Button, Badge } from '../../components/UIComponents';
import { Download, FileText, CheckCircle2 } from 'lucide-react';

const StudentCertificates: React.FC = () => {
  const handleDownload = (type: string) => {
    alert(`Downloading ${type}...`);
  };

  const certificates = [
    { title: 'Bonafide Certificate', desc: 'Proof of enrollment for the current academic year.', status: 'AVAILABLE' },
    { title: 'Conduct Certificate', desc: 'Character certificate for internships/jobs.', status: 'AVAILABLE' },
    { title: 'Transfer Certificate', desc: 'Required for university transfer.', status: 'REQUEST_REQUIRED' },
    { title: 'Fee Structure', desc: 'Detailed breakdown of annual fees.', status: 'AVAILABLE' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-900">My Certificates</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {certificates.map((cert, index) => (
          <Card key={index} className="flex flex-col justify-between hover:shadow-md transition-all">
             <div>
                <div className="flex justify-between items-start">
                   <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600 mb-4">
                      <FileText className="w-6 h-6"/>
                   </div>
                   <Badge variant={cert.status === 'AVAILABLE' ? 'success' : 'warning'}>
                      {cert.status === 'AVAILABLE' ? 'Instant Download' : 'Request Needed'}
                   </Badge>
                </div>
                <h3 className="font-bold text-lg text-slate-900">{cert.title}</h3>
                <p className="text-sm text-slate-500 mt-2">{cert.desc}</p>
             </div>
             <div className="mt-6 pt-6 border-t border-slate-100">
                <Button 
                   className="w-full" 
                   variant={cert.status === 'AVAILABLE' ? 'primary' : 'outline'}
                   onClick={() => handleDownload(cert.title)}
                >
                   {cert.status === 'AVAILABLE' ? <><Download className="w-4 h-4 mr-2"/> Download PDF</> : 'Request Document'}
                </Button>
             </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentCertificates;
