# TODO: Pull all hardcoded CSS identifiers from JSON configs

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json

@pytest.fixture

def config():
    config = {}
    config["wait"] = 5
    config["options"] = webdriver.ChromeOptions()
    config["options"].add_argument('ignore-certificate-errors')
    config["options"].add_argument('headless')
    config["driver"] = webdriver.Chrome(options=config["options"])
    config["driver"].get("https://x0-app.kicker-finder.de/python/Index.py?appid=test_base");

    config["json"] = {}
    with open("integration/config/basic/static/object.json") as file:
        config["json"]["object"] = json.load(file)
        file.close()

    return config


class TestBaseObjectsExistence:
    def test_button(self, config):
        """Check if button element exists on site, have proper class attribute"""
        d = config["driver"]
        wait = WebDriverWait(d, config["wait"])
        elem = wait.until(EC.presence_of_element_located(
            (By.CSS_SELECTOR, "#Test1_Button1 #Test1_Button1_SQLText")
        ))

        el = d.find_element(By.CSS_SELECTOR, "#Test1_Button1")
        val = el.get_attribute("class")
        assert val == config["json"]["object"]["Button1"]["Attributes"]["Style"], "Button has improper class attribute, differs from JSON config."

        d.close()

    def test_formfield(self, config):
        """Check if formfield element (includes field and pulldown) exists on site, have proper class attribute"""
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

        el = d.find_element(By.CSS_SELECTOR, "#FormField1")
        val = el.get_attribute("class")
        assert val == config["json"]["object"]["FormField1"]["Attributes"]["Style"], "FormField has improper class attribute, differs from JSON config."

        el = d.find_element(By.CSS_SELECTOR, "#FormFieldPulldown1")
        val = el.get_attribute("class")
        assert val == config["json"]["object"]["FormFieldPulldown1"]["Attributes"]["Style"], "FormFieldPulldown has improper class attribute, differs from JSON config."

        d.close()

    def test_sqltext(self, config):
        """Check if SQLText element exists on site, have proper class attribute"""
        d = config["driver"]
        wait = WebDriverWait(d, config["wait"])
        elem = wait.until(EC.presence_of_element_located(
            (By.CSS_SELECTOR, "#Test1_SQLText1")
        ))

        el = d.find_element(By.CSS_SELECTOR, "#Test1_SQLText1")
        val = el.get_attribute("class")
        assert val == config["json"]["object"]["SQLText1"]["Attributes"]["Style"], "SQLText has improper class attribute, differs from JSON config."

        d.close()

    def test_list(self, config):
        """Check if list element exists on site, have proper class attribute"""
        d = config["driver"]
        wait = WebDriverWait(d, config["wait"])
        elem = wait.until(EC.presence_of_element_located(
            (By.CSS_SELECTOR, "#Test1_ServiceConnector1 #Test1_ServiceConnector1_List1 #Test1_ServiceConnector1_List1_List1HdrRow")
        ))

        el = d.find_element(By.CSS_SELECTOR, "#Test1_ServiceConnector1_List1")
        val = el.get_attribute("class")
        assert val == config["json"]["object"]["List1"]["Attributes"]["Style"], "List has improper class attribute, differs from JSON config."

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
