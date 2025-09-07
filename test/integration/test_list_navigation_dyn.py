import os
import json
import time
import pytest
import logging

import globalconf

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger()

wd_options = webdriver.ChromeOptions()
wd_options.add_argument('ignore-certificate-errors')
wd_options.add_argument('window-size=1920,2400')
wd_options.add_argument('headless')


@pytest.fixture(scope='module')
def config():

    try:
        run_namespace = os.environ['RUN_NAMESPACE']
    except Exception as e:
        run_namespace = None

    try:
        run_kube_env = os.environ['KUBERNETES_SERVICE_HOST']
    except Exception as e:
        run_kube_env = None

    try:
        domain_suffix = '.' + run_namespace
    except Exception as e:
        domain_suffix = ''

    if run_kube_env is not None:
        domain_suffix += '.svc.cluster.local'

    vhost_test_urls = globalconf.setup()

    logger.info('test urls:{}'.format(vhost_test_urls))

    selenium_server_url = 'http://selenium-server-0{}:4444'.format(domain_suffix)

    logger.info('selenium server url:{}'.format(selenium_server_url))

    wd = webdriver.Remote(
        command_executor=selenium_server_url,
        options=wd_options
    )

    confparams = {}
    confparams["timeout"] = 10
    confparams["driver"] = wd

    get_url = '{}/python/Index.py?appid=test_list_navigation_dyn'.format(vhost_test_urls['x0-app'])

    logger.info('test (get) url:{}'.format(get_url))

    confparams["driver"].get(get_url)

    return confparams


