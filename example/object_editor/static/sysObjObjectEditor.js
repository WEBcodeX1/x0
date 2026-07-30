//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "ObjectEditor"                                             -//
//-------1---------2---------3---------4---------5---------6---------7--------//

function sysObjObjectEditor() {
    this.EventListeners = new Object();
    this.ChildObjects = new Array();

    this.SelectedSystemType = 'Div';
    this.SelectedObjectID = null;
    this.DraftObjectID = null;

    this.EventListeners['EditorClick'] = {
        'Type': 'click',
        'Element': this.EventListenerClick.bind(this)
    };

    this.EventListeners['EditorInput'] = {
        'Type': 'input',
        'Element': this.EventListenerInput.bind(this)
    };

    this.EventListeners['EditorChange'] = {
        'Type': 'change',
        'Element': this.EventListenerInput.bind(this)
    };

    this.EventListeners['EditorDragStart'] = {
        'Type': 'dragstart',
        'Element': this.EventListenerDragStart.bind(this)
    };

    this.EventListeners['EditorDragOver'] = {
        'Type': 'dragover',
        'Element': this.EventListenerDragOver.bind(this)
    };

    this.EventListeners['EditorDrop'] = {
        'Type': 'drop',
        'Element': this.EventListenerDrop.bind(this)
    };
}

sysObjObjectEditor.prototype = new sysBaseObject();

sysObjObjectEditor.prototype.init = function() {
    const Attributes = (this.JSONConfig !== undefined && this.JSONConfig.Attributes !== undefined)
        ? this.JSONConfig.Attributes : {};

    this.DOMType = 'div';
    this.DOMStyle = (Attributes.Style !== undefined)
        ? Attributes.Style
        : 'container-fluid py-3';

    this.DOMValue = this.getEditorDOMTemplate();
};

sysObjObjectEditor.prototype.getEditorDOMTemplate = function() {
    return '' +
        '<div class="row g-3">' +
        '  <div class="col-md-3">' +
        '    <div class="card border border-dark border-1">' +
        '      <div class="card-header fw-bold">Main Object Bar</div>' +
        '      <div class="card-body p-2">' +
        '        <div class="mb-3">' +
        '          <div class="fw-semibold mb-1">Screen Section</div>' +
        '          <div class="d-flex gap-2 mb-2">' +
        '            <button type="button" class="btn btn-sm btn-primary" data-editor-action="add-screen">+ Screen</button>' +
        '            <button type="button" class="btn btn-sm btn-outline-danger" data-editor-action="remove-screen">- Screen</button>' +
        '          </div>' +
        '          <div id="' + this.DOMObjectID + '__screen-list" class="list-group small"></div>' +
        '        </div>' +
        '        <div>' +
        '          <div class="fw-semibold mb-1">System-Object Section</div>' +
        '          <div id="' + this.DOMObjectID + '__system-list" class="list-group small"></div>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '  <div class="col-md-4">' +
        '    <div class="card border border-dark border-1">' +
        '      <div class="card-header fw-bold">System Object Properties</div>' +
        '      <div class="card-body">' +
        '        <div class="mb-2"><label class="form-label">Type</label><input id="' + this.DOMObjectID + '__prop-type" class="form-control form-control-sm" type="text" readonly></div>' +
        '        <div class="mb-2"><label class="form-label">ObjectID</label><input id="' + this.DOMObjectID + '__prop-object-id" class="form-control form-control-sm" type="text"></div>' +
        '        <div class="mb-2"><label class="form-label">ScreenID</label><input id="' + this.DOMObjectID + '__prop-screen-id" class="form-control form-control-sm" type="text"></div>' +
        '        <div class="mb-2"><label class="form-label">Parent RefID</label><input id="' + this.DOMObjectID + '__prop-parent-id" class="form-control form-control-sm" type="text"></div>' +
        '        <div class="mb-2"><label class="form-label">Attributes (JSON)</label><textarea id="' + this.DOMObjectID + '__prop-attributes" class="form-control form-control-sm" rows="10"></textarea></div>' +
        '        <div class="d-flex gap-2">' +
        '          <button type="button" class="btn btn-sm btn-success" data-editor-action="save-object">Save</button>' +
        '          <button type="button" class="btn btn-sm btn-secondary" data-editor-action="reset-draft">Reset</button>' +
        '        </div>' +
        '        <div id="' + this.DOMObjectID + '__status" class="small text-muted mt-2"></div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '  <div class="col-md-5">' +
        '    <div class="card border border-dark border-1">' +
        '      <div class="card-header fw-bold">Workspace / Screen Canvas</div>' +
        '      <div class="card-body">' +
        '        <div id="' + this.DOMObjectID + '__canvas" class="border rounded p-2" style="min-height:420px"></div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>';
};

