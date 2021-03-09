import React from 'react';
import PropTypes from 'prop-types';
import {CSSTransitionGroup} from 'react-transition-group';
import Checkbox from 'material-ui/Checkbox';
import {List, ListItem} from 'material-ui/List';

import MobileTearSheet from "../MobileTearSheet/MobileTearSheet";
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import './TaskList.css';

const propTypes = {
	title: PropTypes.string.isRequired,
	items: PropTypes.array,
	updateTask: PropTypes.func.isRequired,
	removeTask: PropTypes.func.isRequired,
	removeMode: PropTypes.bool,
};

const defaultProps = {
	items: [],
	removeMode: [],
};

//?? Represents the column list element.
// props - The props that were defined by the caller of this component.
// props.title - The title of this column list.
// props.items - The array of tasks/items of the list.
// props.removeTask - Callback executed when user click to remove the task.
// props.updateTask - Callback executed when when user the done checkbox.
// props.removeMode=false - Indicates whether the app is in remove mode.
// Returns the component markup (stateless)

const TaskList = (props) => {
	return (
		<div className='column-list'>
			<MobileTearSheet style={{ padding: 10 }}>
				<List>
					<CSSTransitionGroup
						transitionName='task-animation'
						transitionEnterTimeout={500}
						transitionLeaveTimeout={300}>
						{props.items.map((item) => (
							<ListItem
								key={item.id + item.title}
								onClick={() =>
									props.removeMode
										? props.removeTask(item)
										: props.updateTask(item)
								}
								rightIcon={
									props.removeMode ? (
										<DeleteIcon />
									) : (
										<DeleteIcon style={{ visibility: "hidden" }} />
									)
								}>
								<Checkbox
									label={item.title}
									disabled={props.removeMode}
									checked={item.status === "Done"}
									className={item.status === "Done" ? "task-done" : ""}
								/>
							</ListItem>
						))}
					</CSSTransitionGroup>
				</List>
			</MobileTearSheet>
		</div>
	);
};

// Type checking the props of the component
TaskList.propTypes = propTypes;

// Assign default values to the optional props
TaskList.defaultProps = defaultProps;

export default TaskList;
