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

    get_url = '{}/python/Index.py?appid=test_tree_simple'.format(vhost_test_urls['x0-app'])

    logger.info('test (get) url:{}'.format(get_url))

    confparams["driver"].get(get_url)

    return confparams


class TestTreeSimple:

    def test_tree_simple_div_layer(self, config):
        """Check tree div layer structure has been setup correctly"""

        d, w = config["driver"], config["timeout"]
        wait = WebDriverWait(d, w)

        l1 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement1_TreeSimpleElement1")))
        l2 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement1_TreeSimpleElement1_0_item-container")))
        l3 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement1_TreeSimpleElement1_0_item-container_open-close-button")))
        l4 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement1_TreeSimpleElement1_0_children-container_0_item-container_item-link")))
        l5 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement1_TreeSimpleElement1_0_children-container_1_item-container_node-text")))
        l6 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement1_TreeSimpleElement1_0_children-container_1_item-container_open-close-button")))
        l7 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement1_TreeSimpleElement1_0_children-container_1_children-container_1_item-container")))
        l8 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement1_TreeSimpleElement1_0_children-container_2_item-container")))
        l9 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement1_TreeSimpleElement1_1_children-container_1_item-container_item-link")))
        l10 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement1_TreeSimpleElement1_1_children-container_2_children-container_2_item-container_item-link")))
        l11 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement1_TreeSimpleElement1_1_children-container_3_item-container_item-link")))

    def test_tree_simple_function_click(self, config):
        """Check tree elements clickable"""

        d, w = config["driver"], config["timeout"]
        wait = WebDriverWait(d, w)

        l1 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement1_TreeSimpleElement1")))
        l2 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement1_TreeSimpleElement1_0_item-container")))
        l3 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement1_TreeSimpleElement1_0_item-container_open-close-button")))
        l4 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement1_TreeSimpleElement1_0_children-container_0_item-container_item-link")))
        l5 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement1_TreeSimpleElement1_0_children-container_1_item-container_node-text")))
        l6 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement1_TreeSimpleElement1_0_children-container_1_item-container_open-close-button")))
        l7 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement1_TreeSimpleElement1_0_children-container_1_children-container_1_item-container")))
        l8 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement1_TreeSimpleElement1_0_children-container_2_item-container")))
        l9 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement1_TreeSimpleElement1_1_children-container_1_item-container_item-link")))
        l10 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement1_TreeSimpleElement1_1_children-container_2_children-container_2_item-container_item-link")))
        l11 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement1_TreeSimpleElement1_1_children-container_3_item-container_item-link")))

        l3.click()
        l3.click()

        l4.click()
        l4_selected = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement1_TreeSimpleElement1_0_children-container_0_selected")))

        assert 'sysTreeSelectedHilite' in l4_selected.get_attribute("class") , "Element must contain sysTreeSelectedHilite CSS class"

        l6.click()
        l6.click()

        l9.click()

        assert 'sysTreeSelectedHilite' not in l4_selected.get_attribute("class") , "Element must not contain sysTreeSelectedHilite CSS class"

        config["driver"].quit()
