//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- x0 C++ Framework - Base Element (Qt Widget Wrapper)                      -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Equivalent to JavaScript: sysBaseDOMElement.js                           -//
//-------1---------2---------3---------4---------5---------6---------7--------//

#ifndef X0_BASE_ELEMENT_H
#define X0_BASE_ELEMENT_H

#include <QWidget>
#include <QString>
#include <QMap>
#include <memory>
#include <nlohmann/json.hpp>

namespace x0 {

using json = nlohmann::json;

/**
 * @brief Base element class wrapping Qt widgets
 * 
 * This class provides the foundation for all UI elements in the x0 C++ framework.
 * It manages the underlying Qt widget and provides methods for styling,
 * visibility control, and event handling - equivalent to sysBaseDOMElement.js.
 */
class x0BaseElement : public QObject {
    Q_OBJECT

public:
    explicit x0BaseElement(QObject* parent = nullptr);
    virtual ~x0BaseElement();

    // Widget management
    virtual void createWidget(const QString& objectId);
    virtual QWidget* getWidget() const;
    void setParentWidget(QWidget* parent);

    // Style management
    void setStyleClass(const QString& styleClass);
    void addStyleClass(const QString& styleClass);
    void removeStyleClass(const QString& styleClass);
    bool hasStyleClass(const QString& styleClass) const;
    QString getStyleClasses() const;

    // Value management
    void setValue(const QString& value);
    QString getValue() const;

    // Visibility
    void setVisibleState(const QString& state);
    QString getVisibleState() const;
    void switchVisibleState();

    // Enable/Disable
    void enable();
    void disable();
    bool isEnabled() const;

    // Attributes
    void setAttribute(const QString& attribute, const QString& value);
    QString getAttribute(const QString& attribute) const;
    void setAttributes(const QMap<QString, QString>& attributes);

    // Style properties
    void setStyleTop(int top);
    void setStyleLeft(int left);
    void setStyleWidth(int width);
    void setStyleHeight(int height);
    void setStyleZIndex(int zIndex);
    void applyStyleAttributes();

    // Object identification
    QString getObjectId() const { return m_objectId; }
    void setObjectId(const QString& id) { m_objectId = id; }
    QString getParentId() const { return m_parentId; }
    void setParentId(const QString& id) { m_parentId = id; }

protected:
    std::unique_ptr<QWidget> m_widget;
    QString m_objectId;
    QString m_parentId;
    QString m_value;
    QString m_styleClass;
    QString m_visibleState;
    QMap<QString, QString> m_attributes;

    // Style positioning
    int m_styleTop = -1;
    int m_styleLeft = -1;
    int m_styleWidth = -1;
    int m_styleHeight = -1;
    int m_styleZIndex = -1;

    QStringList m_styleClasses;

signals:
    void visibilityChanged(bool visible);
    void styleChanged();
    void valueChanged(const QString& value);
};

} // namespace x0

#endif // X0_BASE_ELEMENT_H
