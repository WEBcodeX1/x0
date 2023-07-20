//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2021                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM "IntervalHandler" Object                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- IntervalHandler Object                                                   -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysIntervalHandler"
//------------------------------------------------------------------------------

function sysIntervalHandler() {
}


//------------------------------------------------------------------------------
//- METHOD "process"
//------------------------------------------------------------------------------

sysIntervalHandler.prototype.processInterval = function(Config, ParentFormObject, XMLRPCHandler)
{
	//console.debug('::processInterval Config:%o FormObject:%o', Config, ParentFormObject);

	const CheckObjects = Config.ValidateMultiDataOnSuccess;
	const FormObject = ParentFormObject.ChildObjects[0];

	for (Index in Config.Items) {

		const IntervalConfig = Config.Items[Index];

		if (IntervalConfig.Type == 'ValidateData') {

			//console.debug('::ValidateData');

			const FormValue = ParentFormObject.getRuntimeData();
			const Length = FormValue.length;

			//console.debug('ValidateIntervalConfig Length:%s DataObjectKey:%s', Length, IntervalConfig.DataObjectKey);
			//console.debug('ValidateIntervalConfig this:%o', this);

			if (ParentFormObject.checkLengthMismatch(Length, IntervalConfig.DataLength, IntervalConfig) === true) {

				const IgnoreProps = IntervalConfig.DataLengthIgnore;

				if (IgnoreProps.prefix !== undefined && FormValue.startsWith(IgnoreProps.prefix) === true) {

					const CheckArray = FormObject[IntervalConfig.DataObjectKey];

					// --> START UGLY, must be fixed in setValidateStyle()
					if (CheckArray.includes(FormValue) == 0) {
						ParentFormObject.setValidateStyle(-1);
					}
					else {
						ParentFormObject.setValidateStyle(0);
					}
					// --> END UGLY

					IntervalConfig['FormfieldValue'] = FormValue;

					if (IntervalConfig.ServiceURL !== undefined) {
						ParentFormObject.reset();
						const Handler = new XMLRPCHandler(IntervalConfig, ParentFormObject);
						Handler.callService();
					}
				}
			}
		}

		if (IntervalConfig.Type == 'ValidateMultiData') {

			//console.debug('::ValidateMultiData');

			const MultiData = IntervalConfig.Items;
			const FormValue = ParentFormObject.getRuntimeData();
			const Length = FormValue.length;

			for (Index in MultiData) {

				MultiDataItem = MultiData[Index];

				//console.debug('Multidata Item:%o', MultiDataItem);

				if (ParentFormObject.checkLengthMismatch(Length, MultiDataItem.DataLength, MultiDataItem) === true) {
					try {
						const CheckArray = FormObject[MultiDataItem.DataObjectKey];

						if (CheckArray.includes(FormValue) > 0) {
							const DstObject = sysFactory.getObjectByID(MultiDataItem.OnMatchDstObject);
							DstObject.ParentObject.setValue(FormValue);
							MultiDataItem['FormfieldValue'] = FormValue;
							const Handler = new XMLRPCHandler(MultiDataItem, ParentFormObject);
							Handler.callService();
						}
						else if (MultiDataItem.ResetOnFailure === true){
							ParentFormObject.reset();
							ParentFormObject.focus();
						}
					}
					catch(err) {
						console.debug('Multidata Exception:%s', err);
					}
				}
			}
		}

		if (IntervalConfig.Type == 'ValidateLength') {

			//console.debug('::ValidateLength');

			const Length = IntervalConfig.DataLength;
			const FormValue = ParentFormObject.getRuntimeData();
			const FormLength = FormValue.length;

			//console.debug('::ValidateLength FormObject:%o Length:%s FormValue:%s FormLength:%s', FormObject, Length, FormValue, FormLength);

			if (ParentFormObject.checkLengthMismatch(FormLength, Length, IntervalConfig) == true) {

				const IgnoreProps = IntervalConfig.DataLengthIgnore;

				if (IgnoreProps.prefix !== undefined && FormValue.startsWith(IgnoreProps.prefix) == true) {
					const DstObject = sysFactory.getObjectByID(IntervalConfig.DstObject);
					DstObject.ParentObject.setValue(FormValue);
					//DstObject.setValue(FormObject.ValidateLengthString);
					console.debug('::ValidateLength DstObject:%o', DstObject);

					if (IgnoreProps.reset == true) {
						ParentFormObject.reset();
						ParentFormObject.focus();
					}
				}
			}
		}

		if (IntervalConfig.Type == 'MatchTableColumn') {

			const FormValue = ParentFormObject.getRuntimeData();
			const Length = FormValue.length;

			//console.debug('MatchTableColumn FormValue:%s Length:%s', FormValue, Length);

			if (ParentFormObject.checkLengthMismatch(Length, IntervalConfig.DataLength, IntervalConfig) == true) {

				const DstObject = sysFactory.getObjectByID(IntervalConfig.DstObjectID);
				const DstObjectColumn = IntervalConfig.DstObjectColumn;
				IntervalConfig['FormfieldValue'] = FormValue;

				DstObject.checkColumnValueSetStyle(IntervalConfig);

				const ActivateObjProps = IntervalConfig.ActivateObjProperties;

				if (ActivateObjProps !== undefined) {
					const CheckObjectData = DstObject.getObjectData();
					//console.debug('::MatchTableColumn CheckObjectData:%o', CheckObjectData);
					const CheckRowCount = CheckObjectData.length;
					var MatchRowsCount = 0;
					for (Index in CheckObjectData) {
						const Row = CheckObjectData[Index];
						if (Row[ActivateObjProps.ColumnID] == ActivateObjProps.ColumnValue) {
							MatchRowsCount++;
						}
					}
					//console.debug('Table Rows:%s MatchRows:%s', CheckRowCount, MatchRowsCount);

					const ActivateObject = sysFactory.getObjectByID(ActivateObjProps.ObjectID);

					if (CheckRowCount == MatchRowsCount) {
						ActivateObject.enable();
					}
				}
				if (IntervalConfig.ResetOnSuccess === true) {
					ParentFormObject.reset();
					ParentFormObject.focus();
				}
			}
		}

		try {
			if (CheckObjects !== undefined) {

				var CheckCount = 0;

				for (Index in CheckObjects.CheckObjects) {
					const CheckObject = sysFactory.getObjectByID(CheckObjects.CheckObjects[Index]);
					//console.debug('::CheckObject Object:%o', CheckObject);
					const ObjectData = CheckObject.ParentObject.getObjectData();
					//console.debug('::CheckObjects ObjectData:%o', ObjectData);
					if (ObjectData.length > 0) { CheckCount++; }
				}

				if (CheckCount == CheckObjects.CheckObjects.length) {
					const ActivateObject = sysFactory.getObjectByID(CheckObjects.ActivateObject);
					//console.debug('::CheckObjects ActivateObject:%o', ActivateObject);
					ActivateObject.enable();
				}
			}
		}
		catch(err) {
		}

		ParentFormObject.focus();

	}

	//console.debug('::processInterval setTimeout Interval:%s', IntervalConfig.Interval);

	setTimeout(ParentFormObject.processInterval, Config.Interval, Config, ParentFormObject, XMLRPCHandler);

}
