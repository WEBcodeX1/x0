//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- USER Functions                                                           -//
//-------1---------2---------3---------4---------5---------6---------7--------//

//------------------------------------------------------------------------------
//- CONSTRUCTOR "UserDefaults"
//------------------------------------------------------------------------------

function UserDefaults()
{
    sysFactory.DefaultStyleScreen = 'col-md-12 ms-auto me-auto';
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "UserValidate"
//------------------------------------------------------------------------------

function UserValidate()
{
    this.ValidateFunc = {
        'UserFunc':     this.UserFunc
    };
}


//------------------------------------------------------------------------------
//- METHOD "UserFunc"
//------------------------------------------------------------------------------

UserValidate.prototype.UserFunc = function(Value)
{
    const ErrorMsg = sysFactory.getText('TXT.SYS.ERROR.FORMVALIDATE.USER.USER-FUNC');

    if (Value != 'UserFunction')) {
        return {
            "Error": true,
            "Message": ErrorMsg
        };
    }

    return false;
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "UserValidateGroup"
//------------------------------------------------------------------------------

function UserValidateGroup()
{
    this.ValidateFunc =
    {
        'UserGroupFunc':    this.UserGroupFunc
    };
}


//------------------------------------------------------------------------------
//- METHOD "UserGroupFunc"
//------------------------------------------------------------------------------

UserValidateGroup.prototype.UserGroupFunc = function(Items)
{
    console.debug('UserValidate GroupFunc Items:%o', Items);

    const ErrorMsg = sysFactory.getText('TXT.SYS.ERROR.FORMVALIDATE.USER.USER-GROUP-FUNC');

    if (parseInt(Items[0].getObjectData()) != 1)) {
        return {
            "Error": true,
            "Message": ErrorMsg
        };
    }

    if (parseInt(Items[1].getObjectData()) != 2)) {
        return {
            "Error": true,
            "Message": ErrorMsg
        };
    }

    if (parseInt(Items[2].getObjectData()) != 3)) {
        return {
            "Error": true,
            "Message": ErrorMsg
        };
    }

    return false;
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "UserContextMenu"
//------------------------------------------------------------------------------

function UserContextMenu()
{
}


//------------------------------------------------------------------------------
//- METHOD "process"
//------------------------------------------------------------------------------

UserContextMenu.prototype.process = function(ContextMenuRef)
{
}
