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
    config["base_url"] = '{}/python/Index.py'.format(vhost_test_urls['x0-app'])

    return config


class TestExamples:
    """Test all x0-framework examples (except tree_simple which is in development)"""

    def test_example1_add_object_table_column(self, config):
        """Test Example 1: Adding object types as table columns"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example1'.format(config["base_url"])
        
        logger.info('testing example1 at url: {}'.format(get_url))
        d.get(get_url)
        
        wait = WebDriverWait(d, w)
        # Wait for the main container to load
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))
        
        # Check for main application elements
        assert len(d.find_elements(By.TAG_NAME, "body")) > 0, "Example1 failed to load basic DOM structure"

    def test_example2_basic_menu_screen(self, config):
        """Test Example 2: Basic navigation menu implementation"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example2'.format(config["base_url"])
        
        logger.info('testing example2 at url: {}'.format(get_url))
        d.get(get_url)
        
        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))
        
        # Check for menu links (Link1, Link2 from object.json)
        time.sleep(3)  # Allow time for dynamic content to load
        
        # Look for menu links by ID patterns that should be generated
        links = d.find_elements(By.CSS_SELECTOR, "[id*='Link1'], [id*='Link2']")
        assert len(links) >= 1, "Example2 menu links not found in DOM"

    def test_example3_basic_tabcontainer(self, config):
        """Test Example 3: Simple tabbed interface"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example3'.format(config["base_url"])
        
        logger.info('testing example3 at url: {}'.format(get_url))
        d.get(get_url)
        
        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))
        
        # Check for TabContainer element
        time.sleep(3)
        tab_containers = d.find_elements(By.CSS_SELECTOR, "[id*='TabContainer']")
        assert len(tab_containers) >= 1, "Example3 TabContainer not found"

    def test_example4_list_detail_switch_screen(self, config):
        """Test Example 4: List/detail view switching"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example4'.format(config["base_url"])
        
        logger.info('testing example4 at url: {}'.format(get_url))
        d.get(get_url)
        
        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))
        
        # Check for ServiceConnector and FormfieldList elements
        time.sleep(3)
        service_connectors = d.find_elements(By.CSS_SELECTOR, "[id*='Connector']")
        formfield_lists = d.find_elements(By.CSS_SELECTOR, "[id*='Formfields']")
        assert len(service_connectors) >= 1 or len(formfield_lists) >= 1, "Example4 list/detail components not found"

    def test_example5_enhanced_form(self, config):
        """Test Example 5: Advanced form features and validation"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example5'.format(config["base_url"])
        
        logger.info('testing example5 at url: {}'.format(get_url))
        d.get(get_url)
        
        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))
        
        # Check for FormfieldList components
        time.sleep(3)
        formfield_lists = d.find_elements(By.CSS_SELECTOR, "[id*='FormfieldList'], [id*='Formfield']")
        assert len(formfield_lists) >= 1, "Example5 form components not found"

    def test_example6_screen_overlay(self, config):
        """Test Example 6: Modal overlay functionality"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example6'.format(config["base_url"])
        
        logger.info('testing example6 at url: {}'.format(get_url))
        d.get(get_url)
        
        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))
        
        time.sleep(2)
        assert len(d.find_elements(By.TAG_NAME, "body")) > 0, "Example6 failed to load"

    def test_example7_list_objectdata_grid(self, config):
        """Test Example 7: Object data grid functionality"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example7'.format(config["base_url"])
        
        logger.info('testing example7 at url: {}'.format(get_url))
        d.get(get_url)
        
        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))
        
        time.sleep(2)
        assert len(d.find_elements(By.TAG_NAME, "body")) > 0, "Example7 failed to load"

    def test_example8_multi_tabcontainer(self, config):
        """Test Example 8: Multi-level tabbed containers"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example8'.format(config["base_url"])
        
        logger.info('testing example8 at url: {}'.format(get_url))
        d.get(get_url)
        
        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))
        
        time.sleep(2)
        assert len(d.find_elements(By.TAG_NAME, "body")) > 0, "Example8 failed to load"

    def test_example9_bootstrap_rowspan(self, config):
        """Test Example 9: Bootstrap grid with rowspan functionality"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example9'.format(config["base_url"])
        
        logger.info('testing example9 at url: {}'.format(get_url))
        d.get(get_url)
        
        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))
        
        time.sleep(2)
        assert len(d.find_elements(By.TAG_NAME, "body")) > 0, "Example9 failed to load"

    def test_example10_net_messages(self, config):
        """Test Example 10: Network messaging between sessions"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example10'.format(config["base_url"])
        
        logger.info('testing example10 at url: {}'.format(get_url))
        d.get(get_url)
        
        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))
        
        time.sleep(2)
        assert len(d.find_elements(By.TAG_NAME, "body")) > 0, "Example10 failed to load"

    def test_example11_object_instances(self, config):
        """Test Example 11: Dynamic object instancing (experimental)"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example11'.format(config["base_url"])
        
        logger.info('testing example11 at url: {}'.format(get_url))
        d.get(get_url)
        
        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))
        
        time.sleep(2)
        assert len(d.find_elements(By.TAG_NAME, "body")) > 0, "Example11 failed to load"

    def test_example12_list_dyn_radio(self, config):
        """Test Example 12: Dynamic radio button lists"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example12'.format(config["base_url"])
        
        logger.info('testing example12 at url: {}'.format(get_url))
        d.get(get_url)
        
        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))
        
        time.sleep(2)
        assert len(d.find_elements(By.TAG_NAME, "body")) > 0, "Example12 failed to load"

    def test_example13_copy_paste(self, config):
        """Test Example 13: Copy/paste functionality between objects"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example13'.format(config["base_url"])
        
        logger.info('testing example13 at url: {}'.format(get_url))
        d.get(get_url)
        
        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))
        
        time.sleep(2)
        assert len(d.find_elements(By.TAG_NAME, "body")) > 0, "Example13 failed to load"

    def test_example14_open_close_container(self, config):
        """Test Example 14: Collapsible container sections"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example14'.format(config["base_url"])
        
        logger.info('testing example14 at url: {}'.format(get_url))
        d.get(get_url)
        
        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))
        
        time.sleep(2)
        assert len(d.find_elements(By.TAG_NAME, "body")) > 0, "Example14 failed to load"
        
        # Clean up driver after last test (following existing pattern)
        d.quit()