//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- x0 C++ Framework - Base Object Implementation                            -//
//-------1---------2---------3---------4---------5---------6---------7--------//

#include "x0BaseObject.h"
#include <QDebug>
#include <QVBoxLayout>

namespace x0 {

x0BaseObject::x0BaseObject(QObject* parent)
    : x0BaseElement(parent)
{
}

x0BaseObject::~x0BaseObject() = default;

void x0BaseObject::addObject(std::shared_ptr<x0BaseObject> childObject)
{
    if (childObject) {
        childObject->setParentObject(this);
        m_childObjects.push_back(childObject);
    }
}

void x0BaseObject::removeObject(int index)
{
    if (index >= 0 && index < static_cast<int>(m_childObjects.size())) {
        m_childObjects.erase(m_childObjects.begin() + index);
    }
}

void x0BaseObject::removeObject(x0BaseObject* child)
{
    auto it = std::find_if(m_childObjects.begin(), m_childObjects.end(),
        [child](const std::shared_ptr<x0BaseObject>& obj) {
            return obj.get() == child;
        });
    
    if (it != m_childObjects.end()) {
        m_childObjects.erase(it);
    }
}

std::shared_ptr<x0BaseObject> x0BaseObject::getChildByIndex(int index) const
{
    if (index >= 0 && index < static_cast<int>(m_childObjects.size())) {
        return m_childObjects[index];
    }
    return nullptr;
}

int x0BaseObject::getChildIndexById(const QString& id) const
{
    for (size_t i = 0; i < m_childObjects.size(); ++i) {
        if (m_childObjects[i]->getObjectId() == id) {
            return static_cast<int>(i);
        }
    }
    return -1;
}

int x0BaseObject::getChildCount() const
{
    return static_cast<int>(m_childObjects.size());
}

const std::vector<std::shared_ptr<x0BaseObject>>& x0BaseObject::getChildObjects() const
{
    return m_childObjects;
}

void x0BaseObject::setParentObject(x0BaseObject* parent)
{
    m_parentObject = parent;
}

x0BaseObject* x0BaseObject::getParentObject() const
{
    return m_parentObject;
}

x0BaseObject* x0BaseObject::getObjectById(const QString& objectId)
{
    auto objects = getAllObjects();
    auto it = objects.find(objectId);
    if (it != objects.end()) {
        return it->second;
    }
    return nullptr;
}

std::vector<x0BaseObject*> x0BaseObject::getObjectsByType(const QString& objectType)
{
    std::vector<x0BaseObject*> result;
    auto objects = getAllObjects();
    
    for (auto& pair : objects) {
        if (pair.second->getObjectType() == objectType) {
            result.push_back(pair.second);
        }
    }
    
    return result;
}

std::vector<x0BaseObject*> x0BaseObject::getObjectsByAttribute(const QString& attribute)
{
    std::vector<x0BaseObject*> result;
    auto objects = getAllObjects();
    
    for (auto& pair : objects) {
        const json& config = pair.second->getJsonConfig();
        if (config.contains("Attributes") && config["Attributes"].contains(attribute.toStdString())) {
            result.push_back(pair.second);
        }
    }
    
    return result;
}

std::map<QString, x0BaseObject*> x0BaseObject::getAllObjects()
{
    std::map<QString, x0BaseObject*> items;
    collectObjects(items);
    return items;
}

void x0BaseObject::collectObjects(std::map<QString, x0BaseObject*>& items)
{
    for (const auto& child : m_childObjects) {
        items[child->getObjectId()] = child.get();
        child->collectObjects(items);
    }
}

void x0BaseObject::renderObject(const QString& prefix)
{
    // Set DOM IDs
    m_parentId = prefix;
    
    QString setObjectId = m_objectId;
    
    if (!m_overrideDomObjectId) {
        if (prefix.isEmpty()) {
            m_objectId = setObjectId;
        } else {
            m_objectId = prefix + "_" + setObjectId;
        }
    }
    
    // Create widget if it doesn't exist
    if (!m_widget) {
        createWidget(m_objectId);
    }
    
    // Apply styles and attributes
    setStyleClass(m_styleClass);
    setValue(m_value);
    applyStyleAttributes();
    setVisibleState(m_visibleState);
    
    // Render child objects
    for (const auto& child : m_childObjects) {
        child->renderObject(m_objectId);
        // Parent the child widget
        if (child->getWidget() && m_widget) {
            child->setParentWidget(m_widget.get());
        }
    }
}

void x0BaseObject::init()
{
    // Override in derived classes
}

void x0BaseObject::reset()
{
    // Override in derived classes
}

void x0BaseObject::updateValue()
{
    // Override in derived classes
}

void x0BaseObject::setActivated()
{
    m_deactivated = false;
    for (const auto& child : m_childObjects) {
        child->setActivated();
    }
}

void x0BaseObject::setDeactivated()
{
    m_deactivated = true;
    for (const auto& child : m_childObjects) {
        child->setDeactivated();
    }
}

json x0BaseObject::getObjectData()
{
    // Override in derived classes for custom data retrieval
    return json();
}

void x0BaseObject::setObjectData(const json& data)
{
    // Override in derived classes for custom data setting
    Q_UNUSED(data)
}

void x0BaseObject::appendObjectData(const json& data)
{
    // Override in derived classes for custom data appending
    Q_UNUSED(data)
}

void x0BaseObject::processReset()
{
    reset();
    for (const auto& child : m_childObjects) {
        child->processReset();
    }
}

void x0BaseObject::processUpdate()
{
    updateValue();
    for (const auto& child : m_childObjects) {
        child->processUpdate();
    }
}

void x0BaseObject::processEventListeners()
{
    // Process event listeners for this object
    for (const auto& pair : m_eventListeners) {
        qDebug() << "Processing event listener:" << pair.first;
    }
    
    // Process event listeners for child objects
    for (const auto& child : m_childObjects) {
        child->processEventListeners();
    }
}

void x0BaseObject::addEventListener(const QString& type, EventCallback callback)
{
    m_eventListeners[type] = callback;
}

void x0BaseObject::removeEventListener(const QString& type)
{
    m_eventListeners.erase(type);
}

} // namespace x0
