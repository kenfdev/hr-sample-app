import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { api } from '../api/axios';
import { Member } from '../models/member';
import MemberDetail, { FormModel } from '../components/MemberDetail';
import styled from 'styled-components';

const MemberDetailPage: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();

  const [member, setMember] = useState<Member>();
  const [editableFields, setEditableFields] = useState<Set<string>>(
    new Set<string>()
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  let formModel = useRef<FormModel>({});

  useEffect(() => {
    api.get(`/members/${memberId}`).then((m) => {
      setMember(m.data.member);
      setEditableFields(new Set(m.data.editableFields));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleEdit = () => setIsEditMode(true);

  const handleCancel = () => setIsEditMode(false);

  const handleFormModelChange = (newModel: FormModel) => {
    formModel.current = newModel;
  };

  const handleSave = async () => {
    await api.patch(`/members/${memberId}`, {
      ...formModel.current,
    });
    // very dirty optimistic code X0
    setMember((m: any) => {
      return { ...m, ...formModel.current };
    });
    setIsEditMode(false);
  };

  return (
    <div className="is-flex is-flex-direction-column is-align-items-center">
      <div className="title">
        {member?.firstName} {member?.lastName}
        {member?.isLoggedInUser ? '(You)' : null}
      </div>
      <MemberDetailContainer>
        {member?.editable ? (
          <div className="has-text-right">
            {isEditMode ? (
              <>
                <button className="button mr-1 is-success" onClick={handleSave}>
                  <span>Save</span>
                </button>
                <button className="button" onClick={handleCancel}>
                  <span>Cancel</span>
                </button>
              </>
            ) : (
              <button className="button" onClick={handleEdit}>
                <span>Edit</span>
              </button>
            )}
          </div>
        ) : null}
        <MemberDetail
          member={member!}
          editableFields={editableFields}
          editMode={isEditMode}
          onChange={handleFormModelChange}
        />
      </MemberDetailContainer>
    </div>
  );
};

const MemberDetailContainer = styled.div`
  width: 60%;
`;

export default MemberDetailPage;
