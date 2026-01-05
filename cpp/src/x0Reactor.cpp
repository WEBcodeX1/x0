//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- x0 C++ Framework - Reactor Implementation                                -//
//-------1---------2---------3---------4---------5---------6---------7--------//

#include "x0Reactor.h"
#include "x0BaseObject.h"
#include "x0Factory.h"
#include <QDebug>

namespace x0 {

x0Reactor::x0Reactor(QObject* parent)
    : QObject(parent)
{
}

x0Reactor::~x0Reactor() = default;

void x0Reactor::registerEvent(const json& attributes, x0BaseObject* processObject, const QString& type)
{
    if (!attributes.contains("OnEvent")) return;
    
    const json& eventAttrs = attributes["OnEvent"];
    
    if (!eventAttrs.contains("Events")) return;
    
    for (const auto& eventId : eventAttrs["Events"]) {
        QString eventIdStr = QString::fromStdString(eventId.get<std::string>());
        
        json eventAttributes;
        if (eventAttrs.contains("Attributes")) {
            eventAttributes = eventAttrs["Attributes"];
        }
        
        QString eventType = type;
        if (eventAttrs.contains("Type")) {
            eventType = QString::fromStdString(eventAttrs["Type"].get<std::string>());
        }
        
        x0Event event(eventIdStr, processObject, eventType, eventAttributes);
        m_events.push_back(event);
        
        qDebug() << "x0Reactor::registerEvent() EventID:" << eventIdStr << "Type:" << eventType;
        emit eventRegistered(eventIdStr, eventType);
    }
}

void x0Reactor::unregisterEvent(const QString& eventId, x0BaseObject* object)
{
    m_events.erase(
        std::remove_if(m_events.begin(), m_events.end(),
            [&](const x0Event& e) {
                return e.id == eventId && e.objectRef == object;
            }),
        m_events.end()
    );
}

void x0Reactor::dispatchEvent(const QString& eventId)
{
    qDebug() << "x0Reactor::dispatchEvent() EventID:" << eventId;
    
    for (const auto& event : m_events) {
        if (event.id != eventId) continue;
        
        x0BaseObject* processObj = event.objectRef;
        if (!processObj) continue;
        
        const json& config = processObj->getJsonConfig();
        json attributes;
        
        if (config.contains("Attributes")) {
            attributes = config["Attributes"];
        }
        
        qDebug() << "x0Reactor::dispatchEvent() Processing event type:" << event.type;
        
        if (event.type == "ServiceConnector") {
            qDebug() << "x0Reactor::dispatchEvent() - ServiceConnector";
            // In a full implementation, this would trigger service data loading
            // processObj->processSourceObjects();
            // processObj->getServiceData();
            
        } else if (event.type == "Dynpulldown") {
            qDebug() << "x0Reactor::dispatchEvent() - Dynpulldown";
            // In a full implementation, this would fetch dynamic pulldown data
            
        } else if (event.type == "SetObjectPropertyValues") {
            qDebug() << "x0Reactor::dispatchEvent() - SetObjectPropertyValues";
            auto setter = new SetObjectPropertyValues(event, this);
            Q_UNUSED(setter)
        }
    }
    
    emit eventDispatched(eventId);
}

void x0Reactor::fireEvents(const QStringList& events)
{
    for (const QString& eventId : events) {
        dispatchEvent(eventId);
    }
}

void x0Reactor::fireEvents(const json& events)
{
    if (!events.is_array()) return;
    
    for (const auto& event : events) {
        if (event.is_string()) {
            dispatchEvent(QString::fromStdString(event.get<std::string>()));
        }
    }
}

QVector<x0Event> x0Reactor::getEventsByType(const QString& type) const
{
    QVector<x0Event> result;
    for (const auto& event : m_events) {
        if (event.type == type) {
            result.push_back(event);
        }
    }
    return result;
}

QVector<x0Event> x0Reactor::getEventsForObject(x0BaseObject* object) const
{
    QVector<x0Event> result;
    for (const auto& event : m_events) {
        if (event.objectRef == object) {
            result.push_back(event);
        }
    }
    return result;
}

void x0Reactor::clearEvents()
{
    m_events.clear();
}

void x0Reactor::clearEventsForObject(x0BaseObject* object)
{
    m_events.erase(
        std::remove_if(m_events.begin(), m_events.end(),
            [object](const x0Event& e) { return e.objectRef == object; }),
        m_events.end()
    );
}

// SetObjectPropertyValues implementation

SetObjectPropertyValues::SetObjectPropertyValues(const x0Event& event, QObject* parent)
    : QObject(parent)
    , m_event(event)
{
    callService();
}

void SetObjectPropertyValues::callService()
{
    const json& attributes = m_event.attributes;
    
    if (!attributes.contains("DstProperties")) return;
    
    for (const auto& dstProperty : attributes["DstProperties"]) {
        if (!dstProperty.contains("ObjectID")) continue;
        
        QString objectId = QString::fromStdString(dstProperty["ObjectID"].get<std::string>());
        x0BaseObject* dstObject = x0Factory::instance().getObjectById(objectId);
        
        if (!dstObject) {
            qDebug() << "SetObjectPropertyValues::callService() - Object not found:" << objectId;
            continue;
        }
        
        // Disable the parent if possible
        x0BaseObject* parentObj = dstObject->getParentObject();
        if (parentObj) {
            parentObj->disable();
        }
        
        // Apply style if specified
        if (dstProperty.contains("SetStyle")) {
            QString style = QString::fromStdString(dstProperty["SetStyle"].get<std::string>());
            dstObject->addStyleClass(style);
        }
    }
    
    // In a full implementation, this would make an async service call
    // For now, we emit a signal indicating completion
    emit serviceCallComplete(json());
}

void SetObjectPropertyValues::handleServiceResponse(const json& response)
{
    const json& attributes = m_event.attributes;
    
    if (!attributes.contains("DstProperties")) return;
    
    for (const auto& dstProperty : attributes["DstProperties"]) {
        if (!dstProperty.contains("ObjectID") || !dstProperty.contains("PropertyName")) continue;
        
        QString objectId = QString::fromStdString(dstProperty["ObjectID"].get<std::string>());
        QString propertyName = QString::fromStdString(dstProperty["PropertyName"].get<std::string>());
        
        x0BaseObject* dstObject = x0Factory::instance().getObjectById(objectId);
        if (!dstObject) continue;
        
        // Set the property value from response
        if (response.contains(propertyName.toStdString())) {
            // Apply the property value (implementation depends on property type)
        }
        
        // Remove style if it was set
        if (dstProperty.contains("SetStyle")) {
            QString style = QString::fromStdString(dstProperty["SetStyle"].get<std::string>());
            dstObject->removeStyleClass(style);
        }
        
        // Enable the parent
        x0BaseObject* parentObj = dstObject->getParentObject();
        if (parentObj) {
            parentObj->enable();
        }
    }
}

} // namespace x0
