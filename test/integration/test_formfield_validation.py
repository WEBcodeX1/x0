import os
import json
import time
import pytest
import logging

import globalconf

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger()

wd_options = webdriver.ChromeOptions()
wd_options.add_argument('ignore-certificate-errors')
wd_options.add_argument('headless')
wd_options.add_argument('window-size=1920,2400')


@pytest.fixture
def config():

    try:
        run_namespace = os.environ['RUN_NAMESPACE']
    except Exception as e:
        run_namespace = None

    try:
        run_kube_env = os.environ['KUBERNETES_SERVICE_HOST']
    except Exception as e:
        run_kube_env = None

    try:
        domain_suffix = '.' + run_namespace
    except Exception as e:
        domain_suffix = ''

    if run_kube_env is not None:
        domain_suffix += '.svc.cluster.local'

    vhost_test_urls = globalconf.setup()

    logger.info('test urls:{}'.format(vhost_test_urls))

    selenium_server_url = 'http://selenium-server-0{}:4444'.format(domain_suffix)

    logger.info('selenium server url:{}'.format(selenium_server_url))

    wd = webdriver.Remote(
        command_executor=selenium_server_url,
        options=wd_options
    )

    config = {}
    config["timeout"] = 10
    config["driver"] = wd

    get_url = '{}/python/Index.py?appid=test_formfield_validation'.format(vhost_test_urls['x0-app'])

    logger.info('test (get) url:{}'.format(get_url))

    config["driver"].get(get_url)

    return config

def is_valid_in_formfield(d, w, input, keys, submit, css_class):

    # Check the validity using the "css_class" parameter. Use
    # "FormFieldBorderValidateOk" to check for validity, or
    # "FormFieldBorderValidateFail" to check for invalidity.

    input_el = WebDriverWait(d, w).until(EC.presence_of_element_located(
        (By.ID, input)
    ))
    input_el.send_keys(keys)

    submit_el = d.find_element(
        By.CSS_SELECTOR, '#{}'.format(submit)
    )

    #actions = ActionChains(d)
    #actions.move_to_element(submit_el).perform()

    submit_el.click()

    if css_class in input_el.get_attribute("class").split():
        return True
    else:
        return False


class TestFormFieldValidation:

    def test_default_string(self, config):
        """Check validation type DefaultString"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultString",
            "Vong 1 Ödipuskomplex maßlos gequält, übt Wilfried zyklisches Jodeln. äöüÄÖÜß +:;,=<>_§#&!?",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )
        config["driver"].quit()

    def test_default_atoz(self, config):
        """Check validation type DefaultAtoZ"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultAtoZ",
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )
        config["driver"].quit()

    def test_default_atoz_negative(self, config):
        """Check validation type DefaultAtoZ failing"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultAtoZ",
            "11111abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateFail"
        )
        config["driver"].quit()

    def test_default_integer(self, config):
        """Check validation type DefaultInteger"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultInteger",
            "1234567890",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )
        config["driver"].quit()

    def test_default_integer_negative(self, config):
        """Check validation type DefaultInteger failing"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultInteger",
            "aaaa1234567890",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateFail"
        )
        config["driver"].quit()

    def test_default_integer_nullable(self, config):
        """Check validation type DefaultInteger nullable"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultInteger",
            "",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateFail"
        )
        config["driver"].quit()

    def test_default_atozplusnumbers(self, config):
        """Check validation type AtoZPlusNumbers"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultAtoZPlusNumbers",
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )
        config["driver"].quit()

    def test_default_atozplusnumbers_negative(self, config):
        """Check validation type AtoZPlusNumbers failing"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultAtoZPlusNumbers",
            "rstuvwxyz-RSTUVWXYZ0123456789!!!",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateFail"
        )
        config["driver"].quit()

    def test_default_atozupper(self, config):
        """Check validation type DefaultAtoZUpper"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultAtoZUpper",
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )
        config["driver"].quit()

    def test_default_atozupper_negative(self, config):
        """Check validation type DefaultAtoZUpper failing"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultAtoZUpper",
            "abcABC123",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateFail"
        )
        config["driver"].quit()

    def test_default_dateinternational(self, config):
        """Check validation type DefaultDateInternational"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultDateInternational",
            "2021-12-24",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )
        config["driver"].quit()

#    def test_default_dateinternational_negative(self, config):
#        """Check validation type DefaultDateInternational failing"""
#        assert is_valid_in_formfield(
#            config["driver"], config["timeout"],
#            "FormFieldDefaultDateInternational",
#            "2021-13-24",
#            "Test1_FormFieldSubmitButton",
#            "FormFieldBorderValidateFail"
#        )

    def test_default_date(self, config):
        """Check validation type DefaultDate"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultDate",
            "24.12.2021",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )
        config["driver"].quit()

#    def test_default_date_negative(self, config):
#        """Check validation type DefaultDate failing"""
#        assert is_valid_in_formfield(
#            config["driver"], config["timeout"],
#            "FormFieldDefaultDate",
#            "24.13.2021",
#            "Test1_FormFieldSubmitButton",
#            "FormFieldBorderValidateFail"
#        )