sysObjObjectEditor.prototype.processEventListener = function() {
    sysBaseObject.prototype.processEventListener.call(this);
    this.refreshUI();
};

sysObjObjectEditor.prototype.refreshUI = function() {
    this.renderScreenList();
    this.renderSystemObjectList();
    this.renderCanvas();
    this.loadDraftToForm();
};

sysObjObjectEditor.prototype.getSkeletonStore = function() {
    return sysFactory.DataSkeleton.XMLRPCResultData;
};

sysObjObjectEditor.prototype.getObjectStore = function() {
    return sysFactory.DataObject.XMLRPCResultData;
};

sysObjObjectEditor.prototype.getCurrentScreenID = function() {
    var screenID = sysFactory.CurrentScreenID;
    if (screenID === undefined || screenID == null) {
        const all = Object.keys(this.getSkeletonStore());
        screenID = all.length > 0 ? all[0] : null;
    }
    return screenID;
};

sysObjObjectEditor.prototype.setStatus = function(Text) {
    const El = document.getElementById(this.DOMObjectID + '__status');
    if (El !== null) {
        El.textContent = Text;
    }
};

sysObjObjectEditor.prototype.renderScreenList = function() {
    const Container = document.getElementById(this.DOMObjectID + '__screen-list');
    if (Container === null) {
        return;
    }

    const current = this.getCurrentScreenID();
    const ScreenIDs = Object.keys(this.getSkeletonStore());

    var html = '';
    for (const ScreenID of ScreenIDs) {
        const active = (ScreenID === current) ? ' active' : '';
        html += '<button type="button" class="list-group-item list-group-item-action' + active + '" data-editor-action="switch-screen" data-screen-id="' + ScreenID + '">' + ScreenID + '</button>';
    }

    Container.innerHTML = html;
};

sysObjObjectEditor.prototype.renderSystemObjectList = function() {
    const Container = document.getElementById(this.DOMObjectID + '__system-list');
    if (Container === null) {
        return;
    }

    const TypeIDs = Object.keys(sysFactory.SetupClasses).sort();
    var html = '';

    for (const TypeID of TypeIDs) {
        const active = (TypeID === this.SelectedSystemType) ? ' active' : '';
        html += '<div class="list-group-item list-group-item-action' + active + '" draggable="true" data-editor-action="select-system-type" data-system-type="' + TypeID + '">' + TypeID + '</div>';
    }

    Container.innerHTML = html;
};

sysObjObjectEditor.prototype.renderCanvas = function() {
    const Canvas = document.getElementById(this.DOMObjectID + '__canvas');
    if (Canvas === null) {
        return;
    }

    const current = this.getCurrentScreenID();
    if (current == null) {
        Canvas.innerHTML = '<div class="text-muted">No screen available.</div>';
        return;
    }

    const roots = this.getChildrenByParentRef(current, current);
    var html = '';
    html += '<div class="p-2 border rounded mb-2 bg-light" data-drop-target="1" data-screen-id="' + current + '" data-parent-id="' + current + '">';
    html += '<div class="fw-semibold mb-2">' + current + ' (root)</div>';

    if (roots.length === 0) {
        html += '<div class="small text-muted">Drop a system object here.</div>';
    }
    else {
        html += this.renderObjectNodes(current, roots, 0);
    }

    html += '</div>';

    Canvas.innerHTML = html;
};

