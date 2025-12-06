
import React from 'react';
import { User, Assignment, Subject } from '../../types';
import StudentTimetable from './academics/StudentTimetable';
import StudentAssignments from './academics/StudentAssignments';
import StudentMaterials from './academics/StudentMaterials';
import StudentCourseRegistration from './academics/StudentCourseRegistration';

interface StudentAcademicsProps {
  activeTab: string;
  user: User;
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  isOnline: boolean;
  subjects: Subject[];
}

const StudentAcademics: React.FC<StudentAcademicsProps> = ({ activeTab, user, assignments, setAssignments, isOnline, subjects }) => {
  return (
    <>
      {activeTab === 'timetable' && <StudentTimetable user={user} />}
      {activeTab === 'assignments' && <StudentAssignments assignments={assignments} setAssignments={setAssignments} />}
      {activeTab === 'materials' && <StudentMaterials isOnline={isOnline} subjects={subjects} />}
      {activeTab === 'course_registration' && <StudentCourseRegistration />}
    </>
  );
};

export default StudentAcademics;
