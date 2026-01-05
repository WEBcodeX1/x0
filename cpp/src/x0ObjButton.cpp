//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- x0 C++ Framework - Button Widget Implementation                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//

#include "x0ObjButton.h"
#include "x0Factory.h"
#include <QDebug>

namespace x0 {

x0ObjButton::x0ObjButton(QObject* parent)
    : x0BaseObject(parent)
{
    m_objectType = "Button";
}

x0ObjButton::~x0ObjButton() = default;

void x0ObjButton::createWidget(const QString& objectId)
{
    m_objectId = objectId;
    
    auto* button = new QPushButton();
    button->setObjectName(objectId);
    
    // Connect button click signal
    connect(button, &QPushButton::clicked, this, &x0ObjButton::onButtonClick);
    
    m_widget.reset(button);
}

void x0ObjButton::init()
{
    if (!m_jsonConfig.contains("Attributes")) return;
    
    const json& attributes = m_jsonConfig["Attributes"];
    
    // Set DOM value (button text) - supports both 'DOMValue' and 'Value' for flexibility
    if (attributes.contains("DOMValue")) {
        m_value = QString::fromStdString(attributes["DOMValue"].get<std::string>());
    } else if (attributes.contains("Value")) {
        m_value = QString::fromStdString(attributes["Value"].get<std::string>());
    }
    
    // Set style
    if (attributes.contains("Style")) {
        m_styleClass = QString::fromStdString(attributes["Style"].get<std::string>());
    }
    
    // Set disabled state
    if (attributes.contains("Disabled") && attributes["Disabled"].get<bool>()) {
        setDisabled(true);
    }
    
    // Set click URL
    if (attributes.contains("OnClick")) {
        m_callUrl = QString::fromStdString(attributes["OnClick"].get<std::string>());
    }
    
    // Set form validate flag
    if (attributes.contains("Validate")) {
        m_formValidate = true;
    }
    
    // Get text from TextID if available
    if (attributes.contains("TextID")) {
        QString textId = QString::fromStdString(attributes["TextID"].get<std::string>());
        m_value = x0Factory::instance().getText(textId);
    }
    
    qDebug() << "x0ObjButton::init() ObjectID:" << m_objectId << "TextID:" << m_value;
}

void x0ObjButton::setButtonText(const QString& text)
{
    m_value = text;
    QPushButton* button = getButton();
    if (button) {
        button->setText(text);
    }
}

QString x0ObjButton::getButtonText() const
{
    return m_value;
}

void x0ObjButton::setDisabled(bool disabled)
{
    m_disabled = disabled;
    
    QPushButton* button = getButton();
    if (button) {
        button->setEnabled(!disabled);
    }
    
    // Update style for disabled state
    if (disabled && !m_styleClass.isEmpty()) {
        addStyleClass("disabled");
    } else {
        removeStyleClass("disabled");
    }
}

QPushButton* x0ObjButton::getButton() const
{
    return qobject_cast<QPushButton*>(m_widget.get());
}

void x0ObjButton::onButtonClick()
{
    qDebug() << "x0ObjButton::onButtonClick() Button clicked - ObjectID:" << m_objectId;
    
    if (m_disabled) {
        qDebug() << "x0ObjButton::onButtonClick() Button is disabled";
        return;
    }
    
    // Reset validation state
    m_validateResultError = true;
    
    // Validate form if required
    if (m_formValidate) {
        validateForm();
    } else {
        m_validateResultError = false;
    }
    
    qDebug() << "x0ObjButton::onButtonClick() Validate result:" << m_validateResultError;
    
    if (!m_validateResultError) {
        // Process actions
        processActions();
        
        // Call service if URL is set
        if (!m_callUrl.isEmpty()) {
            callService();
        }
    }
    
    emit clicked();
}

void x0ObjButton::validateForm()
{
    if (!m_jsonConfig.contains("Attributes")) {
        m_validateResultError = false;
        return;
    }
    
    const json& attributes = m_jsonConfig["Attributes"];
    
    if (!attributes.contains("Validate")) {
        m_validateResultError = false;
        return;
    }
    
    // In a full implementation, this would validate form fields
    // For now, we assume validation passes
    m_validateResultError = false;
    
    emit validationComplete(!m_validateResultError);
}

void x0ObjButton::callService()
{
    qDebug() << "x0ObjButton::callService() URL:" << m_callUrl;
    
    addNotifyHandler();
    
    // In a full implementation, this would make an HTTP/RPC call
    // For now, emit signal indicating the call would be made
    emit serviceCallComplete(json());
}

void x0ObjButton::addNotifyHandler()
{
    try {
        if (!m_jsonConfig.contains("Attributes")) return;
        
        const json& attributes = m_jsonConfig["Attributes"];
        if (!attributes.contains("Notify")) return;
        
        const json& notifyAttrs = attributes["Notify"];
        qDebug() << "x0ObjButton::addNotifyHandler() Notify:" << QString::fromStdString(notifyAttrs.dump());
        
        // In a full implementation, this would add to the global notification handler
        
    } catch (const std::exception& e) {
        qDebug() << "x0ObjButton::addNotifyHandler() error:" << e.what();
    }
}

void x0ObjButton::processActions()
{
    if (!m_jsonConfig.contains("Attributes")) return;
    
    const json& attributes = m_jsonConfig["Attributes"];
    
    QString action;
    if (attributes.contains("Action")) {
        action = QString::fromStdString(attributes["Action"].get<std::string>()).toLower();
    }
    
    qDebug() << "x0ObjButton::processActions() Action:" << action;
    
    if (action.isEmpty()) return;
    
    // Get destination object
    x0BaseObject* dstObject = nullptr;
    if (attributes.contains("DstObjectID")) {
        QString dstObjectId = QString::fromStdString(attributes["DstObjectID"].get<std::string>());
        dstObject = x0Factory::instance().getObjectById(dstObjectId);
    }
    
    // Process action types
    if (action == "enable" && dstObject) {
        dstObject->setVisibleState("visible");
    }
    else if (action == "disable" && dstObject) {
        dstObject->setVisibleState("hidden");
    }
    else if (action == "activate" && dstObject) {
        dstObject->setActivated();
    }
    else if (action == "deactivate" && dstObject) {
        dstObject->setDeactivated();
    }
    else if (action == "reset" && dstObject) {
        dstObject->reset();
    }
    else if (action == "switchscreen") {
        if (attributes.contains("DstScreenID")) {
            QString dstScreenId = QString::fromStdString(attributes["DstScreenID"].get<std::string>());
            x0Factory::instance().switchScreen(dstScreenId);
        }
    }
    
    // Fire events if configured
    if (attributes.contains("FireEvents")) {
        x0Factory::instance().getReactor()->fireEvents(attributes["FireEvents"]);
    }
}

} // namespace x0
