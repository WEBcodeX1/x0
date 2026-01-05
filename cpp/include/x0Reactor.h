//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- x0 C++ Framework - Event Reactor                                         -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Equivalent to JavaScript: sysReactor.js                                  -//
//-------1---------2---------3---------4---------5---------6---------7--------//

#ifndef X0_REACTOR_H
#define X0_REACTOR_H

#include <QObject>
#include <QString>
#include <QVector>
#include <memory>
#include <nlohmann/json.hpp>

namespace x0 {

using json = nlohmann::json;

// Forward declaration
class x0BaseObject;

/**
 * @brief Event structure for reactor system
 */
struct x0Event {
    QString id;
    x0BaseObject* objectRef;
    QString type;
    json attributes;

    x0Event(const QString& eventId, x0BaseObject* obj, const QString& eventType, const json& attrs = json())
        : id(eventId), objectRef(obj), type(eventType), attributes(attrs) {}
};

/**
 * @brief Reactor class for event dispatching and handling
 * 
 * This class manages event registration, dispatching, and handling
 * across the x0 framework. Equivalent to sysReactor.js.
 */
class x0Reactor : public QObject {
    Q_OBJECT

public:
    explicit x0Reactor(QObject* parent = nullptr);
    virtual ~x0Reactor();

    // Event registration
    void registerEvent(const json& attributes, x0BaseObject* processObject, const QString& type);
    void unregisterEvent(const QString& eventId, x0BaseObject* object);

    // Event dispatching
    void dispatchEvent(const QString& eventId);
    void fireEvents(const QStringList& events);
    void fireEvents(const json& events);

    // Event query
    QVector<x0Event> getEventsByType(const QString& type) const;
    QVector<x0Event> getEventsForObject(x0BaseObject* object) const;

    // Clear events
    void clearEvents();
    void clearEventsForObject(x0BaseObject* object);

signals:
    void eventDispatched(const QString& eventId);
    void eventRegistered(const QString& eventId, const QString& type);

private:
    QVector<x0Event> m_events;
};

/**
 * @brief Helper class for setting object property values via events
 * 
 * This class handles the "SetObjectPropertyValues" event type,
 * allowing dynamic property updates through the event system.
 */
class SetObjectPropertyValues : public QObject {
    Q_OBJECT

public:
    explicit SetObjectPropertyValues(const x0Event& event, QObject* parent = nullptr);
    void callService();

signals:
    void serviceCallComplete(const json& result);

private slots:
    void handleServiceResponse(const json& response);

private:
    x0Event m_event;
};

} // namespace x0

#endif // X0_REACTOR_H
