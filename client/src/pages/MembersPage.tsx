import React, { useEffect, useState } from 'react';
import { api } from '../api/axios';
import MembersList from '../components/MembersList';

const MembersPage = (props: any) => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/members').then((m) => {
      setLoading(false);
      setMembers(m.data.members);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="is-flex is-flex-direction-column is-align-items-center">
      <div className="title">Members</div>
      <MembersList members={members} />
    </div>
  );
};

export default MembersPage;
