import os
import json
import time
import pytest
import logging

import globalconf

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger()

wd_options = webdriver.ChromeOptions()
wd_options.add_argument('ignore-certificate-errors')
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

    config = {}
    config["timeout"] = 10
    config["driver"] = wd

    get_url = '{}/python/Index.py?appid=test_base'.format(vhost_test_urls['x0-app'])

    logger.info('test (get) url:{}'.format(get_url))

    config["driver"].get(get_url)

    config["json"] = {}
    with open("integration/config/basic/static/object.json") as fh:
        config["json"]["object"] = json.load(fh)

    return config


class TestBaseObjectsExistence:

    def test_first_internal_server_error(self, config):
        """First request after init containers 'x0-app' and 'x0-db' raises Internal Server Error"""
        d = config["driver"]

    def test_button(self, config):
        """Check if button element exists on site, have proper class attribute"""
        d = config["driver"]

        elem = WebDriverWait(d, config["timeout"]).until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "#Test1_Button1_SQLText")
            )
        )

        el = d.find_element(By.CSS_SELECTOR, "#Test1_Button1")
        val = el.get_attribute("class")
        assert val == config["json"]["object"]["Button1"]["Attributes"]["Style"], "Button has improper class attribute, differs from JSON config."

    def test_formfield(self, config):
        """Check if formfield element (includes field and pulldown) exists on site, have proper class attribute"""
        d = config["driver"]
        wait = WebDriverWait(d, config["timeout"])

        # field (aka input)
        elem = wait.until(EC.presence_of_element_located(
            (By.ID, "FormField1")
        ))

        # pulldown (aka select)
        elem = wait.until(EC.presence_of_element_located(
            (By.ID, "FormFieldPulldown1")
        ))

        el = d.find_element(By.ID, "FormField1")
        val = el.get_attribute("class")
        assert val == config["json"]["object"]["FormField1"]["Attributes"]["Style"], "FormField has improper class attribute, differs from JSON config."

        el = d.find_element(By.ID, "FormFieldPulldown1")
        val = el.get_attribute("class")
        assert val == config["json"]["object"]["FormFieldPulldown1"]["Attributes"]["Style"], "FormFieldPulldown has improper class attribute, differs from JSON config."

    def test_sqltext(self, config):
        """Check if SQLText element exists on site, have proper class attribute"""
        d = config["driver"]
        wait = WebDriverWait(d, config["timeout"])
        elem = wait.until(EC.presence_of_element_located(
            (By.CSS_SELECTOR, "#Test1_SQLText1")
        ))

        el = d.find_element(By.CSS_SELECTOR, "#Test1_SQLText1")
        val = el.get_attribute("class")
        assert val == config["json"]["object"]["SQLText1"]["Attributes"]["Style"], "SQLText has improper class attribute, differs from JSON config."

    def test_list(self, config):
        """Check if list element exists on site, have proper class attribute"""
        d = config["driver"]
        wait = WebDriverWait(d, config["timeout"])
        elem = wait.until(EC.presence_of_element_located(
            (By.CSS_SELECTOR, "#Test1_ServiceConnector1 #Test1_ServiceConnector1_List1 #Test1_ServiceConnector1_List1_List1HdrRow")
        ))

        el = d.find_element(By.CSS_SELECTOR, "#Test1_ServiceConnector1_List1")
        val = el.get_attribute("class")
        assert val == config["json"]["object"]["List1"]["Attributes"]["Style"], "List has improper class attribute, differs from JSON config."


class TestBaseObjectsVariants:

    def test_pulldown(self, config):
        """Check if pulldown element exists on site"""
        d, w = config["driver"], config["timeout"]
        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#FormFieldPulldown1")))
        options = d.find_elements(By.CSS_SELECTOR, "#FormFieldPulldown1 > *")
        assert len(options) > 2, "Pulldown offers no choice."

    def test_dynpulldown(self, config):
        """Check if dynpulldown element exists on site"""
        d, w = config["driver"], config["timeout"]
        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#FormFieldDynPulldown1")))
        options = d.find_elements(By.CSS_SELECTOR, "#FormFieldDynPulldown1 > *")
        assert len(options) > 2, "Dynamic pulldown offers no choice."

    def test_list(self, config):
        """Check if list element exists on site"""
        d, w = config["driver"], config["timeout"]
        wait = WebDriverWait(d, w)
        elem = wait.until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "#Test1_ServiceConnector1_List1")
            )
        )
        # list element has rows?
        rows = d.find_elements(By.CSS_SELECTOR, "#Test1_ServiceConnector1_List1 > *")

        assert len(rows) > 2, "Table has no rows."

        d.quit()
