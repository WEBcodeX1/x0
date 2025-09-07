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

    get_url = '{}/python/Index.py?appid=test_formfield_validation2'.format(vhost_test_urls['x0-app'])

    logger.info('test (get) url:{}'.format(get_url))

    confparams["driver"].get(get_url)

    return confparams

def is_valid_in_formfield(d, w, input, keys, submit, css_class):

    # Check the validity using the "css_class" parameter. Use
    # "alert-success" to check for validity, or "alert-danger" to check for invalidity.

    time.sleep(0.1)

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


class TestFormFieldValidationFunctions:

    def test_function_float_negative(self, config):
        """Check validation type Float invalid"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldValueFloat",
            "a",
            "Test1_FormFieldSubmitButton1",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldValueFloat",
            "1,2",
            "Test1_FormFieldSubmitButton1",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldValueFloat",
            "-1,5",
            "Test1_FormFieldSubmitButton1",
            "alert-danger"
        )

    def test_function_float(self, config):
        """Check validation type Float"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldValueFloat",
            "1",
            "Test1_FormFieldSubmitButton1",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldValueFloat",
            "1.2",
            "Test1_FormFieldSubmitButton1",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldValueFloat",
            "-1.5",
            "Test1_FormFieldSubmitButton1",
            "alert-success"
        )

    def test_function_min_max_negative(self, config):
        """Check validation min/max invalid"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldValueMinMax",
            "1",
            "Test1_FormFieldSubmitButton1",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldValueMinMax",
            "-2",
            "Test1_FormFieldSubmitButton1",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldValueMinMax",
            "a",
            "Test1_FormFieldSubmitButton1",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldValueMinMax",
            "9",
            "Test1_FormFieldSubmitButton1",
            "alert-danger"
        )

    def test_function_min_max(self, config):
        """Check validation min/max"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldValueMinMax",
            "10",
            "Test1_FormFieldSubmitButton1",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldValueMinMax",
            "12",
            "Test1_FormFieldSubmitButton1",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldValueMinMax",
            "15",
            "Test1_FormFieldSubmitButton1",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldValueMinMax",
            "20",
            "Test1_FormFieldSubmitButton1",
            "alert-success"
        )

    def test_function_ipv4_address_negative(self, config):
        """Check validation type IPv4 address invalid"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv4Address",
            "0.2.3.4",
            "Test1_FormFieldSubmitButton1",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv4Address",
            "24.4.8.",
            "Test1_FormFieldSubmitButton1",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv4Address",
            "256.1.7.32",
            "Test1_FormFieldSubmitButton1",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv4Address",
            ".23.7.125",
            "Test1_FormFieldSubmitButton1",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv4Address",
            "34.734.23.834",
            "Test1_FormFieldSubmitButton1",
            "alert-danger"
        )

    def test_function_ipv4_address(self, config):
        """Check validation type IPv4 address"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv4Address",
            "10.27.34.3",
            "Test1_FormFieldSubmitButton1",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv4Address",
            "227.234.234.145",
            "Test1_FormFieldSubmitButton1",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv4Address",
            "14.22.8.1",
            "Test1_FormFieldSubmitButton1",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv4Address",
            "20.1.25.125",
            "Test1_FormFieldSubmitButton1",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv4Address",
            "245.245.245.245",
            "Test1_FormFieldSubmitButton1",
            "alert-success"
        )

    def test_function_ipv6_address_negative(self, config):
        """Check validation type IPv6 address invalid"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv6Address",
            "1.2.3.4",
            "Test1_FormFieldSubmitButton1",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv6Address",
            "a000:b000:c000:c000:c000:c000:c000:c000:",
            "Test1_FormFieldSubmitButton1",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv6Address",
            "a0002:b000:c000:c000:c000:c000:c000:c000:",
            "Test1_FormFieldSubmitButton1",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv6Address",
            ":a000:b000:c000:c000:c000:c000:c000:c000",
            "Test1_FormFieldSubmitButton1",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv6Address",
            "a000:b000:g000:c000:c000:c000:c000:c000",
            "Test1_FormFieldSubmitButton1",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv6Address",
            "a000b000c000c000c000c000c000c000",
            "Test1_FormFieldSubmitButton1",
            "alert-danger"
        )

    def test_function_ipv6_address(self, config):
        """Check validation type IPv6 address"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv6Address",
            "a27d:0000:0000:2034:0000:0000:34a4:20af",
            "Test1_FormFieldSubmitButton1",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv6Address",
            "2750:27ae:1020:1000:2af6:0000:34a4:20af",
            "Test1_FormFieldSubmitButton1",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv6Address",
            "7a4f:2030:00ba:7fe2:f020:0000:2030:20af",
            "Test1_FormFieldSubmitButton1",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv6Address",
            "1000:2000:3000:afe2:3e42:0000:34a4:20af",
            "Test1_FormFieldSubmitButton1",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv6Address",
            "7afe:a300:be23:afe2:3e42:0000:34a4:20af",
            "Test1_FormFieldSubmitButton1",
            "alert-success"
        )

    def test_function_ipv4_subnet_negative(self, config):
        """Check validation type IPv4 subnet invalid"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv4Subnet",
            "1.2.3.4",
            "Test1_FormFieldSubmitButton1",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv4Subnet",
            "128.255.255.0",
            "Test1_FormFieldSubmitButton1",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv4Subnet",
            "255.128.255.192",
            "Test1_FormFieldSubmitButton1",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv4Subnet",
            "0.255.255.255",
            "Test1_FormFieldSubmitButton1",
            "alert-danger"
        )

    def test_function_ipv4_subnet(self, config):
        """Check validation type IPv4 subnet"""

        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv4Subnet",
            "255.192.0.0",
            "Test1_FormFieldSubmitButton1",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv4Subnet",
            "192.0.0.0",
            "Test1_FormFieldSubmitButton1",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv4Subnet",
            "0.0.0.0",
            "Test1_FormFieldSubmitButton1",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPv4Subnet",
            "255.255.255.255",
            "Test1_FormFieldSubmitButton1",
            "alert-success"
        )

    def test_function_ipport_negative(self, config):
        """Check validation type IP port invalid"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPPort",
            "-1",
            "Test1_FormFieldSubmitButton1",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPPort",
            "-12",
            "Test1_FormFieldSubmitButton1",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPPort",
            "0",
            "Test1_FormFieldSubmitButton1",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPPort",
            "65536",
            "Test1_FormFieldSubmitButton1",
            "alert-danger"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPPort",
            "100000",
            "Test1_FormFieldSubmitButton1",
            "alert-danger"
        )

    def test_function_ipport(self, config):
        """Check validation type IP port"""
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPPort",
            "1",
            "Test1_FormFieldSubmitButton1",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPPort",
            "20",
            "Test1_FormFieldSubmitButton1",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPPort",
            "200",
            "Test1_FormFieldSubmitButton1",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPPort",
            "1200",
            "Test1_FormFieldSubmitButton1",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPPort",
            "22345",
            "Test1_FormFieldSubmitButton1",
            "alert-success"
        )
        assert is_valid_in_formfield(
            config["driver"], config["timeout"],
            "FormFieldIPPort",
            "65535",
            "Test1_FormFieldSubmitButton1",
            "alert-success"
        )

    def test_function_dns_record_negative(self, config):
        """Check validation type DNS record type invalid"""

        d, w = config["driver"], config["timeout"]
        wait = WebDriverWait(d, w)

        dnsrec_type = wait.until(EC.presence_of_element_located((By.ID, "FormFieldDNSRecordType")))
        dnsrec_value = wait.until(EC.presence_of_element_located((By.ID, "FormFieldDNSRecordValue")))
        btn_submit = wait.until(EC.presence_of_element_located((By.ID, "Test1_FormFieldSubmitButton1")))

        dnsrec_type.send_keys('A')
        dnsrec_value.send_keys('1.2.3.')
        btn_submit.click()

        assert 'alert-danger' in dnsrec_type.get_attribute("class") , "Result must be negative"

        dnsrec_type.clear()
        dnsrec_type.send_keys('A')
        dnsrec_value.clear()
        dnsrec_value.send_keys('300.20.81.45')
        btn_submit.click()

        assert 'alert-danger' in dnsrec_type.get_attribute("class") , "Result must be negative"

        dnsrec_type.clear()
        dnsrec_type.send_keys('A')
        dnsrec_value.clear()
        dnsrec_value.send_keys('300.20.81.45')
        btn_submit.click()

        assert 'alert-danger' in dnsrec_type.get_attribute("class") , "Result must be negative"

        dnsrec_type.clear()
        dnsrec_type.send_keys('AAAA')
        dnsrec_value.clear()
        dnsrec_value.send_keys('a472.x0.30.40.50.bc.30.c0')
        btn_submit.click()

        assert 'alert-danger' in dnsrec_type.get_attribute("class") , "Result must be negative"

        dnsrec_type.clear()
        dnsrec_type.send_keys('AAAA')
        dnsrec_value.clear()
        dnsrec_value.send_keys('a472.20.30.40.50.bc.30')
        btn_submit.click()

        assert 'alert-danger' in dnsrec_type.get_attribute("class") , "Result must be negative"

        dnsrec_type.clear()
        dnsrec_type.send_keys('CNAME')
        dnsrec_value.clear()
        dnsrec_value.send_keys('a/b')
        btn_submit.click()

        assert 'alert-danger' in dnsrec_type.get_attribute("class") , "Result must be negative"

        dnsrec_type.clear()
        dnsrec_type.send_keys('CNAME')
        dnsrec_value.clear()
        dnsrec_value.send_keys('ab(b)')
        btn_submit.click()

        assert 'alert-danger' in dnsrec_type.get_attribute("class") , "Result must be negative"

    def test_function_dns_record(self, config):
        """Check validation type DNS record type"""

        d, w = config["driver"], config["timeout"]
        wait = WebDriverWait(d, w)

        dnsrec_type = wait.until(EC.presence_of_element_located((By.ID, "FormFieldDNSRecordType")))
        dnsrec_value = wait.until(EC.presence_of_element_located((By.ID, "FormFieldDNSRecordValue")))
        btn_submit = wait.until(EC.presence_of_element_located((By.ID, "Test1_FormFieldSubmitButton1")))

        dnsrec_type.clear()
        dnsrec_type.send_keys('A')
        dnsrec_value.clear()
        dnsrec_value.send_keys('1.2.3.4')
        btn_submit.click()

        assert 'alert-success' in dnsrec_type.get_attribute("class") , "Result must be success"

        dnsrec_type.clear()
        dnsrec_type.send_keys('A')
        dnsrec_value.clear()
        dnsrec_value.send_keys('84.37.126.83')
        btn_submit.click()

        assert 'alert-success' in dnsrec_type.get_attribute("class") , "Result must be success"

        dnsrec_type.clear()
        dnsrec_type.send_keys('AAAA')
        dnsrec_value.clear()
        dnsrec_value.send_keys('27f2:a2cb:0:0:32ae:5730:2aef:0')
        btn_submit.click()

        assert 'alert-success' in dnsrec_type.get_attribute("class") , "Result must be success"

        dnsrec_type.clear()
        dnsrec_type.send_keys('CNAME')
        dnsrec_value.clear()
        dnsrec_value.send_keys('www.test.de')
        btn_submit.click()

        assert 'alert-success' in dnsrec_type.get_attribute("class") , "Result must be success"

    def test_group_check_differ_negative(self, config):
        """Check validation type group checkdiffer invalid"""

        d, w = config["driver"], config["timeout"]
        wait = WebDriverWait(d, w)

        unique1 = wait.until(EC.presence_of_element_located((By.ID, "FormFieldUnique1")))
        unique2 = wait.until(EC.presence_of_element_located((By.ID, "FormFieldUnique2")))
        unique3 = wait.until(EC.presence_of_element_located((By.ID, "FormFieldUnique3")))
        btn_submit = wait.until(EC.presence_of_element_located((By.ID, "Test1_FormFieldSubmitButton2")))

        unique1.send_keys('a')
        unique2.send_keys('a')
        unique3.send_keys('a')
        btn_submit.click()

        assert 'alert-danger' in unique1.get_attribute("class") , "Result must be negative"
        assert 'alert-danger' in unique2.get_attribute("class") , "Result must be negative"
        assert 'alert-danger' in unique3.get_attribute("class") , "Result must be negative"

        unique1.clear()
        unique1.send_keys('A')
        unique2.clear()
        unique2.send_keys('b')
        unique3.clear()
        unique3.send_keys('A')
        btn_submit.click()

        assert 'alert-danger' in unique1.get_attribute("class") , "Result must be negative"
        assert 'alert-danger' in unique2.get_attribute("class") , "Result must be negative"
        assert 'alert-danger' in unique3.get_attribute("class") , "Result must be negative"

    def test_group_check_differ(self, config):
        """Check validation type group checkdiffer invalid"""

        d, w = config["driver"], config["timeout"]
        wait = WebDriverWait(d, w)

        unique1 = wait.until(EC.presence_of_element_located((By.ID, "FormFieldUnique1")))
        unique2 = wait.until(EC.presence_of_element_located((By.ID, "FormFieldUnique2")))
        unique3 = wait.until(EC.presence_of_element_located((By.ID, "FormFieldUnique3")))
        btn_submit = wait.until(EC.presence_of_element_located((By.ID, "Test1_FormFieldSubmitButton2")))

        unique1.send_keys('A')
        unique2.send_keys('b')
        unique3.send_keys('c')
        btn_submit.click()

        assert 'alert-success' in unique1.get_attribute("class") , "Result must be success"
        assert 'alert-success' in unique2.get_attribute("class") , "Result must be success"
        assert 'alert-success' in unique3.get_attribute("class") , "Result must be success"

        unique1.clear()
        unique1.send_keys('A')
        unique2.clear()
        unique2.send_keys('b')
        unique3.clear()
        unique3.send_keys('C')
        btn_submit.click()

        assert 'alert-success' in unique1.get_attribute("class") , "Result must be success"
        assert 'alert-success' in unique2.get_attribute("class") , "Result must be success"
        assert 'alert-success' in unique3.get_attribute("class") , "Result must be success"

    def test_group_check_date_period_1year_negative1(self, config):
        """Check validation type group check date period 1year invalid nr1"""

        d, w = config["driver"], config["timeout"]
        wait = WebDriverWait(d, w)

        date_start = wait.until(EC.presence_of_element_located((By.ID, "FormFieldDateFrom")))
        date_end = wait.until(EC.presence_of_element_located((By.ID, "FormFieldDateTo")))
        btn_submit = wait.until(EC.presence_of_element_located((By.ID, "Test1_FormFieldSubmitButton3")))

        date_start.send_keys('01/01/2025')
        date_end.send_keys('02/01/2026/')
        btn_submit.click()

        assert 'alert-danger' in date_start.get_attribute("class") , "Result must be negative"
        assert 'alert-danger' in date_end.get_attribute("class") , "Result must be negative"

    def test_group_check_date_period_1year_negative2(self, config):
        """Check validation type group check date period 1year invalid"""

        d, w = config["driver"], config["timeout"]
        wait = WebDriverWait(d, w)

        date_start = wait.until(EC.presence_of_element_located((By.ID, "FormFieldDateFrom")))
        date_end = wait.until(EC.presence_of_element_located((By.ID, "FormFieldDateTo")))
        btn_submit = wait.until(EC.presence_of_element_located((By.ID, "Test1_FormFieldSubmitButton3")))

        date_start.send_keys('01/02/2023')
        date_end.send_keys('20/07/2025')
        btn_submit.click()

        assert 'alert-danger' in date_start.get_attribute("class") , "Result must be negative"
        assert 'alert-danger' in date_end.get_attribute("class") , "Result must be negative"

    def test_group_check_date_period_1year1(self, config):
        """Check validation type group check date period 1year nr1"""

        d, w = config["driver"], config["timeout"]
        wait = WebDriverWait(d, w)

        date_start = wait.until(EC.presence_of_element_located((By.ID, "FormFieldDateFrom")))
        date_end = wait.until(EC.presence_of_element_located((By.ID, "FormFieldDateTo")))
        btn_submit = wait.until(EC.presence_of_element_located((By.ID, "Test1_FormFieldSubmitButton3")))

        date_start.send_keys('2025/09/01')
        date_end.send_keys('2025/09/01')
        btn_submit.click()

        assert 'alert-success' in date_start.get_attribute("class") , "Result must be success"
        assert 'alert-success' in date_end.get_attribute("class") , "Result must be success"

    def test_group_check_date_period_1year2(self, config):
        """Check validation type group check date period 1year nr2"""

        d, w = config["driver"], config["timeout"]
        wait = WebDriverWait(d, w)

        date_start = wait.until(EC.presence_of_element_located((By.ID, "FormFieldDateFrom")))
        date_end = wait.until(EC.presence_of_element_located((By.ID, "FormFieldDateTo")))
        btn_submit = wait.until(EC.presence_of_element_located((By.ID, "Test1_FormFieldSubmitButton3")))

        date_start.send_keys('2025/01/01')
        date_end.send_keys('2025/02/01')
        btn_submit.click()

        #assert 'alert-success' in date_start.get_attribute("class") , "Result must be success"
        #assert 'alert-success' in date_end.get_attribute("class") , "Result must be success"

    def test_group_check_date_period_1year3(self, config):
        """Check validation type group check date period 1year nr3"""

        d, w = config["driver"], config["timeout"]
        wait = WebDriverWait(d, w)

        date_start = wait.until(EC.presence_of_element_located((By.ID, "FormFieldDateFrom")))
        date_end = wait.until(EC.presence_of_element_located((By.ID, "FormFieldDateTo")))
        btn_submit = wait.until(EC.presence_of_element_located((By.ID, "Test1_FormFieldSubmitButton3")))

        date_start.send_keys('2024/02/01')
        date_end.send_keys('2024/07/20')
        btn_submit.click()

        #assert 'alert-success' in date_start.get_attribute("class") , "Result must be success"
        #assert 'alert-success' in date_end.get_attribute("class") , "Result must be success"

        config["driver"].quit()
