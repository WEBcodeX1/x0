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
wd_options.add_argument('window-size=1920,2400')
wd_options.add_argument('headless')


@pytest.fixture(scope='module')
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

    confparams = {}
    confparams["timeout"] = 10
    confparams["driver"] = wd

    get_url = '{}/python/Index.py?appid=test_formfield_validation'.format(vhost_test_urls['x0-app'])

    logger.info('test (get) url:{}'.format(get_url))

    confparams["driver"].get(get_url)

    return confparams

def is_valid_in_formfield(d, w, input, keys, submit, css_class):

    # Check the validity using the "css_class" parameter. Use
    # "alert-success" to check for validity, or "alert-danger" to check for invalidity.

    time.sleep(0.2)

    input_el = WebDriverWait(d, w).until(EC.presence_of_element_located(
        (By.ID, input)
    ))

    input_el.clear()
    input_el.send_keys(keys)

    input_enclose_el = WebDriverWait(d, w).until(EC.presence_of_element_located(
        (By.ID, '{}'.format(input))
    ))

    submit_el = d.find_element(
        By.CSS_SELECTOR, '#{}'.format(submit)
    )

    actions = ActionChains(d)
    actions.move_to_element(submit_el).perform()

    submit_el.click()

    if css_class in input_enclose_el.get_attribute("class").split():
        return True
    else:
        return False


