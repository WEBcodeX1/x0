//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- x0 C++ Framework - Base Object (Hierarchical Object Model)               -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Equivalent to JavaScript: sysBaseObject.js                               -//
//-------1---------2---------3---------4---------5---------6---------7--------//

#ifndef X0_BASE_OBJECT_H
#define X0_BASE_OBJECT_H

#include "x0BaseElement.h"
#include <vector>
#include <memory>
#include <functional>

namespace x0 {

/**
 * @brief Base object class with hierarchical child management
 * 
 * This class extends x0BaseElement to provide hierarchical object management,
 * supporting parent-child relationships, recursive rendering, and event
 * propagation - equivalent to sysBaseObject.js.
 */
class x0BaseObject : public x0BaseElement {
    Q_OBJECT

public:
    explicit x0BaseObject(QObject* parent = nullptr);
    virtual ~x0BaseObject();

    // Child object management
    void addObject(std::shared_ptr<x0BaseObject> childObject);
    void removeObject(int index);
    void removeObject(x0BaseObject* child);
    std::shared_ptr<x0BaseObject> getChildByIndex(int index) const;
    int getChildIndexById(const QString& id) const;
    int getChildCount() const;
    const std::vector<std::shared_ptr<x0BaseObject>>& getChildObjects() const;

    // Object lookup
    x0BaseObject* getObjectById(const QString& objectId);
    std::vector<x0BaseObject*> getObjectsByType(const QString& objectType);
    std::vector<x0BaseObject*> getObjectsByAttribute(const QString& attribute);
    std::map<QString, x0BaseObject*> getAllObjects();

    // Parent management
    void setParentObject(x0BaseObject* parent);
    x0BaseObject* getParentObject() const;

    // Object type and configuration
    void setObjectType(const QString& type) { m_objectType = type; }
    QString getObjectType() const { return m_objectType; }
    void setJsonConfig(const json& config) { m_jsonConfig = config; }
    const json& getJsonConfig() const { return m_jsonConfig; }

    // Rendering
    virtual void renderObject(const QString& prefix = QString());
    virtual void init();
    virtual void reset();
    virtual void updateValue();

    // State management
    void setActivated();
    void setDeactivated();
    bool isDeactivated() const { return m_deactivated; }

    // Data management
    virtual json getObjectData();
    virtual void setObjectData(const json& data);
    virtual void appendObjectData(const json& data);

    // Recursive processing
    void processReset();
    void processUpdate();
    void processEventListeners();

    // Event listeners
    using EventCallback = std::function<void(QEvent*)>;
    void addEventListener(const QString& type, EventCallback callback);
    void removeEventListener(const QString& type);

protected:
    std::vector<std::shared_ptr<x0BaseObject>> m_childObjects;
    x0BaseObject* m_parentObject = nullptr;
    QString m_objectType;
    json m_jsonConfig;
    bool m_deactivated = false;
    bool m_overrideDomObjectId = false;
    int m_hierarchyLevel = 0;

    std::map<QString, EventCallback> m_eventListeners;

    // Helper for recursive object collection
    void collectObjects(std::map<QString, x0BaseObject*>& items);
};

} // namespace x0

#endif // X0_BASE_OBJECT_H