sysObjObjectEditor.prototype.renderObjectNodes = function(ScreenID, nodes, level) {
    var html = '';

    for (const NodeID of nodes) {
        const selected = (NodeID === this.SelectedObjectID) ? ' border-primary' : ' border-secondary';

        html += '<div class="ms-' + ((level * 2 > 5) ? 5 : level * 2) + ' mb-2">';
        html += '  <div class="p-2 border rounded' + selected + '" draggable="true" data-editor-action="select-existing-object" data-existing-object-id="' + NodeID + '" data-drop-target="1" data-screen-id="' + ScreenID + '" data-parent-id="' + NodeID + '">';
        html += '    <span class="badge text-bg-secondary me-2">' + this.getObjectType(NodeID) + '</span>' + NodeID;
        html += '  </div>';

        const children = this.getChildrenByParentRef(ScreenID, NodeID);
        if (children.length > 0) {
            html += this.renderObjectNodes(ScreenID, children, level + 1);
        }

        html += '</div>';
    }

    return html;
};

sysObjObjectEditor.prototype.getChildrenByParentRef = function(ScreenID, ParentID) {
    const SkeletonScreen = this.getSkeletonStore()[ScreenID] || [];
    const Children = [];

    for (const Item of SkeletonScreen) {
        const ObjectID = Object.keys(Item)[0];
        const Meta = Item[ObjectID];
        if (Meta.RefID === ParentID) {
            Children.push(ObjectID);
        }
    }

    return Children;
};

sysObjObjectEditor.prototype.getObjectType = function(ObjectID) {
    try {
        return this.getObjectStore()[ObjectID].Type;
    }
    catch (err) {
        return 'Unknown';
    }
};

sysObjObjectEditor.prototype.loadDraftToForm = function() {
    const TypeEl = document.getElementById(this.DOMObjectID + '__prop-type');
    const ObjectIDEl = document.getElementById(this.DOMObjectID + '__prop-object-id');
    const ScreenEl = document.getElementById(this.DOMObjectID + '__prop-screen-id');
    const ParentEl = document.getElementById(this.DOMObjectID + '__prop-parent-id');
    const AttributesEl = document.getElementById(this.DOMObjectID + '__prop-attributes');

    if (TypeEl === null || ObjectIDEl === null || ScreenEl === null || ParentEl === null || AttributesEl === null) {
        return;
    }

    const current = this.getCurrentScreenID();

    if (this.SelectedObjectID !== null) {
        const SkeletonMeta = this.getSkeletonMetaByObjectID(current, this.SelectedObjectID);
        const Config = this.getObjectStore()[this.SelectedObjectID];

        TypeEl.value = Config.Type;
        ObjectIDEl.value = this.SelectedObjectID;
        ScreenEl.value = current;
        ParentEl.value = SkeletonMeta.RefID;
        AttributesEl.value = JSON.stringify(Config.Attributes || {}, null, 2);
        return;
    }

    if (this.DraftObjectID === null) {
        this.DraftObjectID = this.generateUniqueObjectID(this.SelectedSystemType);
    }

    TypeEl.value = this.SelectedSystemType;
    ObjectIDEl.value = this.DraftObjectID;
    ScreenEl.value = current;
    ParentEl.value = current;
    AttributesEl.value = JSON.stringify(this.getDefaultAttributes(this.SelectedSystemType), null, 2);
};

sysObjObjectEditor.prototype.getDefaultAttributes = function(TypeID) {
    const Defaults = {
        'Div': { 'Style': 'border p-2 mb-2', 'Value': 'New Div' },
        'SQLText': { 'Style': 'fw-semibold', 'TextID': 'TXT.SQLTEXT.TEST' },
        'ButtonInternal': { 'Style': 'btn btn-sm btn-outline-primary', 'DOMValue': 'Action' },
        'Button': { 'Style': 'btn btn-sm btn-primary', 'DOMValue': 'Submit', 'FormValidate': false },
        'Link': { 'Style': 'btn btn-sm btn-outline-secondary', 'TextID': 'TXT.MENU.LISTDETAILVIEW.SCREEN1', 'ScreenID': 'Screen1' },
        'FormfieldList': { 'Sections': [] },
        'List': { 'Style': 'border rounded', 'HeaderRowStyle': 'row fw-bold', 'RowCount': 3, 'Columns': [] },
        'TabContainer': { 'Tabs': [{ 'ID': 'Tab1', 'Default': true, 'TextID': 'TXT.BASIC-TABCONTAINER.TAB1', 'Style': 'col-md-12' }] }
    };

    return (Defaults[TypeID] !== undefined) ? Defaults[TypeID] : {};
};

