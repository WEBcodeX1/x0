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

    get_url = '{}/python/Index.py?appid=test_base'.format(vhost_test_urls['x0-app'])

    logger.info('test (get) url:{}'.format(get_url))

    config["driver"].get(get_url)

    config["ready_selector"] = "#Test1" # selector to look for to declare DOM ready

    return config


class TestGeneral:

    def test_suspicious_id_null(self, config):
        """Find suspicious ID names containing the string null"""
        d, w = config["driver"], config["timeout"]
        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, config["ready_selector"])))

        elems = d.find_elements(By.XPATH, "//*[contains(@id,'null')]")
        assert len(elems) == 0, 'Problematic string "null" found in one or more IDs'
        d.quit()

    def test_suspicious_id_undefined(self, config):
        """Find suspicious ID names containing the string undefined"""
        d, w = config["driver"], config["timeout"]
        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, config["ready_selector"])))

        elems = d.find_elements(By.XPATH, "//*[contains(@id,'undefined')]")
        assert len(elems) == 0, 'Problematic string "undefined" found in one or more IDs'
        d.quit()

#TODO: locate / eliminate undefined values
#    def test_suspicious_parameter_values(self, config):
#        """Find suspicious element parameter values (containing null or undefined)"""
#        d, w = config["driver"], config["timeout"]
#        wait = WebDriverWait(d, w)
#        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, config["ready_selector"])))

#        elems = d.find_elements(By.XPATH, "//*[@*='null' or @*='undefined']")
#        assert len(elems) == 0, 'Found ' + str(len(elems)) + ' occurrences of string "undefined" in one or more parameter values on page'
