import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import logging

@pytest.fixture

def config():
	config = {}
	config["wait"] = 10
	config["options"] = webdriver.ChromeOptions()
	config["options"].add_argument('ignore-certificate-errors')
	config["driver"] = webdriver.Chrome(options=config["options"])
	config["driver"].get("https://x0-test.webcodex.de/examples/basic_tabcontainer/")
	return config

class TestTabContainer:
	def test_tabcontainer(self, config):
		"""Check if TabContainer is working as expected"""
		d = config["driver"]
		wait = WebDriverWait(d, config["wait"])

		wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#Screen1_TabContainer1_Nav_Ul_Tab2Container")))

		tab1_button = d.find_element(By.CSS_SELECTOR, "#Screen1_TabContainer1_Nav_Ul_Tab1Container")
		tab2_button = d.find_element(By.CSS_SELECTOR, "#Screen1_TabContainer1_Nav_Ul_Tab2Container")
		tab1_container = d.find_element(By.CSS_SELECTOR, "#Screen1_TabContainer1_Tab1")
		tab2_container = d.find_element(By.CSS_SELECTOR, "#Screen1_TabContainer1_Tab2")

		logging.info("Clicking tab2 button..")
		tab2_button.click()
		assert tab2_container.is_displayed(), "Tab switching is not working (#2)."
		assert tab2_container.is_displayed() == False, "Wrong container (#1) is still displayed."

		logging.info("Clicking tab1 button..")
		tab1_button.click()
		assert tab1_container.is_displayed(), "Tab switching is not working (#1)."
		assert tab2_container.is_displayed() == False, "Wrong container (#2) is still displayed."

		d.close()