class TestDynamicListNavigation:

    def test_add_rows_nav(self, config):
        """Check adding rows and dynamic navigation buttons"""

        d, w = config["driver"], config["timeout"]
        wait = WebDriverWait(d, w)

        col1_ff_text = wait.until(EC.presence_of_element_located((By.ID, "ListCol1")))
        col2_ff_text = wait.until(EC.presence_of_element_located((By.ID, "ListCol2")))
        col3_ff_text = wait.until(EC.presence_of_element_located((By.ID, "ListCol3")))
        button_add = wait.until(EC.presence_of_element_located((By.ID, "Screen1_AddListEntryButton")))

        col1_ff_text.send_keys('val1-1')
        col2_ff_text.send_keys('val1-2')
        col3_ff_text.send_keys('val1-3')
        button_add.click()

        col1_ff_text.clear()
        col1_ff_text.send_keys('val2-1')
        col2_ff_text.clear()
        col2_ff_text.send_keys('val2-2')
        col3_ff_text.clear()
        col3_ff_text.send_keys('val2-3')
        button_add.click()

        col1_ff_text.clear()
        col1_ff_text.send_keys('val3-1')
        col2_ff_text.clear()
        col2_ff_text.send_keys('val3-2')
        col3_ff_text.clear()
        col3_ff_text.send_keys('val3-3')
        button_add.click()

        col1_ff_text.clear()
        col1_ff_text.send_keys('val4-1')
        col2_ff_text.clear()
        col2_ff_text.send_keys('val4-2')
        col3_ff_text.clear()
        col3_ff_text.send_keys('val4-3')
        button_add.click()

        col1_ff_text.clear()
        col1_ff_text.send_keys('val5-1')
        col2_ff_text.clear()
        col2_ff_text.send_keys('val5-2')
        col3_ff_text.clear()
        col3_ff_text.send_keys('val5-3')
        button_add.click()

        col1_ff_text.clear()
        col1_ff_text.send_keys('val6-1')
        col2_ff_text.clear()
        col2_ff_text.send_keys('val6-2')
        col3_ff_text.clear()
        col3_ff_text.send_keys('val6-3')
        button_add.click()

        button_nav2 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_ListDst_nav-row_col-nav-ct_col-nav-ct2_bt-page-item-2_button-right")))
        button_nav2.click()

        table = wait.until(EC.presence_of_element_located((By.ID, "Screen1_ListDst")))

        r1 = wait.until(EC.presence_of_element_located((By.ID, "TR_ListDst_5")))
        r2 = wait.until(EC.presence_of_element_located((By.ID, "TR_ListDst_5_r3")))

        c1 = wait.until(EC.presence_of_element_located((By.ID, "TR_ListDst_5_r3_c1")))
        c2 = wait.until(EC.presence_of_element_located((By.ID, "TR_ListDst_5_r3_c1_ListCol15")))
        c3 = wait.until(EC.presence_of_element_located((By.ID, "TR_ListDst_5_r3_c2")))
        c4 = wait.until(EC.presence_of_element_located((By.ID, "TR_ListDst_5_r3_c2_ListCol25")))
        c5 = wait.until(EC.presence_of_element_located((By.ID, "TR_ListDst_5_r3_c3")))
        c6 = wait.until(EC.presence_of_element_located((By.ID, "TR_ListDst_5_r3_c3_ListCol35")))

        assert c2.get_attribute("innerHTML") == 'val6-1' , "Row value must be val6-1"
        assert c4.get_attribute("innerHTML") == 'val6-2' , "Row value must be val6-2"
        assert c6.get_attribute("innerHTML") == 'val6-3' , "Row value must be val6-3"

        col1_ff_text.clear()
        col1_ff_text.send_keys('val7-1')
        col2_ff_text.clear()
        col2_ff_text.send_keys('val7-2')
        col3_ff_text.clear()
        col3_ff_text.send_keys('val7-3')
        button_add.click()

        col1_ff_text.clear()
        col1_ff_text.send_keys('val8-1')
        col2_ff_text.clear()
        col2_ff_text.send_keys('val8-2')
        col3_ff_text.clear()
        col3_ff_text.send_keys('val8-3')
        button_add.click()

        col1_ff_text.clear()
        col1_ff_text.send_keys('val9-1')
        col2_ff_text.clear()
        col2_ff_text.send_keys('val9-2')
        col3_ff_text.clear()
        col3_ff_text.send_keys('val9-3')
        button_add.click()

        col1_ff_text.clear()
        col1_ff_text.send_keys('val10-1')
        col2_ff_text.clear()
        col2_ff_text.send_keys('val10-2')
        col3_ff_text.clear()
        col3_ff_text.send_keys('val10-3')
        button_add.click()

        col1_ff_text.clear()
        col1_ff_text.send_keys('val11-1')
        col2_ff_text.clear()
        col2_ff_text.send_keys('val11-2')
        col3_ff_text.clear()
        col3_ff_text.send_keys('val11-3')
        button_add.click()

        col1_ff_text.clear()
        col1_ff_text.send_keys('val12-1')
        col2_ff_text.clear()
        col2_ff_text.send_keys('val12-2')
        col3_ff_text.clear()
        col3_ff_text.send_keys('val12-3')
        button_add.click()

        col1_ff_text.clear()
        col1_ff_text.send_keys('val13-1')
        col2_ff_text.clear()
        col2_ff_text.send_keys('val13-2')
        col3_ff_text.clear()
        col3_ff_text.send_keys('val13-3')
        button_add.click()

        button_nav4 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_ListDst_nav-row_col-nav-ct_col-nav-ct2_bt-page-item-4_button-right")))
        button_nav4.click()

        button_nav2 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_ListDst_nav-row_col-nav-ct_col-nav-ct2_bt-page-item-2_button-right")))
        button_nav2.click()

        table = wait.until(EC.presence_of_element_located((By.ID, "Screen1_ListDst")))

        r1 = wait.until(EC.presence_of_element_located((By.ID, "TR_ListDst_4")))
        r2 = wait.until(EC.presence_of_element_located((By.ID, "TR_ListDst_5")))
        r3 = wait.until(EC.presence_of_element_located((By.ID, "TR_ListDst_6")))
        r4 = wait.until(EC.presence_of_element_located((By.ID, "TR_ListDst_7")))

        r1.click()
        r2.click()
        r4.click();

        actions = ActionChains(d)
        actions.context_click(r2).perform()

        ctxtm_remove_selected = wait.until(EC.presence_of_element_located((By.ID, "ContextMenuCtMenu_ListDst_CMenuCtMenu_ListDst_CMenuRowRemoveSelected")))
        ctxtm_remove_selected.click()

        table = wait.until(EC.presence_of_element_located((By.ID, "Screen1_ListDst")))

        r1 = wait.until(EC.presence_of_element_located((By.ID, "TR_ListDst_4")))
        r2 = wait.until(EC.presence_of_element_located((By.ID, "TR_ListDst_4_r3")))

        c1 = wait.until(EC.presence_of_element_located((By.ID, "TR_ListDst_4_r3_c1")))
        c2 = wait.until(EC.presence_of_element_located((By.ID, "TR_ListDst_4_r3_c1_ListCol14")))
        c3 = wait.until(EC.presence_of_element_located((By.ID, "TR_ListDst_4_r3_c2")))
        c4 = wait.until(EC.presence_of_element_located((By.ID, "TR_ListDst_4_r3_c2_ListCol24")))
        c5 = wait.until(EC.presence_of_element_located((By.ID, "TR_ListDst_4_r3_c3")))
        c6 = wait.until(EC.presence_of_element_located((By.ID, "TR_ListDst_4_r3_c3_ListCol34")))

        assert c2.get_attribute("innerHTML") == 'val7-1' , "Row value must be val6-1"
        assert c4.get_attribute("innerHTML") == 'val7-2' , "Row value must be val6-2"
        assert c6.get_attribute("innerHTML") == 'val7-3' , "Row value must be val6-3"

        col1_ff_text.clear()
        col1_ff_text.send_keys('val14-1')
        col2_ff_text.clear()
        col2_ff_text.send_keys('val14-2')
        col3_ff_text.clear()
        col3_ff_text.send_keys('val14-3')
        button_add.click()
        col1_ff_text.clear()

        col1_ff_text.send_keys('val15-1')
        col2_ff_text.clear()
        col2_ff_text.send_keys('val15-2')
        col3_ff_text.clear()
        col3_ff_text.send_keys('val15-3')
        button_add.click()

        col1_ff_text.clear()
        col1_ff_text.send_keys('val16-1')
        col2_ff_text.clear()
        col2_ff_text.send_keys('val16-2')
        col3_ff_text.clear()
        col3_ff_text.send_keys('val16-3')
        button_add.click()

        col1_ff_text.clear()
        col1_ff_text.send_keys('val17-1')
        col2_ff_text.clear()
        col2_ff_text.send_keys('val17-2')
        col3_ff_text.clear()
        col3_ff_text.send_keys('val17-3')
        button_add.click()

        col1_ff_text.clear()
        col1_ff_text.send_keys('val18-1')
        col2_ff_text.clear()
        col2_ff_text.send_keys('val18-2')
        col3_ff_text.clear()
        col3_ff_text.send_keys('val18-3')
        button_add.click()

        col1_ff_text.clear()
        col1_ff_text.send_keys('val19-1')
        col2_ff_text.clear()
        col2_ff_text.send_keys('val19-2')
        col3_ff_text.clear()
        col3_ff_text.send_keys('val19-3')
        button_add.click()

        col1_ff_text.clear()
        col1_ff_text.send_keys('val20-1')
        col2_ff_text.clear()
        col2_ff_text.send_keys('val20-2')
        col3_ff_text.clear()
        col3_ff_text.send_keys('val20-3')
        button_add.click()

        button_nav5 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_ListDst_nav-row_col-nav-ct_col-nav-ct2_bt-page-item-5_button-right")))
        button_nav5.click()

        config["driver"].quit()
