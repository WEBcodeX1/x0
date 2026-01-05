//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- x0 C++ Framework - Base Element Implementation                           -//
//-------1---------2---------3---------4---------5---------6---------7--------//

#include "x0BaseElement.h"
#include <QLabel>
#include <QDebug>

namespace x0 {

x0BaseElement::x0BaseElement(QObject* parent)
    : QObject(parent)
    , m_visibleState("visible")
{
}

x0BaseElement::~x0BaseElement() = default;

void x0BaseElement::createWidget(const QString& objectId)
{
    m_objectId = objectId;
    m_widget = std::make_unique<QWidget>();
    m_widget->setObjectName(objectId);
}

QWidget* x0BaseElement::getWidget() const
{
    return m_widget.get();
}

void x0BaseElement::setParentWidget(QWidget* parent)
{
    if (m_widget && parent) {
        m_widget->setParent(parent);
    }
}

void x0BaseElement::setStyleClass(const QString& styleClass)
{
    m_styleClass = styleClass;
    m_styleClasses.clear();
    if (!styleClass.isEmpty()) {
        m_styleClasses = styleClass.split(' ', Qt::SkipEmptyParts);
    }
    
    if (m_widget) {
        // Apply style classes as Qt stylesheet
        m_widget->setProperty("class", styleClass);
        emit styleChanged();
    }
}

void x0BaseElement::addStyleClass(const QString& styleClass)
{
    QStringList classesToAdd = styleClass.split(' ', Qt::SkipEmptyParts);
    for (const QString& cls : classesToAdd) {
        if (!m_styleClasses.contains(cls)) {
            m_styleClasses.append(cls);
        }
    }
    m_styleClass = m_styleClasses.join(' ');
    
    if (m_widget) {
        m_widget->setProperty("class", m_styleClass);
        emit styleChanged();
    }
}

void x0BaseElement::removeStyleClass(const QString& styleClass)
{
    QStringList classesToRemove = styleClass.split(' ', Qt::SkipEmptyParts);
    for (const QString& cls : classesToRemove) {
        m_styleClasses.removeAll(cls);
    }
    m_styleClass = m_styleClasses.join(' ');
    
    if (m_widget) {
        m_widget->setProperty("class", m_styleClass);
        emit styleChanged();
    }
}

bool x0BaseElement::hasStyleClass(const QString& styleClass) const
{
    return m_styleClasses.contains(styleClass);
}

QString x0BaseElement::getStyleClasses() const
{
    return m_styleClass;
}

void x0BaseElement::setValue(const QString& value)
{
    m_value = value;
    emit valueChanged(value);
}

QString x0BaseElement::getValue() const
{
    return m_value;
}

void x0BaseElement::setVisibleState(const QString& state)
{
    m_visibleState = state;
    if (m_widget) {
        if (state == "visible") {
            m_widget->show();
            emit visibilityChanged(true);
        } else if (state == "hidden") {
            m_widget->hide();
            emit visibilityChanged(false);
        }
    }
}

QString x0BaseElement::getVisibleState() const
{
    return m_visibleState;
}

void x0BaseElement::switchVisibleState()
{
    if (m_visibleState == "visible") {
        setVisibleState("hidden");
    } else {
        setVisibleState("visible");
    }
}

void x0BaseElement::enable()
{
    if (m_widget) {
        m_widget->setEnabled(true);
    }
}

void x0BaseElement::disable()
{
    if (m_widget) {
        m_widget->setEnabled(false);
    }
}

bool x0BaseElement::isEnabled() const
{
    return m_widget ? m_widget->isEnabled() : false;
}

void x0BaseElement::setAttribute(const QString& attribute, const QString& value)
{
    m_attributes[attribute] = value;
    if (m_widget) {
        m_widget->setProperty(attribute.toUtf8().constData(), value);
    }
}

QString x0BaseElement::getAttribute(const QString& attribute) const
{
    return m_attributes.value(attribute);
}

void x0BaseElement::setAttributes(const QMap<QString, QString>& attributes)
{
    for (auto it = attributes.begin(); it != attributes.end(); ++it) {
        setAttribute(it.key(), it.value());
    }
}

void x0BaseElement::setStyleTop(int top)
{
    m_styleTop = top;
}

void x0BaseElement::setStyleLeft(int left)
{
    m_styleLeft = left;
}

void x0BaseElement::setStyleWidth(int width)
{
    m_styleWidth = width;
}

void x0BaseElement::setStyleHeight(int height)
{
    m_styleHeight = height;
}

void x0BaseElement::setStyleZIndex(int zIndex)
{
    m_styleZIndex = zIndex;
}

void x0BaseElement::applyStyleAttributes()
{
    if (!m_widget) return;

    if (m_styleWidth >= 0) {
        m_widget->setFixedWidth(m_styleWidth);
    }
    if (m_styleHeight >= 0) {
        m_widget->setFixedHeight(m_styleHeight);
    }
    if (m_styleTop >= 0 || m_styleLeft >= 0) {
        int x = m_styleLeft >= 0 ? m_styleLeft : m_widget->x();
        int y = m_styleTop >= 0 ? m_styleTop : m_widget->y();
        m_widget->move(x, y);
    }
    // Note: Z-index in Qt is handled through widget stacking order
    // Use raise()/lower() or explicit layout management
}

} // namespace x0
