import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

@pytest.fixture

def config():
	config = {}
	config["wait"] = 10
	config["driver"] = webdriver.Chrome()
	config["driver"].get("https://x0-test.webcodex.de/");
	config["ready_selector"] = "#Test1" # selector to look for to declare DOM ready
	return config

class TestGeneral:
	def test_suspicious_id_null(self, config):
		d, w = config["driver"], config["wait"]
		wait = WebDriverWait(d, w)
		elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, config["ready_selector"])))

		elems = d.find_elements(By.XPATH, "//*[contains(@id,'null000')]")
		assert len(elems) == 0, 'Problematic string "null" found in one or more IDs'

		d.close()
	def test_suspicious_id_undefined(self, config):
		d, w = config["driver"], config["wait"]
		wait = WebDriverWait(d, w)
		elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, config["ready_selector"])))

		elems = d.find_elements(By.XPATH, "//*[contains(@id,'undefined')]")
		assert len(elems) == 0, 'Problematic string "undefined" found in one or more IDs'

		d.close()
