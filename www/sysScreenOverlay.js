//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2022                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "ScreenOverlay"                                            -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysScreenOverlay"
//------------------------------------------------------------------------------

function sysScreenOverlay(FactoryRef) {
	this.FactoryRef = FactoryRef;
}


//------------------------------------------------------------------------------
//- METHOD "setupOverlay"
//------------------------------------------------------------------------------

sysScreenOverlay.prototype.setupOverlay = function(ScreenID, Attributes)
{
	if (this.FactoryRef.OverlayRefCount == 1) {
		return;
	}

	if (this.FactoryRef.OverlayRefCount == 0) {
		this.FactoryRef.OverlayRefCount = 1;
	}

	this.OverlayScreen = new sysScreen(true);

	this.OverlayScreenID = ScreenID;

	const SkeletonData = this.FactoryRef.DataSkeleton.XMLRPCResultData[ScreenID];

	const DefaultStyle = sysFactory.DefaultStyleScreenOverlay;
	const OverlayStyle = (DefaultStyle !== undefined) ? DefaultStyle : 'sysScreenOverlay col-lg-10 col-md-12';

	this.OverlayScreen.setStyle(OverlayStyle);

	//console.debug('ScreenID:%s SkeletonData:%o', ScreenID, SkeletonData);

	this.OverlayScreen.ScreenID = ScreenID;
	this.OverlayScreen.SkeletonData = SkeletonData;

	sysFactory.Screens[ScreenID] = this.OverlayScreen;

	this.OverlayScreen.CloseObject = new sysObjDiv();
	this.OverlayScreen.CloseObject.ObjectID = 'ovl_close';
	this.OverlayScreen.CloseObject.EventListeners = new Object();

	var CloseObject = new sysObjDiv();
	CloseObject.ObjectID = 'ovl_close';
	CloseObject.DOMStyle = 'btn-close';
	CloseObject.init();

	this.OverlayScreen.CloseObject.addObject(CloseObject);

	var EventConfig = new Object();
	EventConfig['Type'] = 'mousedown';
	EventConfig['Element'] = this.EventListenerClick.bind(this);
	this.OverlayScreen.CloseObject.EventListeners["closeOverlay"] = EventConfig;

	this.OverlayScreen.HierarchyRootObject.addObject(this.OverlayScreen.CloseObject);

	this.OverlayScreen.setup();

	this.processUpdate();

	this.OverlayScreen.CloseObject.processEventListener();

	this.processDataLoad(Attributes);
}


//------------------------------------------------------------------------------
//- METHOD "processDataLoad"
//------------------------------------------------------------------------------

sysScreenOverlay.prototype.processDataLoad = function(Attributes)
{
	console.debug('Attributes:%o', Attributes);

	if (Attributes !== undefined) {
		var SourceData;

		if (Attributes.SourceType == 'ScreenGlobal') {
			try {
				const ScreenObj = sysFactory.getScreenByID(Attributes.SourceScreenID);
				console.debug('ScreenObj:%o', ScreenObj);
				SourceData = ScreenObj.getGlobalVars();
			}
			catch(err) {
				console.debug('err:%s', err);
			}
		}
		else {
			SourceData = Attributes.SourceData;
		}

		const DstObjects = Attributes.DstObjects;

		console.debug('SourceData:%o DstObjects:%o', SourceData, DstObjects);

		if (Attributes.DataMapping !== undefined) {
			var NewData = new Object();
			for (DataKey in Attributes.DataMapping) {
				var NewKey = DataKey;
				if (DataKey in SourceData) {
					NewKey = Attributes.DataMapping[DataKey];
				}
				NewData[NewKey] = SourceData[DataKey];
			}
			SourceData = NewData;
		}

		for (Index in DstObjects) {
			const SetData = SourceData;
			console.debug('SetData:%o', SetData);

			const DstObjectID = DstObjects[Index] + '__overlay';
			console.debug('DstObjectID:%s', DstObjectID);
			//console.debug('HierarchyRootObject:%o', this.OverlayScreen.HierarchyRootObject);

			try {
				DstObject = this.OverlayScreen.HierarchyRootObject.getObjectByID(DstObjectID);
				DstObject.RuntimeSetDataFunc(
					this.prepareSetData(SetData, DstObject)
				);
			}
			catch(err) {
				console.debug('DstObjectID:%s err:%s', DstObjectID, err);
			}

			//console.debug('ObjectID:%s RowData:%o', DstObjectID, RowData);

		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "prepareSetData"
//------------------------------------------------------------------------------

sysScreenOverlay.prototype.prepareSetData = function(DataObj, DstObject)
{
	const InstancePrefix = DstObject.JSONConfig.InstancePrefix;
	const OverlayPostfix = '__overlay';

	var NewData = new Object();

	for (DataKey in DataObj) {
		var NewKey;
		NewKey = (InstancePrefix !== undefined) ? InstancePrefix + DataKey : DataKey;
		NewKey = NewKey + OverlayPostfix;
		NewData[NewKey] = DataObj[DataKey];
	}
	return NewData;
}


//------------------------------------------------------------------------------
//- METHOD "processUpdate"
//------------------------------------------------------------------------------

sysScreenOverlay.prototype.processUpdate = function()
{
	this.OverlayScreen.HierarchyRootObject.processUpdate();
}


//------------------------------------------------------------------------------
//- METHOD "EventListenerClick"
//------------------------------------------------------------------------------

sysScreenOverlay.prototype.EventListenerClick = function()
{
	this.OverlayScreen.HierarchyRootObject.remove();
	delete sysFactory.Screens[this.OverlayScreenID];
	this.FactoryRef.OverlayRefCount = 0;
}