class TestFormFieldValidation:

    def test_default_string_negative(self, config):
        """Check validation type DefaultString invalid"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultString",
            "\\hello __:{}",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultString",
            "%% not allowed",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultString",
            "Also § not allowed",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )

    def test_default_string(self, config):
        """Check validation type DefaultString"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultString",
            "Vong 1 Ödipuskomplex maßlos gequält, übt Wilfried zyklisches Jodeln. äöüÄÖÜß +:;,=<>_#&!?",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultString",
            "Hello this is a test-string!",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )

    def test_default_atoz_negative(self, config):
        """Check validation type DefaultAtoZ failing"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultAtoZ",
            "1234abcDF",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )

    def test_default_atoz(self, config):
        """Check validation type DefaultAtoZ"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultAtoZ",
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )

    def test_default_integer_nullable(self, config):
        """Check validation type DefaultInteger nullable"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultInteger",
            "",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )

    def test_default_integer_negative(self, config):
        """Check validation type DefaultInteger failing"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultInteger",
            "aaaa1234567890",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultInteger",
            "-1",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultInteger",
            "0.1",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultInteger",
            "0,1",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )

    def test_default_integer(self, config):
        """Check validation type DefaultInteger"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultInteger",
            "1234567890",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultInteger",
            "1",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultInteger",
            "123238768732648726387263876328746",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )

    def test_default_atozplusnumbers_negative(self, config):
        """Check validation type AtoZPlusNumbers failing"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultAtoZPlusNumbers",
            "rstuvwxyz-RSTUVWXYZ0123456789!!!",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )

    def test_default_atozplusnumbers(self, config):
        """Check validation type AtoZPlusNumbers"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultAtoZPlusNumbers",
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )

    def test_default_atozupper_negative(self, config):
        """Check validation type DefaultAtoZUpper failing"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultAtoZUpper",
            "abcABC123",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )

    def test_default_atozupper(self, config):
        """Check validation type DefaultAtoZUpper"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultAtoZUpper",
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )

    def test_default_dateinternational_negative(self, config):
        """Check validation type DefaultDateInternational failing"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultDateInternational",
            "abc",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultDateInternational",
            "2021-13-24",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultDateInternational",
            "2021-11-32",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultDateInternational",
            "2021-11-31",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultDateInternational",
            "2021-1-24",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultDateInternational",
            "2021-2-1",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultDateInternational",
            "21-12-24",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultDateInternational",
            "2022-12-2",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )

    def test_default_dateinternational(self, config):
        """Check validation type DefaultDateInternational"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultDateInternational",
            "2021-12-24",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultDateInternational",
            "2000-01-01",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultDateInternational",
            "1988-07-08",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultDateInternational",
            "1974-04-08",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultDateInternational",
            "2050-11-12",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )

    def test_default_date_negative(self, config):
        """Check validation type DefaultDate failing"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultDateGerman",
            "24.13.2021",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultDateGerman",
            "31.11.2021",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultDateGerman",
            "32.04.2021",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultDateGerman",
            "07.24.1981",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )

    def test_default_date(self, config):
        """Check validation type DefaultDate"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultDateGerman",
            "24.12.2021",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultDateGerman",
            "01.01.1973",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultDateGerman",
            "20.10.2098",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultDateGerman",
            "03.03.1845",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )

    def test_datepicker(self, config):
        """Check Datepicker International Date picker"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldDefaultDatepicker",
            "08/03/2022",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )

    def test_zipcode_negative(self, config):
        """Check validation type ZipCode failing"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldZipCodeGerman",
            "1021",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldZipCodeGerman",
            "01235",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldZipCodeGerman",
            "00000",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldZipCodeGerman",
            "000000",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldZipCodeGerman",
            "010000",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldZipCodeGerman",
            "00000",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldZipCodeGerman",
            "01000",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )

    def test_zipcode(self, config):
        """Check validation type ZipCodeGerman"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldZipCodeGerman",
            "10245",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldZipCodeGerman",
            "67316",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldZipCodeGerman",
            "37135",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldZipCodeGerman",
            "58731",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )

    def test_username_negative(self, config):
        """Check validation type UserName invalid"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldUserName",
            "John Baßler 1984",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )

    def test_username(self, config):
        """Check validation type UserName"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldUserName",
            "John_Doe_1984",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )

    def test_userpass(self, config):
        """Check validation type UserPass"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldUserPass",
            "G5a_I#f#5TCkA!rF?8R3a",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )

    def test_usergroup(self, config):
        """Check validation type UserGroup"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldUserGroup",
            "User_Group23",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )

    def test_mailaddress_negative(self, config):
        """Check validation type MailAddress invalid"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldMailAddress",
            "j.schaumschläger@@domain.com",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldMailAddress",
            "address@domain_test.de",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldMailAddress",
            "address:test@domaintest.org",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )

    def test_mailaddress(self, config):
        """Check validation type MailAddress"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldMailAddress",
            "j.von_boesboerger-schaumschlaeger@click-it.online",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )

    def test_phonenrinternational_negative(self, config):
        """Check validation type PhoneNrInternational invalid"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrInternational",
            "+49 35 91123456789",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrInternational",
            "+49 030 1233434",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrInternational",
            "+49 (030) 1233434",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrInternational",
            "+0 (20) 7863534",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrInternational",
            "+0(20)7863534",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrInternational",
            "+0(20) 7863534",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )

    def test_phonenrinternational(self, config):
        """Check validation type PhoneNrInternational"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrInternational",
            "+49 (3012) 123456789",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrInternational",
            "+49(30)123456789",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrInternational",
            "+1 (123) 123456789",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrInternational",
            "+44 (734) 123456789",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrInternational",
            "+44(734)123456789",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrInternational",
            "+44 (734)123456789",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrInternational",
            "+61 (123) 123456789",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrInternational",
            "+39 (22) 123456789",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )

    def test_phonenr_german_negative(self, config):
        """Check validation type PhoneNr invalid"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrGerman",
            "359 1123456789",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrGerman",
            "2131123456789",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrGerman",
            "2131123456789",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )

    def test_phonenr_german(self, config):
        """Check validation type PhoneNr"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrGerman",
            "0359 1123456789",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrGerman",
            "06356 6163",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrGerman",
            "063566163",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrGerman",
            "030 763454",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrGerman",
            "030 91634565",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrGerman",
            "0721 6362772",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrGerman",
            "07216362772",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )

    def test_phonenrarea_negative(self, config):
        """Check validation type PhoneNrArea invalid"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrAreaGerman",
            "3591",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrAreaGerman",
            "759123",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrAreaGerman",
            "085129123",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrAreaGerman",
            "abc",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrAreaGerman",
            "abc",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )

    def test_phonenrarea(self, config):
        """Check validation type PhoneNrArea"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrAreaGerman",
            "03591",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrAreaGerman",
            "0621",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldPhoneNrAreaGerman",
            "030",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )

    def test_quantity_negative(self, config):
        """Check validation type Quantity invalid"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldQuantity",
            "123 a",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldQuantity",
            "-1",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldQuantity",
            "073",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )

    def test_quantity(self, config):
        """Check validation type Quantity"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldQuantity",
            "123",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldQuantity",
            "5734",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )

    def test_country_negative(self, config):
        """Check validation type Country invalid"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldCountry",
            "XF",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldCountry",
            "QK",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldCountry",
            "LP",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )

    def test_country(self, config):
        """Check validation type Country"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldCountry",
            "DE",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldCountry",
            "US",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldCountry",
            "GB",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldCountry",
            "GD",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldCountry",
            "FO",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldCountry",
            "TR",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldCountry",
            "KR",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldCountry",
            "MX",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )

    def test_streetnr_negative(self, config):
        """Check validation type StreetNr invalid"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldStreetNr",
            "a123",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldStreetNr",
            "a123",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )

    def test_streetnr(self, config):
        """Check validation type StreetNr"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldStreetNr",
            "123c",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldStreetNr",
            "57 a",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldStreetNr",
            "57a",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldStreetNr",
            "0",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldStreetNr",
            "1",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )

    def test_eurowithcents_negative(self, config):
        """Check validation type EuroWithCents invalid"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldEuroWithCents",
            "000,23",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldEuroWithCents",
            "10,1",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldEuroWithCents",
            "-10",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldEuroWithCents",
            "5",
            "Test1_FormFieldSubmitButton",
            "alert-danger"
        )

    def test_eurowithcents(self, config):
        """Check validation type EuroWithCents"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldEuroWithCents",
            "9000,23",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldEuroWithCents",
            "20,57",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldEuroWithCents",
            "89,99",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )

    def test_barcode(self, config):
        """Check validation type Barcode"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldBarcode",
            "00754117494746431984",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldBarcode",
            "45804117594746437939",
            "Test1_FormFieldSubmitButton",
            "alert-success"
        )
        config["driver"].quit()
