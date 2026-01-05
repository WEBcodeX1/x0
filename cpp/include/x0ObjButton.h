//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- x0 C++ Framework - Button Widget                                         -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Equivalent to JavaScript: sysObjButton.js                                -//
//-------1---------2---------3---------4---------5---------6---------7--------//

#ifndef X0_OBJ_BUTTON_H
#define X0_OBJ_BUTTON_H

#include "x0BaseObject.h"
#include <QPushButton>

namespace x0 {

/**
 * @brief Button widget class
 * 
 * This class represents a clickable button widget. It's the Qt equivalent
 * of the JavaScript sysObjButton.js class and handles click events,
 * form validation, and service calls.
 */
class x0ObjButton : public x0BaseObject {
    Q_OBJECT

public:
    explicit x0ObjButton(QObject* parent = nullptr);
    virtual ~x0ObjButton();

    // Override base methods
    void createWidget(const QString& objectId) override;
    void init() override;

    // Button-specific functionality
    void setButtonText(const QString& text);
    QString getButtonText() const;

    void setDisabled(bool disabled);
    bool isDisabled() const { return m_disabled; }

    // Form validation
    void validateForm();
    bool getValidateResultError() const { return m_validateResultError; }

    // Service calls
    void callService();
    void setCallUrl(const QString& url) { m_callUrl = url; }
    QString getCallUrl() const { return m_callUrl; }

    // Get the underlying QPushButton
    QPushButton* getButton() const;

signals:
    void clicked();
    void serviceCallComplete(const json& result);
    void validationComplete(bool success);

public slots:
    void onButtonClick();

protected:
    void processActions();
    void addNotifyHandler();

private:
    QString m_callUrl;
    bool m_disabled = false;
    bool m_validateResultError = true;
    bool m_formValidate = false;
    bool m_callService = false;
};

} // namespace x0

#endif // X0_OBJ_BUTTON_H
