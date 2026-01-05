//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- x0 C++ Framework - Screen Implementation                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//

#include "x0Screen.h"
#include "x0Factory.h"
#include <QDebug>

namespace x0 {

x0Screen::x0Screen(bool isOverlay, QObject* parent)
    : QObject(parent)
    , m_isOverlay(isOverlay)
    , m_hierarchyRootObject(std::make_shared<x0ObjDiv>())
{
    setStyle();
}

x0Screen::~x0Screen() = default;

void x0Screen::setStyle(const QString& style)
{
    if (style.isEmpty()) {
        QString defaultStyle = x0Factory::instance().getDefaultStyleScreen();
        m_cssStyle = !defaultStyle.isEmpty() ? defaultStyle : "sysScreenRoot col-10";
    } else {
        m_cssStyle = style;
    }
}

void x0Screen::updateStyle(const QString& style)
{
    m_hierarchyRootObject->setStyleClass(style);
}

void x0Screen::setup()
{
    qDebug() << "x0Screen::setup() ScreenID:" << m_screenId;
    
    // Set up root object
    QString rootId = m_isOverlay ? m_screenId + "__overlay" : m_screenId;
    m_hierarchyRootObject->setObjectId(rootId);
    m_hierarchyRootObject->setStyleClass(m_cssStyle);
    
    // Setup object hierarchy
    setupObject(m_screenId, m_hierarchyRootObject.get());
    
    // Render the screen
    m_hierarchyRootObject->renderObject();
    
    // Process reset
    m_hierarchyRootObject->processReset();
    
    // Process event listeners
    m_hierarchyRootObject->processEventListeners();
    
    emit screenSetupComplete();
}

void x0Screen::setupObject(const QString& objectId, x0BaseObject* hierarchyObject, int hierarchyLevel)
{
    json skeletonObjects = getSkeletonObjectsByRefId(objectId);
    
    for (const auto& objectItem : skeletonObjects) {
        if (!objectItem.is_object()) continue;
        
        for (auto it = objectItem.begin(); it != objectItem.end(); ++it) {
            QString key = QString::fromStdString(it.key());
            const json& skeletonItem = it.value();
            
            try {
                // Get JSON config from data object
                const json& dataObject = x0Factory::instance().getDataObject();
                json jsonConfig;
                
                if (dataObject.contains(key.toStdString())) {
                    jsonConfig = dataObject[key.toStdString()];
                }
                
                // Handle RefID merging
                if (jsonConfig.contains("RefID")) {
                    QString refId = QString::fromStdString(jsonConfig["RefID"].get<std::string>());
                    if (dataObject.contains(refId.toStdString())) {
                        json refConfig = dataObject[refId.toStdString()];
                        // Merge configs
                        for (auto& el : refConfig.items()) {
                            if (!jsonConfig.contains(el.key())) {
                                jsonConfig[el.key()] = el.value();
                            }
                        }
                    }
                    processOverwriteAttributes(jsonConfig);
                }
                
                // Create object based on type
                QString objectType;
                if (jsonConfig.contains("Type")) {
                    objectType = QString::fromStdString(jsonConfig["Type"].get<std::string>());
                }
                
                auto newObject = x0Factory::instance().createObject(objectType);
                if (!newObject) {
                    qDebug() << "Failed to create object of type:" << objectType;
                    continue;
                }
                
                // Configure the new object
                newObject->setJsonConfig(jsonConfig);
                
                QString newObjectId = m_isOverlay ? key + "__overlay" : key;
                newObject->setObjectId(newObjectId);
                newObject->setObjectType(objectType);
                
                // Get parent ID from skeleton
                QString parentId;
                if (skeletonItem.contains("ElementID") && !skeletonItem["ElementID"].is_null()) {
                    parentId = QString::fromStdString(skeletonItem["ElementID"].get<std::string>());
                } else if (skeletonItem.contains("RefID")) {
                    parentId = QString::fromStdString(skeletonItem["RefID"].get<std::string>());
                }
                
                qDebug() << "x0Screen::setupObject() ObjectID:" << key << "ParentID:" << parentId;
                
                // Initialize the object
                newObject->init();
                
                // Add to hierarchy
                if (!parentId.isEmpty()) {
                    x0BaseObject* addToObject = x0Factory::instance().getObjectById(parentId);
                    if (addToObject) {
                        addToObject->addObject(newObject);
                    }
                } else {
                    hierarchyObject->addObject(newObject);
                }
                
                // Recurse
                setupObject(key, newObject.get(), hierarchyLevel + 1);
                
            } catch (const std::exception& e) {
                qDebug() << "x0Screen::setupObject() error for ObjectID:" << key << "error:" << e.what();
            }
        }
    }
}

json x0Screen::getSkeletonObjectsByRefId(const QString& objectId)
{
    json refObjects = json::array();
    
    const json& skeletonComplete = x0Factory::instance().getDataSkeleton();
    
    // Check each screen in the skeleton
    for (auto& [screenId, screenData] : skeletonComplete.items()) {
        if (!screenData.is_array()) continue;
        
        for (const auto& objectItem : screenData) {
            if (!objectItem.is_object()) continue;
            
            for (auto& [objectKey, processObj] : objectItem.items()) {
                if (processObj.contains("RefID")) {
                    QString refId = QString::fromStdString(processObj["RefID"].get<std::string>());
                    if (refId == objectId) {
                        json addObject;
                        addObject[objectKey] = processObj;
                        refObjects.push_back(addObject);
                    }
                }
            }
        }
    }
    
    return refObjects;
}

void x0Screen::processOverwriteAttributes(json& config)
{
    if (!config.contains("AttributesOverwrite")) return;
    
    const json& overwrite = config["AttributesOverwrite"];
    for (auto& [key, value] : overwrite.items()) {
        if (!config.contains("Attributes")) {
            config["Attributes"] = json::object();
        }
        config["Attributes"][key] = value;
    }
}

void x0Screen::processReplaceAttributes(json& config, [[maybe_unused]] const json& refConfig)
{
    // Note: refConfig reserved for future use with reference config merging
    
    if (!config.contains("AttributesReplace")) return;
    
    const json& replace = config["AttributesReplace"];
    for (const auto& item : replace) {
        if (!item.contains("DataSrc") || !item.contains("Data")) continue;
        
        const json& source = item["DataSrc"];
        const json& data = item["Data"];
        
        if (!config.contains("Attributes")) {
            config["Attributes"] = json::object();
        }
        
        if (source.size() == 1) {
            config["Attributes"][source[0].get<std::string>()] = data;
        } else if (source.size() == 2) {
            config["Attributes"][source[0].get<std::string>()][source[1].get<std::string>()] = data;
        }
    }
}

void x0Screen::setGlobalVar(const QString& key, const json& value)
{
    m_globalVars[key.toStdString()] = value;
}

json x0Screen::getGlobalVar(const QString& key) const
{
    if (m_globalVars.contains(key.toStdString())) {
        return m_globalVars[key.toStdString()];
    }
    return json();
}

void x0Screen::setGlobalVars(const json& vars)
{
    m_globalVars = vars;
}

json x0Screen::getGlobalVars() const
{
    return m_globalVars;
}

void x0Screen::mergeGlobalVars(const json& items)
{
    for (auto& [key, value] : items.items()) {
        m_globalVars[key] = value;
    }
}

void x0Screen::triggerGlobalDataLoad()
{
    qDebug() << "x0Screen::triggerGlobalDataLoad() JSONConfig:" << QString::fromStdString(m_jsonConfig.dump());
    
    // Trigger data load based on configuration
    if (m_jsonConfig.contains("OnScreenSwitch")) {
        // In a full implementation, this would make an async service call
        // For now, emit signal that data loading is needed
        emit globalDataLoaded(m_jsonConfig["OnScreenSwitch"]);
    }
}

} // namespace x0
