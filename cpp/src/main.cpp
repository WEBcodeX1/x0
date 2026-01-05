//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- x0 C++ Framework - Main Application Entry Point                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//- This demonstrates the x0 C++ framework with Qt and nlohmann::json        -//
//- Equivalent to the JavaScript version in /www/                            -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//

#include <QApplication>
#include <QMainWindow>
#include <QVBoxLayout>
#include <QFile>
#include <QTextStream>
#include <QDebug>

#include "x0Factory.h"
#include "x0Screen.h"
#include "x0ObjDiv.h"
#include "x0ObjButton.h"

using namespace x0;

/**
 * @brief Load JSON configuration from file
 * @param filename Path to JSON file
 * @return Parsed JSON object
 */
json loadJsonFromFile(const QString& filename) {
    QFile file(filename);
    if (!file.open(QIODevice::ReadOnly | QIODevice::Text)) {
        qWarning() << "Could not open file:" << filename;
        return json();
    }
    
    QTextStream in(&file);
    QString content = in.readAll();
    file.close();
    
    try {
        return json::parse(content.toStdString());
    } catch (const json::parse_error& e) {
        qWarning() << "JSON parse error:" << e.what();
        return json();
    }
}

/**
 * @brief Create a demo configuration for testing
 * @return Demo JSON configuration
 */
json createDemoConfig() {
    json skeleton = {
        {"MainScreen", json::array({
            {{"MainDiv", {{"RefID", "MainScreen"}}}},
            {{"WelcomeText", {{"RefID", "MainDiv"}}}},
            {{"ActionButton", {{"RefID", "MainDiv"}}}}
        })}
    };
    
    json dataObject = {
        {"MainDiv", {
            {"Type", "Div"},
            {"Attributes", {
                {"Style", "main-container"},
                {"Value", ""}
            }}
        }},
        {"WelcomeText", {
            {"Type", "Div"},
            {"Attributes", {
                {"Style", "welcome-text"},
                {"Value", "Welcome to x0 C++ Framework!"}
            }}
        }},
        {"ActionButton", {
            {"Type", "Button"},
            {"Attributes", {
                {"Style", "btn btn-primary"},
                {"TextID", "BTN.DEMO"},
                {"Action", "reset"},
                {"DstObjectID", "WelcomeText"}
            }}
        }}
    };
    
    json textData = {
        {"BTN.DEMO", {
            {"en", "Click Me!"},
            {"de", "Klick mich!"}
        }}
    };
    
    json config;
    config["skeleton"] = skeleton;
    config["dataObject"] = dataObject;
    config["textData"] = textData;
    config["defaultScreen"] = "MainScreen";
    
    return config;
}

/**
 * @brief Main application class demonstrating x0 framework usage
 */
class x0DemoWindow : public QMainWindow {
public:
    x0DemoWindow() {
        setWindowTitle("x0 C++ Framework Demo");
        setMinimumSize(800, 600);
        
        // Create central widget and layout
        auto* centralWidget = new QWidget(this);
        auto* layout = new QVBoxLayout(centralWidget);
        setCentralWidget(centralWidget);
        
        // Initialize the x0 factory with demo configuration
        initializeFramework();
        
        // Get the main screen's root widget and add it to layout
        x0Screen* mainScreen = x0Factory::instance().getScreenById("MainScreen");
        if (mainScreen) {
            auto rootObj = mainScreen->getHierarchyRootObject();
            if (rootObj && rootObj->getWidget()) {
                layout->addWidget(rootObj->getWidget());
            }
        }
    }
    
private:
    void initializeFramework() {
        // Create demo configuration
        json config = createDemoConfig();
        
        // Set up the factory with configuration
        x0Factory& factory = x0Factory::instance();
        
        factory.setDataSkeleton(config["skeleton"]);
        factory.setDataObject(config["dataObject"]);
        factory.setTextData(config["textData"]);
        factory.setDefaultScreen("MainScreen");
        factory.setUserLanguage("en");
        
        // Initialize the framework
        factory.init();
        
        qDebug() << "x0 Framework initialized successfully!";
    }
};

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);
    
    qDebug() << "Starting x0 C++ Framework Application";
    qDebug() << "====================================";
    qDebug() << "";
    qDebug() << "This application demonstrates the x0 C++ framework";
    qDebug() << "which is the Qt/C++ equivalent of the JavaScript";
    qDebug() << "framework found in /www/";
    qDebug() << "";
    qDebug() << "Features:";
    qDebug() << "  - Hierarchical object model (x0BaseObject)";
    qDebug() << "  - Qt widget integration (x0BaseElement)";
    qDebug() << "  - JSON configuration via nlohmann::json";
    qDebug() << "  - Screen management (x0Screen)";
    qDebug() << "  - Event system (x0Reactor)";
    qDebug() << "  - Object factory (x0Factory)";
    qDebug() << "";
    
    x0DemoWindow window;
    window.show();
    
    return app.exec();
}