sysObjObjectEditor.prototype.getSkeletonMetaByObjectID = function(ScreenID, ObjectID) {
    const SkeletonScreen = this.getSkeletonStore()[ScreenID] || [];

    for (const Item of SkeletonScreen) {
        const Key = Object.keys(Item)[0];
        if (Key === ObjectID) {
            return Item[Key];
        }
    }

    return { 'RefID': ScreenID };
};

sysObjObjectEditor.prototype.EventListenerClick = function(Event) {
    const ActionNode = Event.target.closest('[data-editor-action]');
    if (ActionNode === null) {
        return;
    }

    const Action = ActionNode.getAttribute('data-editor-action');

    if (Action === 'add-screen') {
        this.addScreen();
    }
    else if (Action === 'remove-screen') {
        this.removeCurrentScreen();
    }
    else if (Action === 'switch-screen') {
        this.switchScreen(ActionNode.getAttribute('data-screen-id'));
    }
    else if (Action === 'select-system-type') {
        this.SelectedObjectID = null;
        this.SelectedSystemType = ActionNode.getAttribute('data-system-type');
        this.DraftObjectID = this.generateUniqueObjectID(this.SelectedSystemType);
        this.refreshUI();
    }
    else if (Action === 'select-existing-object') {
        this.SelectedObjectID = ActionNode.getAttribute('data-existing-object-id');
        this.SelectedSystemType = this.getObjectType(this.SelectedObjectID);
        this.refreshUI();
    }
    else if (Action === 'save-object') {
        this.saveObjectFromForm();
    }
    else if (Action === 'reset-draft') {
        this.SelectedObjectID = null;
        this.DraftObjectID = this.generateUniqueObjectID(this.SelectedSystemType);
        this.refreshUI();
    }
};

sysObjObjectEditor.prototype.EventListenerInput = function(Event) {
    if (this.SelectedObjectID === null) {
        return;
    }

    const TargetID = Event.target.id;
    if (TargetID === this.DOMObjectID + '__prop-attributes') {
        return;
    }
};

sysObjObjectEditor.prototype.saveObjectFromForm = function() {
    const TypeID = document.getElementById(this.DOMObjectID + '__prop-type').value;
    var ObjectID = document.getElementById(this.DOMObjectID + '__prop-object-id').value.trim();
    const ScreenID = document.getElementById(this.DOMObjectID + '__prop-screen-id').value.trim();
    var ParentID = document.getElementById(this.DOMObjectID + '__prop-parent-id').value.trim();
    const AttrText = document.getElementById(this.DOMObjectID + '__prop-attributes').value;

    var Attributes;

    try {
        Attributes = (AttrText.trim() === '') ? {} : JSON.parse(AttrText);
    }
    catch (err) {
        this.setStatus('Invalid Attributes JSON');
        return;
    }

    if (ObjectID === '') {
        ObjectID = this.generateUniqueObjectID(TypeID);
    }

    if (ParentID === '') {
        ParentID = ScreenID;
    }

    if (this.SelectedObjectID !== null && this.SelectedObjectID === ObjectID) {
        this.updateExistingObject(ObjectID, ScreenID, ParentID, Attributes);
        return;
    }

    if (this.getObjectStore()[ObjectID] !== undefined) {
        this.setStatus('ObjectID already exists');
        return;
    }

    this.createObjectOnScreen(TypeID, ObjectID, ScreenID, ParentID, Attributes);
};

sysObjObjectEditor.prototype.updateExistingObject = function(ObjectID, ScreenID, ParentID, Attributes) {
    const Config = this.getObjectStore()[ObjectID];
    Config.Attributes = Attributes;

    const Meta = this.getSkeletonMetaByObjectID(ScreenID, ObjectID);
    Meta.RefID = ParentID;
    if (Meta.ElementID !== undefined) {
        delete Meta.ElementID;
    }

    const RuntimeObj = sysFactory.getObjectByID(ObjectID);
    if (RuntimeObj !== undefined && RuntimeObj !== null) {
        RuntimeObj.JSONConfig.Attributes = Attributes;

        if (Attributes.Style !== undefined) {
            RuntimeObj.DOMStyle = Attributes.Style;
            RuntimeObj.setDOMElementStyle();
        }

        if (Attributes.Value !== undefined || Attributes.DOMValue !== undefined) {
            RuntimeObj.DOMValue = (Attributes.Value !== undefined) ? Attributes.Value : Attributes.DOMValue;
            RuntimeObj.setDOMElementValue();
        }
    }

    this.rebuildScreen(ScreenID);
    this.setStatus('Updated object ' + ObjectID);
    this.refreshUI();
};