#    def test_default_datepicker(self, config):
#        """Check validation type DefaultDatepicker"""
#        assert is_valid_in_formfield(
#            config["driver"], config["timeout"],
#            "FormFieldDefaultDatepicker",
#            "2021-12-24",
#            "Test1_FormFieldSubmitButton",
#            "FormFieldBorderValidateOk"
#        )

    def test_zipcode(self, config):
        """Check validation type ZipCode"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldZipCode",
            "10245",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )
        config["driver"].quit()

    def test_zipcode_negative(self, config):
        """Check validation type ZipCode failing"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldZipCode",
            "1021",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateFail"
        )
        config["driver"].quit()

    def test_username(self, config):
        """Check validation type UserName"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldUserName",
            "John_Doe_1984",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )
        config["driver"].quit()

    def test_username_negative(self, config):
        """Check validation type UserName failing"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldUserName",
            "John Baßler 1984",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateFail"
        )
        config["driver"].quit()

#TODO: missing "-" and "ß" in ValidateRegex, must be
#    def test_realname(self, config):
#        """Check validation type RealName"""
#        assert is_valid_in_formfield(
#            config["driver"], config["timeout"],
#            "FormFieldRealName",
#            "Jeßica Lätizia-Käthe", # TODO: is this the firstname or full name?
#            "Test1_FormFieldSubmitButton",
#            "FormFieldBorderValidateOk"
#        )

#TODO: missing "-" and "ß" in corresponding ValidateRegex must be added
#    def test_surename(self, config):
#        """Check validation type Surename"""
#        assert is_valid_in_formfield(
#            config["driver"], config["timeout"],
#            "FormFieldSurename",
#            "von Boßbörger-Schaumschläger",
#            "Test1_FormFieldSubmitButton",
#            "FormFieldBorderValidateOk"
#        )

    def test_userpass(self, config):
        """Check validation type UserPass"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldUserPass",
            "G5a_I#f#5TCkA!rF?8R3a",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )
        config["driver"].quit()

    def test_usergroup(self, config):
        """Check validation type UserGroup"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldUserGroup",
            "User_Group23",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )
        config["driver"].quit()

#TODO: missing "_" in corresponding ValidateRegex must be added
#    def test_mailaddress(self, config):
#        """Check validation type MailAddress"""
#        assert is_valid_in_formfield(
#            config["driver"], config["timeout"],
#            "FormFieldMailAddress",
#            "j.von_boesboerger-schaumschlaeger@click-it.online",
#            "Test1_FormFieldSubmitButton",
#            "FormFieldBorderValidateOk"
#        )

    def test_mailaddress_negative(self, config):
        """Check validation type MailAddress failing"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldMailAddress",
            "j.schaumschläger@@@localhost.",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateFail"
        )
        config["driver"].quit()

#TODO: regex in ValidateRegex wrong, "? (optional) wrong format"
    def test_phonenrinternational(self, config):
        """Check validation type PhoneNrInternational"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrInternational",
            "+49 (3012) 123456789",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )
#        assert is_valid_in_formfield(
#            config["driver"], config["timeout"],
#            "FormFieldPhoneNrInternational",
#            "+49 35 91123456789",
#            "Test1_FormFieldSubmitButton",
#            "FormFieldBorderValidateOk"
#        )
        config["driver"].quit()

#TODO: regex in ValidateRegex wrong, leading brackets must be optional
    def test_phonenr(self, config):
        """Check validation type PhoneNr"""
#        assert is_valid_in_formfield(
#            config["driver"], config["timeout"],
#            "FormFieldPhoneNr",
#            "03591 123456789",
#            "Test1_FormFieldSubmitButton",
#            "FormFieldBorderValidateOk"
#        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNr",
            "(0359) 1123456789",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )
        config["driver"].quit()

    def test_phonenrarea(self, config):
        """Check validation type PhoneNrArea"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrArea",
            "03591",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )
        config["driver"].quit()

    def test_phonenrsingle(self, config):
        """Check validation type PhoneNrSingle"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrSingle",
            "123456789",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )
        config["driver"].quit()

    def test_quantity(self, config):
        """Check validation type Quantity"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldQuantity",
            "123",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )
        config["driver"].quit()

    def test_quantity_negative(self, config):
        """Check validation type Quantity failing"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldQuantity",
            "123 a",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateFail"
        )
        config["driver"].quit()

#TODO: incorrect ValidateRegex, correct!
    def test_country(self, config):
        """Check validation type Country"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldCountry",
            "DE",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )
#        assert is_valid_in_formfield(
#            config["driver"], config["timeout"],
#            "FormFieldCountry",
#            "EN",
#            "Test1_FormFieldSubmitButton",
#            "FormFieldBorderValidateOk"
#        )
        config["driver"].quit()

#TODO: missing "-" and " " in corresponding ValidateRegex must be added
#    def test_city(self, config):
#        """Check validation type City"""
#        assert is_valid_in_formfield(
#            config["driver"], config["timeout"],
#            "FormFieldCity",
#            "Bad Soden-Salmünster",
#            "Test1_FormFieldSubmitButton",
#            "FormFieldBorderValidateOk"
#        )

#TODO: incorrect ValidateRegex, a space between numbers and letter according to DIN 5008
    def test_streetnr(self, config):
        """Check validation type StreetNr"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldStreetNr",
            "123c",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )
        config["driver"].quit()

    def test_eurowithcents(self, config):
        """Check validation type EuroWithCents"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldEuroWithCents",
            "9000,23",
            "Test1_FormFieldSubmitButton",
            "FormFieldBorderValidateOk"
        )
        config["driver"].quit()

#TODO: incorrect ValidateRegex, correct!
#    def test_spx_barcode(self, config):
#        """Check validation type SPXBarcode"""
#        assert is_valid_in_formfield(
#            config["driver"], config["timeout"],
#            "FormFieldSPXBarcode",
#            "00354117494740431984",
#            "Test1_FormFieldSubmitButton",
#            "FormFieldBorderValidateOk"
#        )
