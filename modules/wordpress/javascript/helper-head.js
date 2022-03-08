function handleMessage(event) {
	var accepted_origin = 'https://domain.com';
	if (event.origin == accepted_origin) {
		//console.debug('::handleMessage Event:%o', event);
		if (event.data['task'] == 'scroll_top') {
			window.scrollTo(0,0);
		}
		if (event.data['task'] == 'resize_iframe') {
			try {
				const IFrameId = event.data['iframe_id'];
				const IFrameHeight = event.data['iframe_height']; 
				const IFrameElement = document.getElementById(IFrameId);
				if (IFrameElement !== undefined) {
					IFrameElement.height = IFrameHeight;
				}
			}
			catch(err) {
				console.debug('::handleMessage err:%s', err);
			}
		}
	} else {
		console.log('Button.scrollTop Unknown origin:%s', event.origin);
	}
}

window.addEventListener("message", handleMessage, false);
