import time
import pytest
import logging
import psycopg2

import dbpool.pool as pool

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


@pytest.fixture
def config():
    config = {}
    config['driver'] = webdriver.Chrome()
    config['driver'].get("http://webui-test.spx-prod.webcodex.de")
    return config


class TestSearch:

    def test_search_code(self, config):
        d = config['driver']
        input1 = WebDriverWait(d, 30).until(
            EC.presence_of_element_located(
                (By.ID, "ShipmentInGlobalViewSearchCodeCode")
            )
        )
        input1.clear()
        input1.send_keys("Test")
        button = d.find_element_by_id("ShipmentInView_ShipmentInGlobalViewSubmit_SQLText")
        button.click()
        d.close()
