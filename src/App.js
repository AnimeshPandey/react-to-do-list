import React, { Component } from "react";
import sortBy from "sort-by";
import { CSSTransitionGroup } from "react-transition-group";
import SwipeableViews from "react-swipeable-views";

//import { makeStyles, withStyles } from "material-ui/core/styles";
import AppBar from "material-ui/AppBar";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import { Tabs, Tab } from "material-ui/Tabs";
import FloatingActionButton from "material-ui/FloatingActionButton";
import CheckIcon from "material-ui/svg-icons/action/check-circle";
import ListIcon from "material-ui/svg-icons/action/list";
import TodoIcon from "material-ui/svg-icons/action/today";
import DeleteIcon from "material-ui/svg-icons/action/delete";
import StopDeletionIcon from "material-ui/svg-icons/content/delete-sweep";

import TaskList from "./components/TaskList/TaskList";
import ConfirmDialog from "./components/ConfirmDialog/ConfirmDialog";
import If from "./components/If/If";
import "./App.css";

class App extends Component {
	constructor(props) {
		super(props);

		/**
		 * State of App Component has =>
		 * items - All list items of the app.
		 * taskIdCounter - The index of the last task added.
		 * submitDisabled - Indicates whether submit is disabled.
		 * slideIndex - The index of the tab component.
		 * dialogOpen - Visibility of the clear tasks dialog.
		 * removeMode - Indicates if the remove mode is active.
		 */

		this.state = {
			items: [],
			taskIdCounter: 0,
			submitDisabled: true,
			slideIndex: 0,
			dialogOpen: false,
			removeMode: false,
		};

		// const muiTheme = getMuiTheme({
		// 	tabs: {
		// 		backgroundColor: "red",
		// 	}
		// });
	}

	// After the App loads into the DOM,
	// fetch saved tasks and taskIdCounter from the local storage and setup state.
	componentWillMount() {
		const toDoListItems = window.localStorage.getItem("toDoListItems") || "[]";
		const taskIdCounter = window.localStorage.getItem("taskIdCounter") || 0;
		this.setState({
			items: JSON.parse(toDoListItems),
			taskIdCounter: taskIdCounter,
		});
	}

	// Add task to the To Do list.
	addTask = () => {
		const input = this.taskInput.input || {};
		const { value = "" } = input;

		if (value === "") return;

		this.setState(
			(previousState) => {
				const { items = [] } = previousState;
				const { taskIdCounter = 0 } = previousState;
				const taskId = taskIdCounter + 1;
				const newTask = {
					id: taskId,
					title: value,
					status: "To Do",
				};
				items.push(newTask);
				return {
					items: items.sort(sortBy("id")),
					submitDisabled: true,
					taskIdCounter: taskId,
				};
			},
			function stateUpdateComplete() {
				this.taskInput.input.value = "";
				this.updateLocalStorageItems(this.state.items);
				this.updateTaskCounter(this.state.taskIdCounter);
			}
		);
	};

	handleUpdateTask = (task) => {
		this.setState(
			(previousState) => {
				const { items } = previousState;
				const filteredItems = items.filter((item) => item.id !== task.id);
				task.status = task.status === "To Do" ? "Done" : "To Do";
				filteredItems.push(task);
				return {
					items: filteredItems.sort(sortBy("id")),
				};
			},
			function stateUpdateComplete() {
				this.updateLocalStorageItems(this.state.items);
			}
		);
	};

	handleRemoveTask = (task) => {
		this.setState(
			(previousState) => {
				const { items } = previousState;
				const filteredItems = items.filter((item) => item.id !== task.id);
				return {
					items: filteredItems.sort(sortBy("id")),
				};
			},
			function stateUpdateComplete() {
				this.updateLocalStorageItems(this.state.items);
			}
		);
	};

	handleTextFieldChange = (event, value) => {
		if (value.length > 0 && this.state.submitDisabled) {
			this.setState({ submitDisabled: false });
		} else if (value.length === 0 && !this.state.submitDisabled) {
			this.setState({ submitDisabled: true });
		}
	};

	// Save items to local storage.
	updateLocalStorageItems = (items) => {
		window.localStorage.setItem("toDoListItems", JSON.stringify(items));
	};

	// Update current taskId into local storage.
	updateTaskCounter = (taskCounter) => {
		window.localStorage.setItem("taskIdCounter", taskCounter);
	};

	// Handle the tab change.
	handleTabChange = (value) => {
		this.setState(
			{
				slideIndex: value,
			},
			function stateUpdateComplete() {
				// Fix scroll in swipe transitions
				window.scrollTo(0, 0);
			}
		);
	};

	// Enable the remove task mode
	enableRemoveMode = () => {
		if (!this.state.removeMode) {
			this.setState({ removeMode: true });
		}
	};

