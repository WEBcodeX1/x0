import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
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
    config["timeout"] = 10
    config["options"] = webdriver.ChromeOptions()
    config["options"].add_argument('ignore-certificate-errors')
    config["options"].add_argument('headless')
    config["driver"] = webdriver.Chrome(options=config["options"])
    config["driver"].get('{}/python/Index.py?appid=test_text_values'.format(test_url))
    return config


class TestTextValues:
    def test_text_values(self, config):
        """Check if the standard text values are present in the DB"""
        d, w = config["driver"], config["timeout"]
        wait = WebDriverWait(d, w)

        logging.info("Checking presence of correct text in elements..")

        el1 = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#Screen1_SQLText1")))
        el2 = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#Screen1_SQLText2")))
        el3 = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#Screen1_SQLText3")))
        el4 = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#Screen1_SQLText4")))
        el5 = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#Screen1_SQLText5")))
        el6 = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#Screen1_SQLText6")))
        el7 = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#Screen1_SQLText7")))

        assert el1.text == "Link 1", "Test element has wrong text!"
        assert el2.text == "SQL Text Test", "Test element has wrong text!"
        assert el3.text == "Button 1", "Test element has wrong text!"
        assert el4.text == "Button left <<", "Test element has wrong text!"
        assert el5.text == "Button right >>", "Test element has wrong text!"
        assert el6.text == "Upload Button Descr", "Test element has wrong text!"
        assert el7.text == "Upload Button", "Test element has wrong text!"

        d.close()
