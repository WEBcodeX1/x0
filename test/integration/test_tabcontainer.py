import os
import json
import time
import pytest
import logging

import globalconf

from selenium import webdriver
from selenium.webdriver.common.by import By
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
        domain_suffix = '.'+run_namespace
    except Exception as e:
        domain_suffix = ''

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

    get_url = '{}/python/Index.py?appid=test_tabcontainer'.format(vhost_test_urls['x0-app'])

    logger.info('test (get) url:{}'.format(get_url))

    config["driver"].get(get_url)

    return config


class TestTabContainer:

    def test_tabcontainer(self, config):
        """Check if TabContainer is working as expected"""
        d = config["driver"]
        wait = WebDriverWait(d, config["timeout"])

        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#Screen1_TabContainer1_Nav_Ul_Tab2Container")))

        tab1_button = d.find_element(By.CSS_SELECTOR, "#Screen1_TabContainer1_Nav_Ul_Tab1Container_Tab1li")
        tab2_button = d.find_element(By.CSS_SELECTOR, "#Screen1_TabContainer1_Nav_Ul_Tab2Container_Tab2li")
        tab3_button = d.find_element(By.CSS_SELECTOR, "#Screen1_TabContainer1_Nav_Ul_Tab3Container_Tab3li")
        tab4_button = d.find_element(By.CSS_SELECTOR, "#Screen1_TabContainer1_Nav_Ul_Tab4Container_Tab4li")

        tab1_container = d.find_element(By.CSS_SELECTOR, "#Screen1_TabContainer1_Tab1")
        tab2_container = d.find_element(By.CSS_SELECTOR, "#Screen1_TabContainer1_Tab2")
        tab3_container = d.find_element(By.CSS_SELECTOR, "#Screen1_TabContainer1_Tab3")
        tab4_container = d.find_element(By.CSS_SELECTOR, "#Screen1_TabContainer1_Tab4")

        # Following our test-setup, tab2 is selected by default
        logging.info("Checking for default tab (#2) to be selected..")
        assert "sysTabActive" in tab2_button.get_attribute("class"), "Default tab (#2) isn't selected."
        assert tab2_container.is_displayed(), "Default tab content (#2) isn't displayed."

        logging.info("Clicking tab1 button..")
        tab1_button.click()
        assert tab1_container.is_displayed(), "Tab switching is not working (#1)."
        assert tab2_container.is_displayed() == False, "Wrong container (#2) is still displayed."
        assert tab3_container.is_displayed() == False, "Wrong container (#3) is still displayed."
        assert tab4_container.is_displayed() == False, "Wrong container (#4) is still displayed."

        logging.info("Clicking tab2 button..")
        tab2_button.click()
        assert tab2_container.is_displayed(), "Tab switching is not working (#2)."
        assert tab1_container.is_displayed() == False, "Wrong container (#1) is still displayed."
        assert tab3_container.is_displayed() == False, "Wrong container (#3) is still displayed."
        assert tab4_container.is_displayed() == False, "Wrong container (#4) is still displayed."

        logging.info("Clicking tab3 button..")
        tab3_button.click()
        assert tab3_container.is_displayed(), "Tab switching is not working (#3)."
        assert tab1_container.is_displayed() == False, "Wrong container (#1) is still displayed."
        assert tab2_container.is_displayed() == False, "Wrong container (#2) is still displayed."
        assert tab4_container.is_displayed() == False, "Wrong container (#4) is still displayed."

        logging.info("Clicking tab4 button..")
        tab4_button.click()
        assert tab4_container.is_displayed(), "Tab switching is not working (#4)."
        assert tab1_container.is_displayed() == False, "Wrong container (#1) is still displayed."
        assert tab2_container.is_displayed() == False, "Wrong container (#2) is still displayed."
        assert tab3_container.is_displayed() == False, "Wrong container (#3) is still displayed."

        d.quit()
