import { STATUS, SubTask } from "./JiraInterfaces";
import groupBy from "lodash.groupby";
import React from "react";

interface AvatarsProps {
  subtasks: SubTask[];
  selectAvatar?: (e: React.MouseEvent<HTMLElement>, name: string) => void;
  selectedAvatars?: string[];
}
const Avatars = ({ subtasks, selectAvatar, selectedAvatars }: AvatarsProps) => {
  const groupedSubtasks = groupBy(
    subtasks,
    (subtask: SubTask) =>
      subtask.fields.assignee && subtask.fields.assignee.avatarUrls["48x48"]
  );
  const teamMembers = Object.keys(groupedSubtasks).map((key: string) => ({
    assignee: groupedSubtasks[key][0].fields.assignee || null,
    subtasks: groupedSubtasks[key]
  }));
  return (
    <div>
      {teamMembers
        .sort((a, b) => {
          if (!a.assignee || !b.assignee) return -1;
          if (a.assignee.displayName < b.assignee.displayName) return -1;
          if (a.assignee.displayName > b.assignee.displayName) return 1;
          return 0;
        })
        .map((teamMember, index) => {
          return (
            <div
              key={index}
              className={
                selectedAvatars &&
                teamMember.assignee &&
                selectedAvatars.includes(teamMember.assignee.displayName)
                  ? "avatar-with-count selected"
                  : "avatar-with-count"
              }
              onClick={e =>
                selectAvatar &&
                teamMember.assignee &&
                selectAvatar(e, teamMember.assignee.displayName)
              }
            >
              {teamMember.assignee === null ? (
                <UnassignedAvatar />
              ) : (
                <img
                  title={teamMember.assignee.displayName}
                  key={index}
                  alt="assignee avatar"
                  className="avatar"
                  src={teamMember.assignee.avatarUrls["48x48"]}
                />
              )}
              <span>
                {
                  teamMember.subtasks.filter((subtask: SubTask) =>
                    notDone(subtask)
                  ).length
                }
              </span>
            </div>
          );
        })}
    </div>
  );
};

export default Avatars;

const UnassignedAvatar = () => {
  return (
    <svg
      viewBox="0 0 128 128"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      className="avatar-unassigned"
    >
      <g className="sc-fNHLbd jTnqDb">
        <circle cx="64" cy="64" r="64" />
        <g>
          <path d="M103,102.1388 C93.094,111.92 79.3504,118 64.1638,118 C48.8056,118 34.9294,111.768 25,101.7892 L25,95.2 C25,86.8096 31.981,80 40.6,80 L87.4,80 C96.019,80 103,86.8096 103,95.2 L103,102.1388 Z" />
          <path d="M63.9961647,24 C51.2938136,24 41,34.2938136 41,46.9961647 C41,59.7061864 51.2938136,70 63.9961647,70 C76.6985159,70 87,59.7061864 87,46.9961647 C87,34.2938136 76.6985159,24 63.9961647,24" />
        </g>
      </g>
    </svg>
  );
};

function notDone(subtask: SubTask) {
  return (
    subtask.fields.status.id !== STATUS.done &&
    subtask.fields.status.id !== STATUS.closed
  );
}
