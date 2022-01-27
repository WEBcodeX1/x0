import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

@pytest.fixture

def config():
	config = {}
	config["wait"] = 10
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

		tab2_button.click()
		assert tab2_container.is_displayed(), "Tab switching is not working (#2)."

		tab1_button.click()
		assert tab1_container.is_displayed(), "Tab switching is not working (#1)."

		d.close()
