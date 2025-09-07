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

    get_url = '{}/python/Index.py?appid=test_user_validation'.format(vhost_test_urls['x0-app'])

    logger.info('test (get) url:{}'.format(get_url))

    confparams["driver"].get(get_url)

    return confparams


class TestUserValidationFunctions:

    def test_validate_user_functions(self, config):
        """Check user validation functions working (callable)"""

        d, w = config["driver"], config["timeout"]
        wait = WebDriverWait(d, w)

        form1 = wait.until(EC.presence_of_element_located((By.ID, "FormFieldValue1")))
        btn_submit = wait.until(EC.presence_of_element_located((By.ID, "Test1_FormFieldSubmitButton1")))

        form1.send_keys('bla')
        btn_submit.click()

        assert 'alert-success' in form1.get_attribute("class") , "Result must always be success"

    def test_validate_user_group_functions(self, config):
        """Check user validation functions working (callable)"""

        d, w = config["driver"], config["timeout"]
        wait = WebDriverWait(d, w)

        form1 = wait.until(EC.presence_of_element_located((By.ID, "FormFieldValue2")))
        form2 = wait.until(EC.presence_of_element_located((By.ID, "FormFieldValue3")))
        form3 = wait.until(EC.presence_of_element_located((By.ID, "FormFieldValue4")))
        btn_submit = wait.until(EC.presence_of_element_located((By.ID, "Test1_FormFieldSubmitButton1")))

        form1.send_keys('bla1')
        form2.send_keys('bla2')
        form3.send_keys('bla3')
        btn_submit.click()

        assert 'alert-success' in form1.get_attribute("class") , "Result must always be success"
        assert 'alert-success' in form2.get_attribute("class") , "Result must always be success"
        assert 'alert-success' in form3.get_attribute("class") , "Result must always be success"

        config["driver"].quit()