	// Disable the remove task mode
	disableRemoveMode = () => {
		if (this.state.removeMode) {
			this.setState({ removeMode: false });
		}
	};

	// Remove all tasks from the App.
	clearTasks = () => {
		this.handleDialogClose();
		this.setState(
			{ removeMode: false, items: [] },
			function stateUpdateComplete() {
				// Update local storage
				this.updateLocalStorageItems(this.state.items);
			}
		);
	};

	// Open the clear tasks dialog.
	handleDialogOpen = () => {
		this.setState({ dialogOpen: true });
	};

	// Close the clear task dialog.
	handleDialogClose = () => {
		this.setState({ dialogOpen: false });
	};

	// Handle the enter key pressed under the add task input.
	keyPress = (e) => {
		// If Enter key
		if (e.keyCode === 13) {
			// Call method to add the task if not empty
			this.addTask();
			// put the login here
		}
	};

	render() {
		const { items = [] } = this.state;
		const taskLists = [
			{
				title: "To Do",
				items: items.filter((item) => item.status === "To Do"),
				icon: <TodoIcon />,
			},
			{
				title: "Done",
				items: items.filter((item) => item.status === "Done"),
				icon: <CheckIcon />,
			},
			{ title: "All", items, icon: <ListIcon /> },
		];

		return (
			<MuiThemeProvider>
				<div className='App'>
					{/* Clear Tasks Confirmation Dialog */}
					<ConfirmDialog
						title='Clear All Tasks'
						message={"Are you sure you want to remove all tasks from the App?"}
						onCancel={this.handleDialogClose}
						onConfirm={this.clearTasks}
						open={this.state.dialogOpen}
					/>
					{/* App Header */}
					<AppBar
						title={<span style={{ color: "white" }}>To-Do List</span>}
						showMenuIconButton={false}
						style={{
							backgroundColor: "rgb(40, 40, 40)",
							position: "fixed",
							zIndex: 9999,
							width: "36%",
							marginLeft: "32%",
						}}
					/>
					{/* App Container */}
					<div className='App-container'>
						<div
							style={{
								position: "fixed",
								width: "36%",
								paddingTop: 64,
								zIndex: 8888,
								backgroundColor: "white",
								paddingLeft: "32%",
							}}>
							{/* Add task here */}
							<TextField
								hintText='Type task'
								floatingLabelText='Add Task'
								ref={(taskInput) => {
									this.taskInput = taskInput;
								}}
								disabled={this.state.removeMode}
								style={{ margin: 10, width: "60%", maxWidth: 300 }}
								onChange={this.handleTextFieldChange}
								onKeyDown={this.keyPress}
							/>
							{/* Submit task */}
							<RaisedButton
								style={{ margin: 10, width: "30%", maxWidth: 56 }}
								label='Create'
								onClick={this.addTask}
								disabled={this.state.submitDisabled}
							/>
							{/* Tabs to switch task category */}
							<Tabs
								onChange={this.handleTabChange}
								value={this.state.slideIndex}>
								{taskLists.map((taskList, index) => (
									<Tab
										className='statusTabs'
										key={index}
										value={index}
										icon={taskList.icon}
										label={
											<div>
												{taskList.title} (
												{taskList.title !== "All"
													? taskList.items.length
													: items.length}
												)
											</div>
										}
									/>
								))}
							</Tabs>
						</div>
						<div className='app-separator'>-</div>
						<CSSTransitionGroup
							transitionName='remove-mode-animation'
							transitionEnterTimeout={300}
							transitionLeaveTimeout={300}>
							{this.state.removeMode && (
								<div className='remove-mode'>
									<RaisedButton
										label='Delete All Tasks'
										secondary={true}
										onClick={this.handleDialogOpen}
									/>
								</div>
							)}
							<div className='app-lists'>
								<SwipeableViews
									index={this.state.slideIndex}
									onChangeIndex={this.handleTabChange}
									style={{ width: "100%" }}>
									{taskLists.map((taskList, index) => (
										<div className='swipeable-views' key={index}>
											<TaskList
												title={taskList.title}
												items={taskList.items}
												updateTask={this.handleUpdateTask}
												removeTask={this.handleRemoveTask}
												removeMode={this.state.removeMode}
											/>
										</div>
									))}
								</SwipeableViews>
							</div>
						</CSSTransitionGroup>
					</div>
					<div className='enable-remove-mode'>
						<If test={!this.state.removeMode}>
							<FloatingActionButton
								className='statusTabs'
								onClick={this.enableRemoveMode}>
								<DeleteIcon />
							</FloatingActionButton>
						</If>
						<If test={this.state.removeMode}>
							<FloatingActionButton
								secondary={true}
								onClick={this.disableRemoveMode}>
								<StopDeletionIcon />
							</FloatingActionButton>
						</If>
					</div>
				</div>
			</MuiThemeProvider>
		);
	}
}

export default App;
