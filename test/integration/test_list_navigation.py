import os
import json
import time
import pytest
import logging

import globalconf

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.ui import Select
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

    wd.set_window_size(1024, 3000)

    config = {}
    config["timeout"] = 10
    config["driver"] = wd
    config["base_url"] = '{}/python/Index.py'.format(vhost_test_urls['x0-app'])

    return config


class TestListNavigation:
    """Test list pagination/navigation not including dynamic context-menu based row add/removal"""

    def test_nav1(self, config):
        """Test Navigation with 15 SQL data rows, list RowCont: 4"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=test_list_navigation'.format(config["base_url"])

        logger.info('testing list1 at url: {}'.format(get_url))
        d.get(get_url)

        wait = WebDriverWait(d, w)

        # wait for the main container to load
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))

        # Check for main application elements
        assert len(d.find_elements(By.TAG_NAME, "body")) > 0, "Example1 failed to load basic DOM structure"

        nav_button = wait.until(EC.presence_of_element_located((By.ID, "Screen1_TestList1Connector_TestList1_nav-row_col-nav-ct_col-nav-ct2_bt-page-item-4_button-right")))
        nav_button.click()

    def test_nav2(self, config):
        """Test Navigation with 40 SQL data rows, list RowCont: 3"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=test_list_navigation'.format(config["base_url"])

        logger.info('testing list2 at url: {}'.format(get_url))
        d.get(get_url)

        wait = WebDriverWait(d, w)

        # wait for the main container to load
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))

        # Check for main application elements
        assert len(d.find_elements(By.TAG_NAME, "body")) > 0, "Example1 failed to load basic DOM structure"

        nav_button = wait.until(EC.presence_of_element_located((By.ID, "Screen1_TestList2Connector_TestList2_nav-row_col-nav-ct_col-nav-ct2_bt-page-item-14_button-right")))
        nav_button.click()

    def test_nav3(self, config):
        """Test Navigation with 50 SQL data rows, list RowCont: 5"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=test_list_navigation'.format(config["base_url"])

        logger.info('testing list3 at url: {}'.format(get_url))
        d.get(get_url)

        wait = WebDriverWait(d, w)

        # wait for the main container to load
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))

        # Check for main application elements
        assert len(d.find_elements(By.TAG_NAME, "body")) > 0, "Example1 failed to load basic DOM structure"

        nav_button = wait.until(EC.presence_of_element_located((By.ID, "Screen1_TestList3Connector_TestList3_nav-row_col-nav-ct_col-nav-ct2_bt-page-item-10_button-right")))
        nav_button.click()

        # Clean up driver after last test (following existing pattern)
        d.quit()