sysObjObjectEditor.prototype.createObjectOnScreen = function(TypeID, ObjectID, ScreenID, ParentID, Attributes) {
    if (this.getSkeletonStore()[ScreenID] === undefined) {
        this.setStatus('Unknown ScreenID');
        return;
    }

    this.getObjectStore()[ObjectID] = {
        'Type': TypeID,
        'Attributes': Attributes
    };

    const NewEntry = {};
    NewEntry[ObjectID] = { 'RefID': ParentID };
    this.getSkeletonStore()[ScreenID].push(NewEntry);

    this.rebuildScreen(ScreenID);

    this.SelectedObjectID = ObjectID;
    this.DraftObjectID = this.generateUniqueObjectID(TypeID);

    this.setStatus('Created object ' + ObjectID);
    this.refreshUI();
};

sysObjObjectEditor.prototype.addScreen = function() {
    const Skeleton = this.getSkeletonStore();
    var Index = 1;
    var NewID = 'Screen' + Index;

    while (Skeleton[NewID] !== undefined) {
        Index += 1;
        NewID = 'Screen' + Index;
    }

    Skeleton[NewID] = [];

    const NewScreen = sysFactory.addScreen(NewID, Skeleton[NewID]);
    NewScreen.setup();
    sysFactory.switchScreen(NewID);

    this.SelectedObjectID = null;
    this.setStatus('Added screen ' + NewID);
    this.refreshUI();
};

sysObjObjectEditor.prototype.removeCurrentScreen = function() {
    const Skeleton = this.getSkeletonStore();
    const ScreenIDs = Object.keys(Skeleton);

    if (ScreenIDs.length <= 1) {
        this.setStatus('At least one screen must remain');
        return;
    }

    const Current = this.getCurrentScreenID();
    const ScreenObj = sysFactory.getScreenByID(Current);

    if (ScreenObj !== undefined && ScreenObj !== null) {
        ScreenObj.HierarchyRootObject.removeDOMElement();
    }

    delete Skeleton[Current];
    delete sysFactory.Screens[Current];

    const Fallback = Object.keys(Skeleton)[0];
    sysFactory.switchScreen(Fallback);

    this.SelectedObjectID = null;
    this.setStatus('Removed screen ' + Current);
    this.refreshUI();
};

sysObjObjectEditor.prototype.switchScreen = function(ScreenID) {
    sysFactory.switchScreen(ScreenID);
    this.SelectedObjectID = null;
    this.setStatus('Switched to ' + ScreenID);
    this.refreshUI();
};

sysObjObjectEditor.prototype.generateUniqueObjectID = function(TypeID) {
    const Prefix = (TypeID || 'Object').replace(/[^a-zA-Z0-9]/g, '');
    const Store = this.getObjectStore();

    var Index = 1;
    var Candidate = Prefix + Index;

    while (Store[Candidate] !== undefined) {
        Index += 1;
        Candidate = Prefix + Index;
    }

    return Candidate;
};

sysObjObjectEditor.prototype.rebuildScreen = function(ScreenID) {
    const ScreenObj = sysFactory.getScreenByID(ScreenID);

    if (ScreenObj === undefined || ScreenObj === null) {
        return;
    }

    try {
        ScreenObj.HierarchyRootObject.removeDOMElement();
    }
    catch (err) {
    }

    ScreenObj.HierarchyRootObject = new sysObjDiv();
    ScreenObj.HierarchyRootObject.ObjectID = ScreenObj.ScreenID;
    ScreenObj.HierarchyRootObject.DOMStyle = ScreenObj.CSSStyle;

    ScreenObj.setupObject(ScreenObj.ScreenID, ScreenObj.HierarchyRootObject);
    ScreenObj.HierarchyRootObject.connectServiceConnectorObjects();
    ScreenObj.HierarchyRootObject.renderObject();
    ScreenObj.HierarchyRootObject.processReset();
    ScreenObj.HierarchyRootObject.processEventListener();

    if (sysFactory.CurrentScreenID !== ScreenID) {
        ScreenObj.HierarchyRootObject.VisibleState = 'hidden';
        ScreenObj.HierarchyRootObject.setDOMVisibleState();
    }
};

