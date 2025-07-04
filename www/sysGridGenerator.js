//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "GridGenerator"                                            -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysGridGenerator"
//------------------------------------------------------------------------------

function sysGridGenerator(SourceObjects)
{
    this.SourceObjects      = SourceObjects;      //- Source Objects

    this.GenColObjects      = new Array();        //- Generator Processing Col Objects
    this.GenRowObjects      = new Array();        //- Generator Processing Row Objects

    this.RowAfterElements   = null;               //- Enclose Row After Elements Count
    this.ColAfterElements   = null;               //- Enclose Col After Elements Count

    this.RowStyles          = null;               //- Row CSS Styles
    this.ColStyles          = null;               //- Column CSS Styles
}

sysGridGenerator.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysGridGenerator.prototype.init = function(
    RowStyles,
    ColStyles,
    RowAfterElements,
    ColAfterElements
)
{
    this.RowStyles = (Array.isArray(RowStyles)) ? RowStyles : [ RowStyles ];
    this.ColStyles = (Array.isArray(ColStyles)) ? ColStyles : [ ColStyles ];

    this.RowAfterElements = (Array.isArray(RowAfterElements)) ? RowAfterElements : [ RowAfterElements ];

    if (ColAfterElements === undefined) {
        this.ColAfterElements = new Array();
        this.ColAfterElements = [ 1 ];
    }
    else {
        this.ColAfterElements = (Array.isArray(ColAfterElements)) ? ColAfterElements : [ ColAfterElements ];
    }
}


//------------------------------------------------------------------------------
//- METHOD "generate"
//------------------------------------------------------------------------------

sysGridGenerator.prototype.generate = function()
{
    var ProcessColObjects = new Array();

    const ColIndexGen = this.ColIndexGenerator();
    const RowIndexGen = this.RowIndexGenerator();

    const ColStyleGen = this.ColStyleGenerator();
    const RowStyleGen = this.RowStyleGenerator();

    var NextColIndex = ColIndexGen.next().value;
    var NextRowIndex = RowIndexGen.next().value;

    console.debug('GridGen Start NextColIndex:%s NextRowIndex:%s', NextColIndex, NextRowIndex);

    var CurrElementIndex = 1;

    for (const ProcessItem of this.SourceObjects) {

        ProcessColObjects.push(ProcessItem);

        if (CurrElementIndex == NextColIndex) {
            console.debug('GridGen NextCol NextColIndex:%s', NextColIndex);
            var ColEncloseObj = new sysObjDiv();
            ColEncloseObj.ObjectID = 'c' + CurrElementIndex;
            ColEncloseObj.DOMStyle = ColStyleGen.next().value;

            for (const AddItem of ProcessColObjects) {
                ColEncloseObj.addObject(AddItem);
            }

            this.GenColObjects.push(ColEncloseObj);

            NextColIndex = ColIndexGen.next().value + CurrElementIndex;
            ProcessColObjects = [];
        }

        if (CurrElementIndex == NextRowIndex) {
            console.debug('GridGen NextRow NextRowIndex:%s', NextRowIndex);

            var RowEncloseObj = new sysObjDiv();
            RowEncloseObj.ObjectID = 'r' + CurrElementIndex;
            RowEncloseObj.DOMStyle = RowStyleGen.next().value;

            for (const AddItem of this.GenColObjects) {
                RowEncloseObj.addObject(AddItem);
            }

            this.GenRowObjects.push(RowEncloseObj);

            NextRowIndex = RowIndexGen.next().value + CurrElementIndex;
            this.GenColObjects = [];
        }

        CurrElementIndex++;

    }
    return this.GenRowObjects;
}


//------------------------------------------------------------------------------
//- METHOD "ColIndexGenerator"
//------------------------------------------------------------------------------

sysGridGenerator.prototype.ColIndexGenerator = function* ()
{
    while(true) {
        for (const Index of this.ColAfterElements) {
            yield(Index);
        }
    }
}


//------------------------------------------------------------------------------
//- METHOD "ColStyleGenerator"
//------------------------------------------------------------------------------

sysGridGenerator.prototype.ColStyleGenerator = function* ()
{
    while(true) {
        for (const Style of this.ColStyles) {
            yield(Style);
        }
    }
}


//------------------------------------------------------------------------------
//- METHOD "RowIndexGenerator"
//------------------------------------------------------------------------------

sysGridGenerator.prototype.RowIndexGenerator = function* ()
{
    while(true) {
        for (const Index of this.RowAfterElements) {
            yield(Index);
        }
    }
}


//------------------------------------------------------------------------------
//- METHOD "RowStyleGenerator"
//------------------------------------------------------------------------------

sysGridGenerator.prototype.RowStyleGenerator = function* ()
{
    while(true) {
        for (const Style of this.RowStyles) {
            yield(Style);
        }
    }
}
