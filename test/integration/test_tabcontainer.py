import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import logging

@pytest.fixture
def config():

    try:
        test_url_env = os.environ['TEST_DOMAIN']
        test_url = 'https://{}'.format(test_url_env)
    except:
        test_url = 'http://127.0.0.1'

    config = {}
    config["timeout"] = 30
    config["options"] = webdriver.ChromeOptions()
    config["options"].add_argument('ignore-certificate-errors')
    config["options"].add_argument('headless')
    config["driver"] = webdriver.Chrome(options=config["options"])
    config["driver"].get('{}/python/Index.py?appid=test_tabcontainer'.format(test_url))
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

        d.close()
