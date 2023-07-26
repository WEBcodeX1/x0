import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

@pytest.fixture

def config():
    config = {}
    config["wait"] = 5
    config["options"] = webdriver.ChromeOptions()
    config["options"].add_argument('ignore-certificate-errors')
    config["options"].add_argument('headless')
    config["driver"] = webdriver.Chrome(options=config["options"])
    config["driver"].get("https://x0-app.kicker-finder.de/python/Index.py?appid=test_base");
    config["ready_selector"] = "#Test1" # selector to look for to declare DOM ready
    return config


class TestGeneral:
    def test_suspicious_id_null(self, config):
        """Find suspicious ID names containing the string null"""
        d, w = config["driver"], config["wait"]
        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, config["ready_selector"])))

        elems = d.find_elements(By.XPATH, "//*[contains(@id,'null')]")
        assert len(elems) == 0, 'Problematic string "null" found in one or more IDs'

        d.close()

    def test_suspicious_id_undefined(self, config):
        """Find suspicious ID names containing the string undefined"""
        d, w = config["driver"], config["wait"]
        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, config["ready_selector"])))

        elems = d.find_elements(By.XPATH, "//*[contains(@id,'undefined')]")
        assert len(elems) == 0, 'Problematic string "undefined" found in one or more IDs'

        d.close()

    def test_suspicious_parameter_values(self, config):
        """Find suspicious element parameter values (containing null or undefined)"""
        d, w = config["driver"], config["wait"]
        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, config["ready_selector"])))

        elems = d.find_elements(By.XPATH, "//*[@*='null' or @*='undefined']")
        assert len(elems) == 0, 'Found ' + str(len(elems)) + ' occurrences of string "undefined" in one or more parameter values on page'

        d.close()
