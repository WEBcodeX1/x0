//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- x0 C++ Framework - Object Factory                                        -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Equivalent to JavaScript: sysFactory.js                                  -//
//-------1---------2---------3---------4---------5---------6---------7--------//

#ifndef X0_FACTORY_H
#define X0_FACTORY_H

#include "x0Screen.h"
#include "x0Reactor.h"
#include <QObject>
#include <QMap>
#include <QString>
#include <memory>
#include <functional>

namespace x0 {

// Forward declarations
class x0BaseObject;

/**
 * @brief Factory class for creating and managing x0 objects
 * 
 * This singleton class serves as the central hub for object creation,
 * screen management, and global state management. Equivalent to
 * sysFactory.js in the JavaScript version.
 */
class x0Factory : public QObject {
    Q_OBJECT

public:
    // Singleton access
    static x0Factory& instance();

    // Prevent copying
    x0Factory(const x0Factory&) = delete;
    x0Factory& operator=(const x0Factory&) = delete;

    // Initialization
    void init();

    // Object creation registry
    using ObjectCreator = std::function<std::shared_ptr<x0BaseObject>()>;
    void registerObjectType(const QString& type, ObjectCreator creator);
    std::shared_ptr<x0BaseObject> createObject(const QString& type);

    // Screen management
    x0Screen* addScreen(const QString& screenId, const json& skeletonData);
    x0Screen* getScreenById(const QString& screenId);
    QMap<QString, std::shared_ptr<x0Screen>>& getScreens();
    x0Screen* getLastScreenObject();

    // Screen switching
    void switchScreen(const QString& screenId);
    void switchScreensToBackground();
    void switchScreenToForeground(x0Screen* screen);
    void triggerScreenDataLoad(const QString& screenId);
    QString getCurrentScreenId() const { return m_currentScreenId; }

    // Object lookup
    x0BaseObject* getObjectById(const QString& objectId);
    std::map<QString, std::vector<x0BaseObject*>> getObjectsByAttribute(const QString& attribute);
    std::vector<x0BaseObject*> getObjectsByType(const QString& screenId, const QString& type);

    // Global data
    void setDataSkeleton(const json& data) { m_dataSkeleton = data; }
    const json& getDataSkeleton() const { return m_dataSkeleton; }
    void setDataObject(const json& data) { m_dataObject = data; }
    const json& getDataObject() const { return m_dataObject; }
    void setDataMenu(const json& data) { m_dataMenu = data; }
    const json& getDataMenu() const { return m_dataMenu; }

    // Screen configuration
    void setScreenConfig(const json& config) { m_screenConfig = config; }
    const json& getScreenConfig() const { return m_screenConfig; }
    void setDefaultScreen(const QString& screenId) { m_displayDefaultScreen = screenId; }
    QString getDefaultScreen() const { return m_displayDefaultScreen; }

    // Styling
    void setDefaultStyleScreen(const QString& style) { m_defaultStyleScreen = style; }
    QString getDefaultStyleScreen() const { return m_defaultStyleScreen; }
    void setDefaultStyleMenu(const QString& style) { m_defaultStyleMenu = style; }
    QString getDefaultStyleMenu() const { return m_defaultStyleMenu; }

    // Global variables
    json getGlobalVar(const QString& key) const;
    void setGlobalData(const json& data) { m_globalData = data; }

    // Text/localization
    QString getText(const QString& textId) const;
    void setTextData(const json& data) { m_textData = data; }
    void setUserLanguage(const QString& lang) { m_userLanguage = lang; }
    QString getUserLanguage() const { return m_userLanguage; }

    // Reactor (event system)
    x0Reactor* getReactor() { return m_reactor.get(); }

    // User functions
    void registerUserFunction(const QString& functionId, std::function<void()> func);
    std::function<void()> getUserFunction(const QString& functionId);

    // Error container reset
    void resetErrorContainer();

    // Object hierarchy setup helper
    void setupObjectRefsRecursive(const json& objDefs, x0BaseObject* refObj);

signals:
    void initSystemComplete();
    void screenSwitched(const QString& screenId);

private:
    x0Factory(QObject* parent = nullptr);
    ~x0Factory();

    // Screen storage
    QMap<QString, std::shared_ptr<x0Screen>> m_screens;
    QString m_currentScreenId;
    QString m_displayDefaultScreen;

    // Data storage
    json m_dataSkeleton;
    json m_dataObject;
    json m_dataMenu;
    json m_screenConfig;
    json m_globalData;
    json m_textData;

    // Styling
    QString m_defaultStyleScreen;
    QString m_defaultStyleMenu;
    QString m_userLanguage;

    // Object creation registry
    QMap<QString, ObjectCreator> m_objectCreators;

    // Event reactor
    std::unique_ptr<x0Reactor> m_reactor;

    // User functions
    QMap<QString, std::function<void()>> m_userFunctions;

    // Overlay reference count
    int m_overlayRefCount = 0;
};

} // namespace x0

#endif // X0_FACTORY_H
