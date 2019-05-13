import { STATUS, Story } from "./JiraInterfaces";
import React from "react";
import Avatars from "./Avatars";

interface StoryCardState {
  activeMenu: boolean;
}
interface StoryProps {
  story: Story;
  selectedAvatars: string[];
  transitionStory: (statusId: string, storyId: string) => void;
}
class StoryCard extends React.Component<StoryProps> {
  state: Readonly<StoryCardState> = {
    activeMenu: false
  };
  onMenuToggle = () => {
    this.setState({ activeMenu: !this.state.activeMenu });
  };
  render() {
    const { story, selectedAvatars } = this.props;
    const epicColor =
      (story.fields.epic && story.fields.epic.color.key) || "none";
    return (
      <li className="story" key={story.id}>
        <div
          className={
            "story-menu-toggle" + (this.state.activeMenu ? " open" : "")
          }
          onClick={() => this.onMenuToggle()}
        >
          ...
        </div>
        <ul className={"story-menu" + (this.state.activeMenu ? " open" : "")}>
          <li onClick={() => this.props.transitionStory(STATUS.todo, story.id)}>
            To-do
          </li>
          <li
            onClick={() =>
              this.props.transitionStory(STATUS.inProgress, story.id)
            }
          >
            In Progress
          </li>
          <li onClick={() => this.props.transitionStory(STATUS.done, story.id)}>
            Done
          </li>
        </ul>
        <section className="story-summary-section">
          <p className="summary">{story.fields.summary}</p>
          {story.fields.epic && (
            <p className="epic">
              <span className={epicColor + " epic-label"}>
                {story.fields.epic.name}
              </span>
            </p>
          )}
        </section>
        <section className="avatars">
          {Object.keys(story.fields.subtasks).length ? (
            <Avatars
              subtasks={story.fields.subtasks}
              selectedAvatars={selectedAvatars}
            />
          ) : (
            <img
              alt="assignee avatar"
              className="avatar"
              src={
                story.fields.assignee &&
                story.fields.assignee.avatarUrls["32x32"]
              }
            />
          )}
        </section>
        <section className="story-details">
          <span className="issueid">{story.key}</span>
          <img
            className="priority"
            alt="priority icon"
            src={story.fields.priority.iconUrl}
          />
          <span className="storypoints">{story.fields.customfield_10806}</span>
        </section>
      </li>
    );
  }
}

export default StoryCard;

// // attempt to get 'click outside to deselect menu' working
// function ClickOutside({ children, onClick }: { children: any; onClick: any }) {
//   const refs = React.Children.map(children, () => React.createRef());
//   const handleClick = (e: any) => {
//     const isOutside = refs.every((ref: any) => {
//       return ref.current && !ref.current.contains(e.target);
//     });
//     if (isOutside) {
//       onClick();
//     }
//   };
//
//   useEffect(() => {
//     document.addEventListener("click", handleClick);
//
//     return function() {
//       document.removeEventListener("click", handleClick);
//     };
//   });
//
//   return React.Children.map(children, (element, idx) =>
//     React.cloneElement(element, { ref: refs[idx] })
//   );
// }