//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- x0 C++ Framework - Factory Implementation                                -//
//-------1---------2---------3---------4---------5---------6---------7--------//

#include "x0Factory.h"
#include "x0ObjDiv.h"
#include "x0ObjButton.h"
#include <QDebug>

namespace x0 {

x0Factory::x0Factory(QObject* parent)
    : QObject(parent)
    , m_reactor(std::make_unique<x0Reactor>(this))
    , m_userLanguage("en")
{
    // Register default object types
    registerObjectType("Div", []() { return std::make_shared<x0ObjDiv>(); });
    registerObjectType("Button", []() { return std::make_shared<x0ObjButton>(); });
}

x0Factory::~x0Factory() = default;

x0Factory& x0Factory::instance()
{
    static x0Factory instance;
    return instance;
}

void x0Factory::init()
{
    qDebug() << "x0Factory::init() - Initializing system";
    
    // Process skeleton data and create screens
    if (m_dataSkeleton.is_object()) {
        for (auto& [screenId, screenData] : m_dataSkeleton.items()) {
            qDebug() << "x0Factory::init() - Adding screen:" << QString::fromStdString(screenId);
            addScreen(QString::fromStdString(screenId), screenData);
        }
    }
    
    // Set up all screens
    for (auto& [screenId, screen] : m_screens.toStdMap()) {
        screen->setup();
    }
    
    // Switch to default screen
    if (!m_displayDefaultScreen.isEmpty()) {
        switchScreen(m_displayDefaultScreen);
    }
    
    // Dispatch init system event
    m_reactor->dispatchEvent("InitSystem");
    
    emit initSystemComplete();
}

void x0Factory::registerObjectType(const QString& type, ObjectCreator creator)
{
    m_objectCreators[type] = creator;
}

std::shared_ptr<x0BaseObject> x0Factory::createObject(const QString& type)
{
    auto it = m_objectCreators.find(type);
    if (it != m_objectCreators.end()) {
        return it.value()();
    }
    
    qDebug() << "x0Factory::createObject() - Unknown type:" << type << "- creating default Div";
    return std::make_shared<x0ObjDiv>();
}

x0Screen* x0Factory::addScreen(const QString& screenId, const json& skeletonData)
{
    auto screen = std::make_shared<x0Screen>();
    screen->setScreenId(screenId);
    screen->setSkeletonData(skeletonData);
    
    // Set JSON config if available
    if (m_screenConfig.contains(screenId.toStdString())) {
        screen->setJsonConfig(m_screenConfig[screenId.toStdString()]);
    }
    
    m_screens[screenId] = screen;
    
    return screen.get();
}

x0Screen* x0Factory::getScreenById(const QString& screenId)
{
    auto it = m_screens.find(screenId);
    if (it != m_screens.end()) {
        return it.value().get();
    }
    return nullptr;
}

QMap<QString, std::shared_ptr<x0Screen>>& x0Factory::getScreens()
{
    return m_screens;
}

x0Screen* x0Factory::getLastScreenObject()
{
    if (m_screens.isEmpty()) return nullptr;
    return m_screens.last().get();
}

void x0Factory::switchScreen(const QString& screenId)
{
    qDebug() << "x0Factory::switchScreen() ScreenID:" << screenId << "Current:" << m_currentScreenId;
    
    if (screenId.isEmpty()) return;
    
    x0Screen* screen = getScreenById(screenId);
    if (!screen) {
        qDebug() << "x0Factory::switchScreen() - Screen not found:" << screenId;
        return;
    }
    
    // Switch all screens to background
    switchScreensToBackground();
    
    // Update current screen ID
    m_currentScreenId = screenId;
    
    // Switch selected screen to foreground
    switchScreenToForeground(screen);
    
    // Trigger screen data load
    triggerScreenDataLoad(screenId);
    
    emit screenSwitched(screenId);
}

void x0Factory::switchScreensToBackground()
{
    for (auto& [screenId, screen] : m_screens.toStdMap()) {
        auto rootObj = screen->getHierarchyRootObject();
        if (rootObj) {
            rootObj->setVisibleState("hidden");
        }
    }
}

void x0Factory::switchScreenToForeground(x0Screen* screen)
{
    if (!screen) return;
    
    auto rootObj = screen->getHierarchyRootObject();
    if (rootObj) {
        rootObj->setVisibleState("visible");
    }
}

void x0Factory::triggerScreenDataLoad(const QString& screenId)
{
    x0Screen* screen = getScreenById(screenId);
    if (screen) {
        screen->triggerGlobalDataLoad();
    }
}

x0BaseObject* x0Factory::getObjectById(const QString& objectId)
{
    for (auto& [screenId, screen] : m_screens.toStdMap()) {
        auto rootObj = screen->getHierarchyRootObject();
        if (rootObj) {
            x0BaseObject* result = rootObj->getObjectById(objectId);
            if (result) return result;
        }
    }
    return nullptr;
}

std::map<QString, std::vector<x0BaseObject*>> x0Factory::getObjectsByAttribute(const QString& attribute)
{
    std::map<QString, std::vector<x0BaseObject*>> result;
    
    for (auto& [screenId, screen] : m_screens.toStdMap()) {
        auto rootObj = screen->getHierarchyRootObject();
        if (rootObj) {
            result[screenId] = rootObj->getObjectsByAttribute(attribute);
        }
    }
    
    return result;
}

std::vector<x0BaseObject*> x0Factory::getObjectsByType(const QString& screenId, const QString& type)
{
    x0Screen* screen = getScreenById(screenId);
    if (!screen) return {};
    
    auto rootObj = screen->getHierarchyRootObject();
    if (!rootObj) return {};
    
    return rootObj->getObjectsByType(type);
}

json x0Factory::getGlobalVar(const QString& key) const
{
    if (m_globalData.contains(key.toStdString())) {
        return m_globalData[key.toStdString()];
    }
    return json();
}

QString x0Factory::getText(const QString& textId) const
{
    try {
        if (m_textData.contains(textId.toStdString())) {
            const json& textObj = m_textData[textId.toStdString()];
            if (textObj.contains(m_userLanguage.toStdString())) {
                return QString::fromStdString(textObj[m_userLanguage.toStdString()].get<std::string>());
            }
        }
    } catch (const std::exception& e) {
        qDebug() << "x0Factory::getText() - Text not found for ID:" << textId;
    }
    
    return "Missing Text with ID:" + textId;
}

void x0Factory::registerUserFunction(const QString& functionId, std::function<void()> func)
{
    m_userFunctions[functionId] = func;
}

std::function<void()> x0Factory::getUserFunction(const QString& functionId)
{
    auto it = m_userFunctions.find(functionId);
    if (it != m_userFunctions.end()) {
        return it.value();
    }
    return nullptr;
}

void x0Factory::resetErrorContainer()
{
    auto errorContainers = getObjectsByType(m_currentScreenId, "ErrorContainer");
    for (auto* container : errorContainers) {
        if (container) {
            container->reset();
        }
    }
}

void x0Factory::setupObjectRefsRecursive(const json& objDefs, x0BaseObject* refObj)
{
    if (!objDefs.is_array() || !refObj) return;
    
    for (const auto& objItem : objDefs) {
        if (!objItem.contains("SysObject")) continue;
        
        QString objectId;
        if (objItem.contains("id")) {
            objectId = QString::fromStdString(objItem["id"].get<std::string>());
        }
        
        // Create the object based on type or configuration
        auto currentObject = createObject("Div"); // Default to Div
        currentObject->setObjectId(objectId);
        
        if (objItem.contains("JSONAttributes")) {
            json config;
            config["Attributes"] = objItem["JSONAttributes"];
            currentObject->setJsonConfig(config);
        }
        
        try {
            currentObject->init();
        } catch (const std::exception& e) {
            qDebug() << "x0Factory::setupObjectRefsRecursive() init error:" << e.what();
        }
        
        refObj->addObject(currentObject);
        
        // Recurse if there are nested object definitions
        if (objItem.contains("ObjectDefs")) {
            setupObjectRefsRecursive(objItem["ObjectDefs"], currentObject.get());
        }
    }
}

} // namespace x0
