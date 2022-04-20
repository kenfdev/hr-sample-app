import React, { useRef, useState } from 'react';
import { useParams } from 'react-router';
import MemberDetail, { FormModel } from '../components/MemberDetail';
import styled from 'styled-components';
import { gql, useMutation, useQuery } from '@apollo/client';

export const SHOW_MEMBER_DETAIL = gql`
  query ShowMemberDetail($memberId: ID!) {
    showMemberDetail(id: $memberId) {
      editableFields
      member {
        id
        avatar
        firstName
        lastName
        age
        salary
        department {
          id
          name
        }
        joinedAt
        phoneNumber
        email
        pr
        editable
        isLoggedInUser
      }
    }
  }
`;

const EDIT_MEMBER_DETAIL = gql`
  mutation EditMemberDetail($input: EditMemberDetailInput!) {
    editMemberDetail(input: $input) {
      result
    }
  }
`;

const MemberDetailPage: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const { loading: queryLoading, data: queryData } = useQuery(
    SHOW_MEMBER_DETAIL,
    {
      variables: {
        memberId,
      },
    }
  );
  const [editMember, { loading: mutationLoading }] =
    useMutation(EDIT_MEMBER_DETAIL);

  const [isEditMode, setIsEditMode] = useState(false);
  let formModel = useRef<FormModel>({});

  if (queryLoading || mutationLoading) {
    return <div>Loading...</div>;
  }

  const handleEdit = () => setIsEditMode(true);

  const handleCancel = () => setIsEditMode(false);

  const handleFormModelChange = (newModel: FormModel) => {
    formModel.current = newModel;
  };

  const handleSave = async () => {
    await editMember({
      variables: {
        input: {
          id: memberId,
          firstName: formModel.current.firstName,
          lastName: formModel.current.lastName,
          age: formModel.current.age,
          salary: formModel.current.salary,
          phoneNumber: formModel.current.phoneNumber,
          email: formModel.current.email,
          pr: formModel.current.pr,
        },
      },
      refetchQueries: [SHOW_MEMBER_DETAIL],
    });
    setIsEditMode(false);
  };

  const { member, editableFields } = queryData.showMemberDetail;

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
          editableFields={new Set(editableFields)}
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
