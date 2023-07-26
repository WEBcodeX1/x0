import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

@pytest.fixture

def config():
    config = {}
    config["wait"] = 5
    config["options"] = webdriver.ChromeOptions()
    config["options"].add_argument('ignore-certificate-errors')
    config["options"].add_argument('headless')
    config["driver"] = webdriver.Chrome(options=config["options"])
    config["driver"].get("https://x0-app.kicker-finder.de/python/Index.py?appid=test_formfield_validation")
    return config

def is_valid_in_formfield(d, w, input, keys, submit, css_class):
    # Check the validity using the "css_class" parameter. Use
    # "FormFieldBorderValidateOk" to check for validity, or
    # "FormFieldBorderValidateFail" to check for invalidity.
    input_el = WebDriverWait(d, w).until(EC.presence_of_element_located(
        (By.ID, input)
    ))
    input_el.send_keys(keys)
    submit_el = d.find_element(By.ID, submit)
    submit_el.click()
    if css_class in input_el.get_attribute("class").split():
        return True
    else:
        return False

class TestFormFieldValidation:
    def test_default_string(self, config):
        """Check validation type DefaultString"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldDefaultString",
            "Vong 1 Ödipuskomplex maßlos gequält, übt Wilfried zyklisches Jodeln. äöüÄÖÜß +:;,=<>_§#&!?",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )

    def test_default_atoz(self, config):
        """Check validation type DefaultAtoZ"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldDefaultAtoZ",
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )

    def test_default_atoz_negative(self, config):
        """Check validation type DefaultAtoZ failing"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldDefaultAtoZ",
            "11111abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateFail"
        )

    def test_default_integer(self, config):
        """Check validation type DefaultInteger"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldDefaultInteger",
            "1234567890",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )

    def test_default_integer_negative(self, config):
        """Check validation type DefaultInteger failing"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldDefaultInteger",
            "aaaa1234567890",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateFail"
        )

    def test_default_integer_nullable(self, config):
        """Check validation type DefaultInteger nullable"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldDefaultInteger",
            "",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateFail"
        )

    def test_default_atozplusnumbers(self, config):
        """Check validation type AtoZPlusNumbers"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldDefaultAtoZPlusNumbers",
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )

    def test_default_atozplusnumbers_negative(self, config):
        """Check validation type AtoZPlusNumbers failing"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldDefaultAtoZPlusNumbers",
            "rstuvwxyz-RSTUVWXYZ0123456789!!!",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateFail"
        )

    def test_default_atozupper(self, config):
        """Check validation type DefaultAtoZUpper"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldDefaultAtoZUpper",
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )

    def test_default_atozupper_negative(self, config):
        """Check validation type DefaultAtoZUpper failing"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldDefaultAtoZUpper",
            "abcABC123",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateFail"
        )

    def test_default_dateinternational(self, config):
        """Check validation type DefaultDateInternational"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldDefaultDateInternational",
            "2021-12-24",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )

    def test_default_dateinternational_negative(self, config):
        """Check validation type DefaultDateInternational failing"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldDefaultDateInternational",
            "2021-13-24",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateFail"
        )

    def test_default_date(self, config):
        """Check validation type DefaultDate"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldDefaultDate",
            "24.12.2021",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )

    def test_default_date_negative(self, config):
        """Check validation type DefaultDate failing"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldDefaultDate",
            "24.13.2021",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateFail"
        )

    def test_default_datepicker(self, config):
        """Check validation type DefaultDatepicker"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldDefaultDatepicker",
            "2021-12-24", # TODO: not sure what i'm checking here
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )

    def test_zipcode(self, config):
        """Check validation type ZipCode"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldZipCode",
            "10245",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )

    def test_zipcode_negative(self, config):
        """Check validation type ZipCode failing"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldZipCode",
            "1021",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateFail"
        )

    def test_username(self, config):
        """Check validation type UserName"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldUserName",
            "John_Doe_1984",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )

    def test_username_negative(self, config):
        """Check validation type UserName failing"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldUserName",
            "John Baßler 1984",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateFail"
        )

    def test_realname(self, config):
        """Check validation type RealName"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldRealName",
            "Jeßica Lätizia-Käthe", # TODO: is this the firstname or full name?
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )

    def test_surename(self, config):
        """Check validation type Surename"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldSurename",
            "von Boßbörger-Schaumschläger",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )

    def test_userpass(self, config):
        """Check validation type UserPass"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldUserPass",
            "G5a_I#f#5TCkA!rF?8R3a",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )

    def test_usergroup(self, config):
        """Check validation type UserGroup"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldUserGroup",
            "User_Group23",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )

    def test_mailaddress(self, config):
        """Check validation type MailAddress"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldMailAddress",
            "j.von_boesboerger-schaumschlaeger@click-it.online",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )

    def test_mailaddress_negative(self, config):
        """Check validation type MailAddress failing"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldMailAddress",
            "j.schaumschläger@@@localhost.",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateFail"
        )

    def test_phonenrinternational(self, config):
        """Check validation type PhoneNrInternational"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldPhoneNrInternational",
            "+49 3591 123456789",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldPhoneNrInternational",
            "+493591123456789",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )

    def test_phonenr(self, config):
        """Check validation type PhoneNr"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldPhoneNr",
            "03591 123456789",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldPhoneNr",
            "03591123456789",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )

    def test_phonenrarea(self, config):
        """Check validation type PhoneNrArea"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldPhoneNrArea",
            "03591",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )

    def test_phonenrsingle(self, config):
        """Check validation type PhoneNrSingle"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldPhoneNrSingle",
            "123456789",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )

    def test_quantity(self, config):
        """Check validation type Quantity"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldQuantity",
            "123",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )

    def test_quantity_negative(self, config):
        """Check validation type Quantity failing"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldQuantity",
            "123 a",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateFail"
        )

    def test_country(self, config):
        """Check validation type Country"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldCountry",
            "DE",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldCountry",
            "US",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )

    def test_city(self, config):
        """Check validation type City"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldCity",
            "Bad Soden-Salmünster",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )

    def test_streetnr(self, config):
        """Check validation type StreetNr"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldStreetNr",
            "123d",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )

    def test_eurowithcents(self, config):
        """Check validation type EuroWithCents"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldEuroWithCents",
            "9000,23",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )

    def test_spx_barcode(self, config):
        """Check validation type SPXBarcode"""
        assert is_valid_in_formfield(
            config["driver"], config["wait"],
            "FormFieldSPXBarcode",
            "00354117494740431984",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )
