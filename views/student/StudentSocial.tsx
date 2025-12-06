
import React from 'react';
import { User, CollegeEvent, Notice, Message, SupportTicket, AttendanceRecord } from '../../types';
import StudentCalendar from './social/StudentCalendar';
import StudentEvents from './social/StudentEvents';
import StudentMessages from './social/StudentMessages';
import StudentNotices from './social/StudentNotices';
import StudentSupport from './social/StudentSupport';

interface StudentSocialProps {
  activeTab: string;
  user: User;
  events: CollegeEvent[];
  notices: Notice[];
  messages: Message[];
  tickets: SupportTicket[];
  history: AttendanceRecord[];
  onRegister: (id: string) => void;
}

const StudentSocial: React.FC<StudentSocialProps> = ({ activeTab, user, events, notices, messages, tickets, history, onRegister }) => {
  return (
    <>
      {activeTab === 'calendar' && <StudentCalendar events={events} history={history} onRegister={onRegister} />}
      {activeTab === 'events' && <StudentEvents events={events} onRegister={onRegister} />}
      {activeTab === 'messages' && <StudentMessages messages={messages} />}
      {activeTab === 'notices' && <StudentNotices notices={notices} />}
      {activeTab === 'support' && <StudentSupport tickets={tickets} />}
    </>
  );
};

export default StudentSocial;
