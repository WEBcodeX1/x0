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
	return config

class TestBaseObjects:
	def test_button(self, config):
		d = config["driver"]
		wait = WebDriverWait(d, config["wait"])
		elem = wait.until(EC.presence_of_element_located(
			(By.CSS_SELECTOR, "#Test1_Button1 #Test1_Button1_SQLText")
		))
		d.close()

	def test_formfield(self, config):
		d = config["driver"]
		wait = WebDriverWait(d, config["wait"])
		# field (aka input)
		elem = wait.until(EC.presence_of_element_located(
			(By.CSS_SELECTOR, "#Test1_FormFieldList1 #FormField1")
		))
		# pulldown (aka select)
		elem = wait.until(EC.presence_of_element_located(
			(By.CSS_SELECTOR, "#Test1_FormFieldList1 #Test1_FormFieldList1_FormFieldPulldown1 #FormFieldPulldown1")
		))
		d.close()

	def test_sqltext(self, config):
		d = config["driver"]
		wait = WebDriverWait(d, config["wait"])
		elem = wait.until(EC.presence_of_element_located(
			(By.CSS_SELECTOR, "#Test1_SQLText1")
		))
		d.close()

	def test_list(self, config):
		d = config["driver"]
		wait = WebDriverWait(d, config["wait"])
		elem = wait.until(EC.presence_of_element_located(
			(By.CSS_SELECTOR, "#Test1_ServiceConnector1 #Test1_ServiceConnector1_List1 #Test1_ServiceConnector1_List1_List1HdrRow")
		))
		d.close()
