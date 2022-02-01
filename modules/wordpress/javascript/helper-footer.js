function warnMessage(event) {
	var ConfirmMessage = 'Diese Seite verlassen?';
	(event || window.event).returnValue = ConfirmMessage;
	return ConfirmMessage;
}

window.addEventListener("beforeunload", warnMessage);
