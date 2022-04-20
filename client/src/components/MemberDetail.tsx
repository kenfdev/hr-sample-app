import React, { useState } from 'react';
import { Member } from '../models/member';

export type FormModel = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  pr?: string;
  age?: number;
  salary?: number;
};

type Props = {
  member: Member;
  editMode: boolean;
  editableFields: Set<string>;
  onChange: (formModel: FormModel) => void;
};

const MemberDetail: React.FC<Props> = ({
  member,
  editMode,
  onChange,
  editableFields,
}) => {
  const [formModel, setFormModel] = useState({ ...member });

  const onFormModelChange = (field: string, value: any) => {
    setFormModel((originalModel: any) => {
      const newModel = { ...originalModel, [field]: value };
      onChange(newModel);
      return newModel;
    });
  };

  return (
    <div>
      <div className="columns">
        <div className="column is-half is-offset-one-quarter has-text-centered">
          <span className="icon mr-1">
            <i className="fas fa-user fa-2x"></i>
          </span>
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label">First Name</label>
            {editMode && editableFields.has('firstName') ? (
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Text input"
                  value={formModel.firstName}
                  onChange={(e: any) =>
                    onFormModelChange('firstName', e.target.value)
                  }
                />
              </div>
            ) : (
              <div>{member.firstName}</div>
            )}
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Last Name</label>
            {editMode && editableFields.has('lastName') ? (
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Text input"
                  value={formModel.lastName}
                  onChange={(e: any) =>
                    onFormModelChange('lastName', e.target.value)
                  }
                />
              </div>
            ) : (
              <div>{member.lastName}</div>
            )}
          </div>
        </div>
        {member.age ? (
          <div className="column">
            <div className="field">
              <label className="label">Age</label>
              {editMode && editableFields.has('age') ? (
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    placeholder="Text input"
                    value={formModel.age}
                    onChange={(e: any) =>
                      onFormModelChange('age', Number(e.target.value))
                    }
                  />
                </div>
              ) : (
                <div>{member.age}</div>
              )}
            </div>
          </div>
        ) : null}
      </div>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label">Email</label>
            {editMode && editableFields.has('email') ? (
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Text input"
                  value={formModel.email}
                  onChange={(e: any) =>
                    onFormModelChange('email', e.target.value)
                  }
                />
              </div>
            ) : (
              <div>{member.email}</div>
            )}
          </div>
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label">Phone Number</label>
            {editMode && editableFields.has('phoneNumber') ? (
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Text input"
                  value={formModel.phoneNumber}
                  onChange={(e: any) =>
                    onFormModelChange('phoneNumber', e.target.value)
                  }
                />
              </div>
            ) : (
              <div>{member.phoneNumber}</div>
            )}
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Joined At</label>
            <div>{member.joinedAt}</div>
            <div className="control">
              {/* <input className="input" type="text" placeholder="Text input"> */}
            </div>
          </div>
        </div>
      </div>
      {member.age ? (
        <div className="columns">
          <div className="column">
            <div className="field">
              <label className="label">Salary</label>
              {editMode && editableFields.has('salary') ? (
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    placeholder="Text input"
                    value={formModel.salary}
                    onChange={(e: any) =>
                      onFormModelChange('salary', Number(e.target.value))
                    }
                  />
                </div>
              ) : (
                <div>{member.salary?.toLocaleString()}</div>
              )}
            </div>
          </div>
        </div>
      ) : null}
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label">PR</label>
            {editMode && editableFields.has('pr') ? (
              <div className="control">
                <textarea
                  className="textarea"
                  placeholder="Text input"
                  value={formModel.pr}
                  onChange={(e: any) => onFormModelChange('pr', e.target.value)}
                />
              </div>
            ) : (
              <div>{member.pr}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;
