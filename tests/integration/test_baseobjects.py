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


class TestBaseObjectsExistence:
	def test_button(self, config):
		"""Check if button element exists on site"""
		d = config["driver"]
		wait = WebDriverWait(d, config["wait"])
		elem = wait.until(EC.presence_of_element_located(
			(By.CSS_SELECTOR, "#Test1_Button1 #Test1_Button1_SQLText")
		))
		d.close()

	def test_formfield(self, config):
		"""Check if formfield element (includes field and pulldown) exists on site"""
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
		"""Check if SQLText element exists on site"""
		d = config["driver"]
		wait = WebDriverWait(d, config["wait"])
		elem = wait.until(EC.presence_of_element_located(
			(By.CSS_SELECTOR, "#Test1_SQLText1")
		))
		d.close()

	def test_list(self, config):
		"""Check if list element exists on site"""
		d = config["driver"]
		wait = WebDriverWait(d, config["wait"])
		elem = wait.until(EC.presence_of_element_located(
			(By.CSS_SELECTOR, "#Test1_ServiceConnector1 #Test1_ServiceConnector1_List1 #Test1_ServiceConnector1_List1_List1HdrRow")
		))
		d.close()


class TestBaseObjectsVariants:
	def test_pulldown(self, config):
		"""Check if pulldown element exists on site"""
		d, w = config["driver"], config["wait"]
		wait = WebDriverWait(d, w)
		elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#FormFieldPulldown1")))
		options = d.find_elements(By.CSS_SELECTOR, "#FormFieldPulldown1 > *")
		assert len(options) > 2, "Pulldown offers no choice."
		d.close()

	def test_dynpulldown(self, config):
		"""Check if dynpulldown element exists on site"""
		d, w = config["driver"], config["wait"]
		wait = WebDriverWait(d, w)
		elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#FormFieldDynPulldown1")))
		options = d.find_elements(By.CSS_SELECTOR, "#FormFieldDynPulldown1 > *")
		assert len(options) > 2, "Dynamic pulldown offers no choice."
		d.close()

	def test_list(self, config):
		"""Check if list element exists on site"""
		d, w = config["driver"], config["wait"]
		wait = WebDriverWait(d, w)
		elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#Test1_ServiceConnector1_List1")))
		# has rows?
		rows = d.find_elements(By.CSS_SELECTOR, "#Test1_ServiceConnector1_List1 > *")
		assert len(rows) > 2, "Table has no rows."
		# buttons working?
		buttons = d.find_elements(By.CSS_SELECTOR, "#Test1_ServiceConnector1_List1 .sysButton")
		rows_before = d.find_elements(By.CSS_SELECTOR, "#Test1_ServiceConnector1_List1 > *")
		buttons[1].click()
		rows_after = d.find_elements(By.CSS_SELECTOR, "#Test1_ServiceConnector1_List1 > *")
		assert rows_before != rows_after, 'Lists "next" button not working.'
		d.close()
