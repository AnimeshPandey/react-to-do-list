import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import '../../App.css';

const propTypes = {
	title: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired,
	open: PropTypes.bool.isRequired,
	onCancel: PropTypes.func.isRequired,
	onConfirm: PropTypes.func.isRequired,
};

//?? Represents a material UI based Confirm Dialog.
// props - The props that were defined by the caller of this component.
// props.title - The message to be displayed by the dialog.
// props.open - The visibility of the dialog.
// props.onCancel - The callback to execute when the user hits the cancel button.
// props.onConfirm - The callback to execute when the user hits the confirm button.

function ConfirmDialog(props) {

	// Confirm Dialog buttons
	const dialogActions = [
		<FlatButton
			label="Cancel"
			className="confirm-dialog"
			onClick={props.onCancel}
		/>,
		<FlatButton
			label="Confirm"
			backgroundColor="#FF9584"
			hoverColor="#FF583D"
			className="confirm-dialog"
			onClick={props.onConfirm}
		/>,
	];

	return (
		<div>
			<Dialog
				title={props.title}
				actions={dialogActions}
				modal={true}
				open={props.open}
			>
				{props.message}
			</Dialog>
		</div>
	);
}

// Type checking the props of the component
ConfirmDialog.propTypes = propTypes;

export default ConfirmDialog;