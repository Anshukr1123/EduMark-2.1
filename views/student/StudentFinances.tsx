
import React from 'react';
import { User, FeeRecord, PlacementJob, ServiceRequest } from '../../types';
import StudentFees from './finances/StudentFees';
import StudentPlacements from './finances/StudentPlacements';
import StudentServices from './finances/StudentServices';

interface StudentFinancesProps {
  activeTab: string;
  user: User;
  fees: FeeRecord[];
  setFees: React.Dispatch<React.SetStateAction<FeeRecord[]>>;
  jobs: PlacementJob[];
  serviceRequests: ServiceRequest[];
}

const StudentFinances: React.FC<StudentFinancesProps> = ({ activeTab, user, fees, setFees, jobs, serviceRequests }) => {
  return (
    <>
      {activeTab === 'fees' && <StudentFees user={user} fees={fees} setFees={setFees} />}
      {activeTab === 'placements' && <StudentPlacements jobs={jobs} />}
      {activeTab === 'services' && <StudentServices serviceRequests={serviceRequests} />}
    </>
  );
};

export default StudentFinances;