sysObjObjectEditor.prototype.EventListenerDragStart = function(Event) {
    const SystemTypeNode = Event.target.closest('[data-system-type]');
    if (SystemTypeNode !== null) {
        const TypeID = SystemTypeNode.getAttribute('data-system-type');
        Event.dataTransfer.setData('x0-editor-kind', 'system-type');
        Event.dataTransfer.setData('x0-editor-system-type', TypeID);
        return;
    }

    const ExistingNode = Event.target.closest('[data-existing-object-id]');
    if (ExistingNode !== null) {
        const ObjectID = ExistingNode.getAttribute('data-existing-object-id');
        Event.dataTransfer.setData('x0-editor-kind', 'existing-object');
        Event.dataTransfer.setData('x0-editor-object-id', ObjectID);
        return;
    }
};

sysObjObjectEditor.prototype.EventListenerDragOver = function(Event) {
    const DropNode = Event.target.closest('[data-drop-target="1"]');
    if (DropNode !== null) {
        Event.preventDefault();
    }
};

sysObjObjectEditor.prototype.EventListenerDrop = function(Event) {
    const DropNode = Event.target.closest('[data-drop-target="1"]');
    if (DropNode === null) {
        return;
    }

    Event.preventDefault();

    const Kind = Event.dataTransfer.getData('x0-editor-kind');
    const ScreenID = DropNode.getAttribute('data-screen-id');
    const ParentID = DropNode.getAttribute('data-parent-id');

    if (Kind === 'system-type') {
        const TypeID = Event.dataTransfer.getData('x0-editor-system-type');
        const FormType = document.getElementById(this.DOMObjectID + '__prop-type').value;
        const FormObjectID = document.getElementById(this.DOMObjectID + '__prop-object-id').value.trim();
        const AttrText = document.getElementById(this.DOMObjectID + '__prop-attributes').value;

        var Attributes = this.getDefaultAttributes(TypeID);
        try {
            if (FormType === TypeID && AttrText.trim() !== '') {
                Attributes = JSON.parse(AttrText);
            }
        }
        catch (err) {
        }

        var ObjectID = FormObjectID;
        if (FormType !== TypeID || ObjectID === '' || this.getObjectStore()[ObjectID] !== undefined) {
            ObjectID = this.generateUniqueObjectID(TypeID);
        }

        this.createObjectOnScreen(TypeID, ObjectID, ScreenID, ParentID, Attributes);
    }

    if (Kind === 'existing-object') {
        const ObjectID = Event.dataTransfer.getData('x0-editor-object-id');
        this.reparentObject(ScreenID, ObjectID, ParentID);
    }
};

sysObjObjectEditor.prototype.reparentObject = function(ScreenID, ObjectID, NewParentID) {
    if (ObjectID === NewParentID) {
        this.setStatus('Cannot set object as its own parent');
        return;
    }

    if (this.isDescendant(ScreenID, NewParentID, ObjectID) === true) {
        this.setStatus('Invalid move: target parent is child of object');
        return;
    }

    const Meta = this.getSkeletonMetaByObjectID(ScreenID, ObjectID);
    if (Meta.RefID === NewParentID) {
        this.setStatus('Object is already connected to this parent');
        return;
    }

    Meta.RefID = NewParentID;
    if (Meta.ElementID !== undefined) {
        delete Meta.ElementID;
    }

    this.rebuildScreen(ScreenID);
    this.SelectedObjectID = ObjectID;
    this.setStatus('Reparented object ' + ObjectID + ' to ' + NewParentID);
    this.refreshUI();
};

sysObjObjectEditor.prototype.isDescendant = function(ScreenID, CandidateParentID, ObjectID) {
    const ParentMap = {};
    const SkeletonScreen = this.getSkeletonStore()[ScreenID] || [];

    for (const Item of SkeletonScreen) {
        const Key = Object.keys(Item)[0];
        ParentMap[Key] = Item[Key].RefID;
    }

    var Current = CandidateParentID;

    while (Current !== undefined && Current !== null) {
        if (Current === ObjectID) {
            return true;
        }

        if (Current === ScreenID) {
            return false;
        }

        Current = ParentMap[Current];
    }

    return false;
};
