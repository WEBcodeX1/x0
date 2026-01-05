//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- x0 C++ Framework - Div Container Widget                                  -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Equivalent to JavaScript: sysObjDiv.js                                   -//
//-------1---------2---------3---------4---------5---------6---------7--------//

#ifndef X0_OBJ_DIV_H
#define X0_OBJ_DIV_H

#include "x0BaseObject.h"
#include <QFrame>

namespace x0 {

/**
 * @brief Container widget class (equivalent to HTML div)
 * 
 * This class represents a container widget that can hold other widgets.
 * It's the Qt equivalent of the JavaScript sysObjDiv.js class and serves
 * as the basic building block for UI layouts.
 */
class x0ObjDiv : public x0BaseObject {
    Q_OBJECT

public:
    explicit x0ObjDiv(QObject* parent = nullptr);
    virtual ~x0ObjDiv();

    // Override base methods
    void createWidget(const QString& objectId) override;
    void init() override;
    void reset() override;

    // Div-specific functionality
    void setDomType(const QString& type);
    QString getDomType() const { return m_domType; }

    // Get the underlying QFrame
    QFrame* getFrame() const;

protected:
    QString m_domType = "div";
};

} // namespace x0

#endif // X0_OBJ_DIV_H
