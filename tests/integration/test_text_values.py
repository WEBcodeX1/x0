import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
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
	config["driver"].get("https://x0-test.webcodex.de/text-values/")
	return config


class TestTextValues:
	def test_text_values(self, config):
		"""Check if the standard text values are present in the DB"""
		d, w = config["driver"], config["wait"]
		wait = WebDriverWait(d, w)

		logging.info("Checking presence of correct text in elements..")

		el1 = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#Screen1_SQLText1")))
		el2 = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#Screen1_SQLText2")))
		el3 = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#Screen1_SQLText3")))
		el4 = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#Screen1_SQLText4")))
		el5 = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#Screen1_SQLText5")))
		el6 = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#Screen1_SQLText6")))
		el7 = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#Screen1_SQLText7")))

		assert el1.text == "Link1", "Test element has wrong text!"
		assert el2.text == "SQL Text Test", "Test element has wrong text!"
		assert el3.text == "Button 1", "Test element has wrong text!"
		assert el4.text == "Button left <<", "Test element has wrong text!"
		assert el5.text == "Button right >>", "Test element has wrong text!"
		assert el6.text == "Upload PDF", "Test element has wrong text!"
		assert el7.text == "Upload PDF", "Test element has wrong text!"

		d.close()
