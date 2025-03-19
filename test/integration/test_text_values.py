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

    get_url = '{}/python/Index.py?appid=test_text_values'.format(vhost_test_urls['x0-app'])

    logger.info('test (get) url:{}'.format(get_url))

    config["driver"].get(get_url)

    return config


class TestTextValues:

    def test_text_values(self, config):
        """Check if the standard text values are present in the DB"""
        d, w = config["driver"], config["timeout"]
        wait = WebDriverWait(d, w)

        logging.info("Checking presence of correct text in elements..")

        el1 = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#Screen1_SQLText1")))
        el2 = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#Screen1_SQLText2")))
        el3 = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#Screen1_SQLText3")))
        el4 = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#Screen1_SQLText4")))
        el5 = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#Screen1_SQLText5")))
        el6 = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#Screen1_SQLText6")))
        el7 = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#Screen1_SQLText7")))

        assert el1.text == "Link 1", "Test element has wrong text!"
        assert el2.text == "SQL Text Test", "Test element has wrong text!"
        assert el3.text == "Button 1", "Test element has wrong text!"
        assert el4.text == "Nav links", "Test element has wrong text!"
        assert el5.text == "Nav rechts", "Test element has wrong text!"
        assert el6.text == "Upload Button", "Test element has wrong text!"
        assert el7.text == "Upload Button", "Test element has wrong text!"

        d.quit()
