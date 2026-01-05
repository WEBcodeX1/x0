//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- x0 C++ Framework - Div Container Implementation                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//

#include "x0ObjDiv.h"
#include <QVBoxLayout>
#include <QDebug>

namespace x0 {

x0ObjDiv::x0ObjDiv(QObject* parent)
    : x0BaseObject(parent)
{
    m_objectType = "Div";
}

x0ObjDiv::~x0ObjDiv() = default;

void x0ObjDiv::createWidget(const QString& objectId)
{
    m_objectId = objectId;
    
    auto* frame = new QFrame();
    frame->setObjectName(objectId);
    frame->setFrameStyle(QFrame::NoFrame);
    
    // Add a layout for child widgets
    auto* layout = new QVBoxLayout(frame);
    layout->setContentsMargins(0, 0, 0, 0);
    layout->setSpacing(0);
    
    m_widget.reset(frame);
}

void x0ObjDiv::init()
{
    if (!m_jsonConfig.contains("Attributes")) return;
    
    const json& attributes = m_jsonConfig["Attributes"];
    
    // Set DOM type if given
    if (attributes.contains("DOMType")) {
        m_domType = QString::fromStdString(attributes["DOMType"].get<std::string>());
    }
    
    // Set DOM value if given
    if (attributes.contains("Value")) {
        m_value = QString::fromStdString(attributes["Value"].get<std::string>());
    }
    
    // Set DOM style
    if (attributes.contains("Style")) {
        m_styleClass = QString::fromStdString(attributes["Style"].get<std::string>());
    }
}

void x0ObjDiv::reset()
{
    try {
        if (!m_jsonConfig.contains("Attributes")) return;
        
        const json& attributes = m_jsonConfig["Attributes"];
        if (attributes.contains("Reset") && !attributes["Reset"].is_null()) {
            m_value.clear();
            setValue(m_value);
        }
    } catch (const std::exception& e) {
        qDebug() << "x0ObjDiv::reset() error:" << e.what();
    }
}

void x0ObjDiv::setDomType(const QString& type)
{
    m_domType = type;
}

QFrame* x0ObjDiv::getFrame() const
{
    return qobject_cast<QFrame*>(m_widget.get());
}

} // namespace x0
