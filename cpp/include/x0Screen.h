//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- x0 C++ Framework - Screen Management                                     -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Equivalent to JavaScript: sysScreen.js                                   -//
//-------1---------2---------3---------4---------5---------6---------7--------//

#ifndef X0_SCREEN_H
#define X0_SCREEN_H

#include "x0BaseObject.h"
#include "x0ObjDiv.h"
#include <QMap>
#include <memory>

namespace x0 {

/**
 * @brief Screen class managing a hierarchical view of objects
 * 
 * This class represents a screen/view in the application, containing
 * a hierarchy of objects that can be rendered and managed together.
 * Equivalent to sysScreen.js in the JavaScript version.
 */
class x0Screen : public QObject {
    Q_OBJECT

public:
    explicit x0Screen(bool isOverlay = false, QObject* parent = nullptr);
    virtual ~x0Screen();

    // Screen identification
    void setScreenId(const QString& id) { m_screenId = id; }
    QString getScreenId() const { return m_screenId; }

    // Configuration
    void setSkeletonData(const json& data) { m_skeletonData = data; }
    const json& getSkeletonData() const { return m_skeletonData; }
    void setJsonConfig(const json& config) { m_jsonConfig = config; }
    const json& getJsonConfig() const { return m_jsonConfig; }

    // Style
    void setStyle(const QString& style = QString());
    void updateStyle(const QString& style);
    QString getCssStyle() const { return m_cssStyle; }

    // Setup and rendering
    void setup();
    void setupObject(const QString& objectId, x0BaseObject* hierarchyObject, int hierarchyLevel = 0);

    // Root object access
    std::shared_ptr<x0ObjDiv> getHierarchyRootObject() const { return m_hierarchyRootObject; }

    // Global variables
    void setGlobalVar(const QString& key, const json& value);
    json getGlobalVar(const QString& key) const;
    void setGlobalVars(const json& vars);
    json getGlobalVars() const;
    void mergeGlobalVars(const json& items);

    // Data loading
    void triggerGlobalDataLoad();

    // Overlay indicator
    bool isOverlay() const { return m_isOverlay; }

signals:
    void screenSetupComplete();
    void globalDataLoaded(const json& data);

protected:
    QString m_screenId;
    json m_skeletonData;
    json m_jsonConfig;
    QString m_cssStyle;
    bool m_isOverlay;

    std::shared_ptr<x0ObjDiv> m_hierarchyRootObject;
    json m_globalVars;

    // Helper methods
    json getSkeletonObjectsByRefId(const QString& objectId);
    void processOverwriteAttributes(json& config);
    void processReplaceAttributes(json& config, const json& refConfig);
};

} // namespace x0

#endif // X0_SCREEN_H
