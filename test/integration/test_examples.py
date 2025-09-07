import os
import json
import time
import pytest
import logging

import globalconf

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support import expected_conditions as EC

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger()

wd_options = webdriver.ChromeOptions()
wd_options.add_argument('ignore-certificate-errors')
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

    wd.set_window_size(1024, 3000)

    config = {}
    config["timeout"] = 10
    config["driver"] = wd
    config["base_url"] = '{}/python/Index.py'.format(vhost_test_urls['x0-app'])

    return config


class TestExamples:
    """Test all x0-framework relevant examples"""

    def test_example1_add_object_table_column(self, config):
        """Test Example 1: Adding object types as table columns"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example1'.format(config["base_url"])

        logger.info('testing example1 at url: {}'.format(get_url))
        d.get(get_url)

        wait = WebDriverWait(d, w)

        # wait for the main container to load
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))

        # Check for main application elements
        assert len(d.find_elements(By.TAG_NAME, "body")) > 0, "Example1 failed to load basic DOM structure"

        nav_button_id = "Screen1_TestList1Connector_TestList1_nav-row_col-nav-ct_col-nav-ct2_bt-page-item-2_button-right"

        elem = wait.until(EC.presence_of_element_located((By.ID, "TestList1col200_select")))
        elem = wait.until(EC.presence_of_element_located((By.ID, "TestList1col288_select")))
        elem = wait.until(EC.presence_of_element_located((By.ID, nav_button_id)))

        file_input = d.find_element(By.ID, "TestList1col200_select")
        file_input.send_keys("/var/lib/x0/test/integration/test_baseobjects.py")
        d.find_element(By.ID, "TestList1col200_TestList1col200UploadButton").click()

        nav_button_2 = d.find_element(By.ID, nav_button_id)
        nav_button_2.click()

        file_input = d.find_element(By.ID, "TestList1col288_select")
        file_input.send_keys("/var/lib/x0/test/integration/test_anomalies.py")
        d.find_element(By.ID, "TestList1col288_TestList1col288UploadButton").click()

    def test_example2_basic_menu_screen(self, config):
        """Test Example 2: Basic navigation menu implementation"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example2'.format(config["base_url"])

        logger.info('testing example2 at url: {}'.format(get_url))
        d.get(get_url)

        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))

        # Check for main application elements
        assert len(d.find_elements(By.TAG_NAME, "body")) > 0, "Example2 failed to load basic DOM structure"

        nav_button_id = "Screen1_TestList1Connector_TestList1_nav-row_col-nav-ct_col-nav-ct2_bt-page-item-2_button-right"

        elem = wait.until(EC.presence_of_element_located((By.ID, "sysMenu_Link2")))
        elem = wait.until(EC.presence_of_element_located((By.ID, "TR_TestList1_9")))
        elem = wait.until(EC.presence_of_element_located((By.ID, "TR_TestList1_19")))
        elem = wait.until(EC.presence_of_element_located((By.ID, nav_button_id)))

        # Look for menu links by ID patterns that should be generated
        links = d.find_elements(By.CSS_SELECTOR, "[id*='Link1'], [id*='Link2']")
        assert len(links) >= 1, "Example2 menu links not found in DOM"

        row1_element_page1 = d.find_element(By.ID, "TR_TestList1_0")
        row1_element_page1.click()

        row1_class = row1_element_page1.get_attribute("class")
        assert row1_class == "text-bg-secondary", "Row1 did not get hilited correct."

        nav_button_2 = d.find_element(By.ID, "Screen1_TestList1Connector_TestList1_nav-row_col-nav-ct_col-nav-ct2_bt-page-item-2_button-right")
        nav_button_2.click()

        row2_element_page2 = d.find_element(By.ID, "TR_TestList1_10")
        row2_element_page2.click()

        row2_class = row2_element_page2.get_attribute("class")
        assert row2_class == "text-bg-secondary", "Row1 did not get hilited correct."

        link2_button = d.find_element(By.ID, "sysMenu_Link2")
        link2_button.click()

    def test_example3_basic_tabcontainer(self, config):
        """Test Example 3: Simple tabbed interface"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example3'.format(config["base_url"])

        logger.info('testing example3 at url: {}'.format(get_url))
        d.get(get_url)

        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))
        elem = wait.until(EC.presence_of_element_located((By.ID, "Screen1_TabContainer1")))

        # Check for TabContainer element
        tab_containers = d.find_elements(By.CSS_SELECTOR, "[id*='TabContainer']")
        assert len(tab_containers) >= 1, "Example3 TabContainer not found"

    def test_example4_list_detail_switch_screen(self, config):
        """Test Example 4: List/detail view switching"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example4'.format(config["base_url"])

        logger.info('testing example4 at url: {}'.format(get_url))
        d.get(get_url)

        nav_button_id = "Screen1_TestList1Connector_TestList1_nav-row_col-nav-ct_col-nav-ct2_bt-page-item-2_button-right"

        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))
        elem = wait.until(EC.presence_of_element_located((By.ID, "TR_TestList1_9")))
        elem = wait.until(EC.presence_of_element_located((By.ID, "TR_TestList1_19")))
        elem = wait.until(EC.presence_of_element_located((By.ID, nav_button_id)))

        button_menu = wait.until(EC.presence_of_element_located((By.ID, "sysMenu_Link1")))

        # Check for ServiceConnector and FormfieldList elements
        service_connectors = d.find_elements(By.CSS_SELECTOR, "[id*='Connector']")
        formfield_lists = d.find_elements(By.CSS_SELECTOR, "[id*='Formfields']")
        assert len(service_connectors) >= 1 or len(formfield_lists) >= 1, "Example4 list/detail components not found"

        nav_button_2 = d.find_element(By.ID, nav_button_id)
        nav_button_2.click()

        row_10 = wait.until(EC.presence_of_element_located((By.ID, "TR_TestList1_10")))

        actions = ActionChains(d)
        actions.context_click(row_10).perform()

        elem = wait.until(EC.presence_of_element_located((By.ID, "ContextMenuCtMenu_TestList1")))
        ctmenu_edit = wait.until(EC.presence_of_element_located((By.ID, "ContextMenuCtMenu_TestList1_CMenuCtMenu_TestList1_CMenuRowEdit")))
        ctmenu_edit.click()

        form1 = wait.until(EC.presence_of_element_located((By.ID, "Formfield1")))
        form2 = wait.until(EC.presence_of_element_located((By.ID, "Formfield2")))
        form3 = wait.until(EC.presence_of_element_located((By.ID, "Formfield3")))

        time.sleep(1)

        assert form1.get_attribute('value') == "11", "Form value must be 11."
        assert form2.get_attribute('value') == "row11-1", "Form value must be row11-1."
        assert form3.get_attribute('value') == "row11-2", "Form value must be row11-2."

        button_menu.click()

        row_11 = wait.until(EC.presence_of_element_located((By.ID, "TR_TestList1_11")))

        actions = ActionChains(d)
        actions.context_click(row_11).perform()

        elem = wait.until(EC.presence_of_element_located((By.ID, "ContextMenuCtMenu_TestList1")))
        ctmenu_edit = wait.until(EC.presence_of_element_located((By.ID, "ContextMenuCtMenu_TestList1_CMenuCtMenu_TestList1_CMenuRowEdit")))
        ctmenu_edit.click()

        form1 = wait.until(EC.presence_of_element_located((By.ID, "Formfield1")))
        form2 = wait.until(EC.presence_of_element_located((By.ID, "Formfield2")))
        form3 = wait.until(EC.presence_of_element_located((By.ID, "Formfield3")))

        time.sleep(1)

        assert form1.get_attribute('value') == "12", "Form value must be 12."
        assert form2.get_attribute('value') == "row12-1", "Form value must be row12-1."
        assert form3.get_attribute('value') == "row12-2", "Form value must be row12-2."

    def test_example5_enhanced_form(self, config):
        """Test Example 5: Advanced form features and validation"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example5'.format(config["base_url"])

        logger.info('testing example5 at url: {}'.format(get_url))
        d.get(get_url)

        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))
        elem = wait.until(EC.presence_of_element_located((By.ID, "Screen1_HostingNewHostsSelectedUser")))

        add_dns_rec_button = wait.until(EC.presence_of_element_located((By.ID, "Screen1_HostingNewHostAddHostButton")))

        add_dns_rec_button.click()

        form_record_name = wait.until(EC.presence_of_element_located((By.ID, "RecordName")))
        form_record_type = wait.until(EC.presence_of_element_located((By.ID, "RecordType")))
        form_record_value = wait.until(EC.presence_of_element_located((By.ID, "RecordValue")))
        form_record_ttl = wait.until(EC.presence_of_element_located((By.ID, "RecordTTL")))
        form_record_prio = wait.until(EC.presence_of_element_located((By.ID, "RecordPriority")))

        form_record_name_class = form_record_name.get_attribute("class")
        assert "alert-danger" in form_record_name_class, "Record name is invalid, so it must contain alert-danger css class."

        form_record_name.send_keys("host1")
        Select(form_record_type).select_by_value("A")
        form_record_value.send_keys("87.45.23.45")

        add_dns_rec_button.click()

        form_record_name.send_keys("host2")
        Select(form_record_type).select_by_value("A")
        form_record_value.send_keys("87.45.23.46")

        add_dns_rec_button.click()

        form_record_name.send_keys("mx01")
        Select(form_record_type).select_by_value("MX")
        form_record_value.send_keys("87.45.23.47")
        form_record_ttl.send_keys("3600")
        form_record_prio.send_keys("10")

        add_dns_rec_button.click()

        form_record_name.send_keys("mx02")
        Select(form_record_type).select_by_value("MX")
        form_record_value.send_keys("87.45.23.48")
        form_record_ttl.send_keys("3600")
        form_record_prio.send_keys("20")

        add_dns_rec_button.click()

        form_record_name.send_keys("mx03")
        Select(form_record_type).select_by_value("MX")
        form_record_value.send_keys("mx02")
        form_record_ttl.send_keys("0")
        form_record_prio.send_keys("0")
        Select(form_record_type).select_by_value("CNAME")

        add_dns_rec_button.click()

        form_record_name.send_keys("www")
        Select(form_record_type).select_by_value("CNAME")
        form_record_value.send_keys("host1")

        add_dns_rec_button.click()

    def test_example6_screen_overlay(self, config):
        """Test Example 6: Modal overlay functionality"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example6'.format(config["base_url"])

        logger.info('testing example6 at url: {}'.format(get_url))
        d.get(get_url)

        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))

        assert len(d.find_elements(By.TAG_NAME, "body")) > 0, "Example6 failed to load"

        link_overlay_open = wait.until(EC.presence_of_element_located((By.ID, "Screen1_LinkOverlay")))

        link_overlay_open.click()

        tab_2 = wait.until(EC.presence_of_element_located((By.ID, "Screen2__overlay_TabContainer1__overlay_TabContainer1__overlayTabsContainer_Tab2")))
        overlay_close = wait.until(EC.presence_of_element_located((By.ID, "Screen2__overlay_ovl_close")))

        tab_2.click()
        overlay_close.click()

    def test_example7_list_objectdata_grid(self, config):
        """Test Example 7: Object data grid functionality"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example7'.format(config["base_url"])

        logger.info('testing example7 at url: {}'.format(get_url))
        d.get(get_url)

        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))

        assert len(d.find_elements(By.TAG_NAME, "body")) > 0, "Example7 failed to load"

        bt1 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_TestList1Connector_TestList1_nav-row_col-nav-ct_col-nav-ct2_bt-page-item-1_button-right")))

        cb1 = wait.until(EC.presence_of_element_located((By.ID, "FormCol10")))
        cb2 = wait.until(EC.presence_of_element_located((By.ID, "FormCol11")))
        cb3 = wait.until(EC.presence_of_element_located((By.ID, "FormCol12")))
        cb4 = wait.until(EC.presence_of_element_located((By.ID, "FormCol13")))

        assert cb1.is_selected(), "Checkbox1 must be checked"
        assert cb2.is_selected(), "Checkbox2 must be checked"
        assert cb3.is_selected() == False, "Checkbox3 must not be checked"
        assert cb4.is_selected() == False, "Checkbox4 must not be checked"

        bt2 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_TestList1Connector_TestList1_nav-row_col-nav-ct_col-nav-ct2_bt-page-item-2_button-right")))
        bt2.click()

        sel1 = wait.until(EC.presence_of_element_located((By.ID, "FormCol34")))
        sel2 = wait.until(EC.presence_of_element_located((By.ID, "FormCol35")))
        sel3 = wait.until(EC.presence_of_element_located((By.ID, "FormCol36")))
        sel4 = wait.until(EC.presence_of_element_located((By.ID, "FormCol37")))

        assert Select(sel1).first_selected_option.get_attribute('value') == '30', "Selected value must be 30"
        assert Select(sel2).first_selected_option.get_attribute('value') == '10', "Selected value must be 10"
        assert Select(sel3).first_selected_option.get_attribute('value') == '30', "Selected value must be 30"
        assert Select(sel4).first_selected_option.get_attribute('value') == '30', "Selected value must be 30"

        bt3 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_TestList1Connector_TestList1_nav-row_col-nav-ct_col-nav-ct2_bt-page-item-3_button-right")))
        bt3.click()

        ip1 = wait.until(EC.presence_of_element_located((By.ID, "FormCol48")))
        ip2 = wait.until(EC.presence_of_element_located((By.ID, "FormCol49")))
        ip3 = wait.until(EC.presence_of_element_located((By.ID, "FormCol410")))
        ip4 = wait.until(EC.presence_of_element_located((By.ID, "FormCol411")))

        assert ip1.get_attribute('value') == 'row9-4', "Value must be row9-4"
        assert ip2.get_attribute('value') == 'row10-4', "Value must be row10-4"
        assert ip3.get_attribute('value') == 'row11-4', "Value must be row11-4"
        assert ip4.get_attribute('value') == 'row12-4', "Value must be row12-4"

        bt4 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_TestList1Connector_TestList1_nav-row_col-nav-ct_col-nav-ct2_bt-page-item-4_button-right")))
        bt4.click()

        cb5 = wait.until(EC.presence_of_element_located((By.ID, "FormCol112")))
        cb6 = wait.until(EC.presence_of_element_located((By.ID, "FormCol113")))
        cb7 = wait.until(EC.presence_of_element_located((By.ID, "FormCol114")))

        assert cb5.is_selected() == False, "Checkbox1 must not be checked"
        assert cb6.is_selected() == False, "Checkbox3 must not be checked"
        assert cb7.is_selected() == False, "Checkbox4 must not be checked"

    def test_example8_multi_tabcontainer(self, config):
        """Test Example 8: Multi-level tabbed containers"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example8'.format(config["base_url"])

        logger.info('testing example8 at url: {}'.format(get_url))
        d.get(get_url)

        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))

        assert len(d.find_elements(By.TAG_NAME, "body")) > 0, "Example8 failed to load"

        tab1 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_TabContainer1_TabContainer1TabsContainer_Tab2")))
        tab1.click()

        tab2 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_TabContainer1_TabContainer1Ctnt_Tab2Content_TabContainer2_TabContainer2TabsContainer_Tab2-2")))
        tab2.click()

    def test_example9_bootstrap_rowspan(self, config):
        """Test Example 9: Bootstrap grid with rowspan functionality"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example9'.format(config["base_url"])

        logger.info('testing example9 at url: {}'.format(get_url))
        d.get(get_url)

        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))

        assert len(d.find_elements(By.TAG_NAME, "body")) > 0, "Example9 failed to load"

    def test_example10_net_messages(self, config):
        """Test Example 10: Network messaging between sessions"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example10'.format(config["base_url"])

        logger.info('testing example10 at url: {}'.format(get_url))
        d.get(get_url)

        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))

        assert len(d.find_elements(By.TAG_NAME, "body")) > 0, "Example10 failed to load"

    def test_example11_object_instances(self, config):
        """Test Example 11: Dynamic object instancing (experimental)"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example11'.format(config["base_url"])

        logger.info('testing example11 at url: {}'.format(get_url))
        d.get(get_url)

        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))

        assert len(d.find_elements(By.TAG_NAME, "body")) > 0, "Example11 failed to load"

    def test_example12_list_dyn_radio(self, config):
        """Test Example 12: Dynamic radio button lists"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example12'.format(config["base_url"])

        logger.info('testing example12 at url: {}'.format(get_url))
        d.get(get_url)

        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))

        assert len(d.find_elements(By.TAG_NAME, "body")) > 0, "Example12 failed to load"

        row1_radio1 = wait.until(EC.presence_of_element_located((By.ID, "row-ctaindynradiolist00-root")))
        row1_add = wait.until(EC.presence_of_element_located((By.ID, "TR_TestList1_0_r2_c2_colradiolist0_dynradiolist0_row-ctaindynradiolist00_col-btn")))
        row1_input = wait.until(EC.presence_of_element_located((By.ID, "input-textrow-ctaindynradiolist000")))
        row1_input.send_keys('input1');

        row1_add.click()
        row1_add.click()
        row1_add.click()

        row1_radio2 = wait.until(EC.presence_of_element_located((By.ID, "row-ctaindynradiolist01-root")))
        row1_input2 = wait.until(EC.presence_of_element_located((By.ID, "input-textrow-ctaindynradiolist011")))
        row1_input2.send_keys('input2');
        row1_remove1 = wait.until(EC.presence_of_element_located((By.ID, "TR_TestList1_0_r2_c2_colradiolist0_dynradiolist0_row-ctaindynradiolist01_col-btn")))

        row1_remove1.click();

        row2_radio1 = wait.until(EC.presence_of_element_located((By.ID, "row-ctaindynradiolist10-root")))
        row2_add = wait.until(EC.presence_of_element_located((By.ID, "TR_TestList1_1_r2_c2_colradiolist1_dynradiolist1_row-ctaindynradiolist10_col-btn")))
        row2_input = wait.until(EC.presence_of_element_located((By.ID, "input-textrow-ctaindynradiolist100")))
        row2_input.send_keys('input3');

        row2_add.click()
        row2_add.click()
        row2_add.click()
        row2_add.click()
        row2_add.click()

        row2_radio2 = wait.until(EC.presence_of_element_located((By.ID, "row-ctaindynradiolist11-root")))
        row2_input2 = wait.until(EC.presence_of_element_located((By.ID, "input-textrow-ctaindynradiolist111")))
        row2_input2.send_keys('input4');
        row2_remove1 = wait.until(EC.presence_of_element_located((By.ID, "TR_TestList1_1_r2_c2_colradiolist1_dynradiolist1_row-ctaindynradiolist11_col-btn")))

        row2_remove1.click();

        nav3_button = wait.until(EC.presence_of_element_located((By.ID, "Screen1_TestList1Connector_TestList1_nav-row_col-nav-ct_col-nav-ct2_bt-page-item-3_button-right")))
        nav3_button.click()

        row3_radio1 = wait.until(EC.presence_of_element_located((By.ID, "row-ctaindynradiolist100-root")))
        row3_add = wait.until(EC.presence_of_element_located((By.ID, "TR_TestList1_10_r2_c2_colradiolist10_dynradiolist10_row-ctaindynradiolist100_col-btn")))
        row3_input = wait.until(EC.presence_of_element_located((By.ID, "input-textrow-ctaindynradiolist1000")))
        row3_input.send_keys('input1');

        row3_add.click()
        row3_add.click()
        row3_add.click()

        row3_radio2 = wait.until(EC.presence_of_element_located((By.ID, "row-ctaindynradiolist101-root")))
        row3_input2 = wait.until(EC.presence_of_element_located((By.ID, "input-textrow-ctaindynradiolist1011")))
        row3_input2.send_keys('input2');
        row3_remove1 = wait.until(EC.presence_of_element_located((By.ID, "TR_TestList1_10_r2_c2_colradiolist10_dynradiolist10_row-ctaindynradiolist101_col-btn")))

        row3_remove1.click();

        row4_radio1 = wait.until(EC.presence_of_element_located((By.ID, "row-ctaindynradiolist110-root")))
        row4_add = wait.until(EC.presence_of_element_located((By.ID, "TR_TestList1_11_r2_c2_colradiolist11_dynradiolist11_row-ctaindynradiolist110_col-btn")))
        row4_input = wait.until(EC.presence_of_element_located((By.ID, "input-textrow-ctaindynradiolist1100")))
        row4_input.send_keys('input3');

        row4_add.click()
        row4_add.click()
        row4_add.click()
        row4_add.click()
        row4_add.click()

        row4_radio2 = wait.until(EC.presence_of_element_located((By.ID, "row-ctaindynradiolist111-root")))
        row4_input2 = wait.until(EC.presence_of_element_located((By.ID, "input-textrow-ctaindynradiolist1111")))
        row4_input2.send_keys('input4');
        row4_remove1 = wait.until(EC.presence_of_element_located((By.ID, "TR_TestList1_11_r2_c2_colradiolist11_dynradiolist11_row-ctaindynradiolist111_col-btn")))

        row4_remove1.click();

    def test_example13_copy_paste(self, config):
        """Test Example 13: Copy/paste functionality between objects"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example13'.format(config["base_url"])

        logger.info('testing example13 at url: {}'.format(get_url))
        d.get(get_url)

        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))

        assert len(d.find_elements(By.TAG_NAME, "body")) > 0, "Example13 failed to load"

        row1 = wait.until(EC.presence_of_element_located((By.ID, "TR_TestList1_0")))
        row2 = wait.until(EC.presence_of_element_located((By.ID, "TR_TestList1_1")))
        row3 = wait.until(EC.presence_of_element_located((By.ID, "TR_TestList1_2")))
        row9 = wait.until(EC.presence_of_element_located((By.ID, "TR_TestList1_9")))

        actions = ActionChains(d)
        actions.context_click(row3).perform()

        ctxt_menu_get = wait.until(EC.presence_of_element_located((By.ID, "ContextMenuCtMenu_TestList1_CMenuCtMenu_TestList1_CMenuRowGetData")))
        ctxt_menu_get.click()

        dst_tab = wait.until(EC.presence_of_element_located((By.ID, "Screen1_TabContainer1_TabContainer1TabsContainer_Tab2")))
        dst_tab.click()

        dstform = wait.until(EC.presence_of_element_located((By.ID, "Screen1_TabContainer1_TabContainer1Ctnt_Tab2Content_FormlistSetData")))

        actions = ActionChains(d)
        actions.context_click(dstform).perform()

        ctxt_menu_set = wait.until(EC.presence_of_element_located((By.ID, "ContextMenuCtMenu_FormlistSetData_CMenuCtMenu_FormlistSetData_CMenuRowSetData")))
        ctxt_menu_set.click()

        col1 = wait.until(EC.presence_of_element_located((By.ID, "col1")))
        col2 = wait.until(EC.presence_of_element_located((By.ID, "col2")))
        col3 = wait.until(EC.presence_of_element_located((By.ID, "col3")))
        col4 = wait.until(EC.presence_of_element_located((By.ID, "col4")))

        assert col1.is_selected() == False, "Checkbox must not be checked"
        assert col2.get_attribute("value") == 'row3-2', "Value must be row3-2"
        assert Select(col3).first_selected_option.get_attribute('value') == '20', "Selected value must be 20"
        assert col4.get_attribute("value") == 'row3-4', "Value must be row3-4"

        src_tab = wait.until(EC.presence_of_element_located((By.ID, "Screen1_TabContainer1_TabContainer1TabsContainer_Tab1")))
        src_tab.click()

        nav2_button = wait.until(EC.presence_of_element_located((By.ID, "Screen1_TabContainer1_TabContainer1Ctnt_Tab1Content_TestList1Connector_TestList1_nav-row_col-nav-ct_col-nav-ct2_bt-page-item-2_button-right")))
        nav2_button.click()

        row10 = wait.until(EC.presence_of_element_located((By.ID, "TR_TestList1_10")))
        row11 = wait.until(EC.presence_of_element_located((By.ID, "TR_TestList1_11")))
        row12 = wait.until(EC.presence_of_element_located((By.ID, "TR_TestList1_12")))
        row14 = wait.until(EC.presence_of_element_located((By.ID, "TR_TestList1_14")))

        actions = ActionChains(d)
        actions.context_click(row14).perform()

        ctxt_menu_get = wait.until(EC.presence_of_element_located((By.ID, "ContextMenuCtMenu_TestList1_CMenuCtMenu_TestList1_CMenuRowGetData")))
        ctxt_menu_get.click()

        dst_tab = wait.until(EC.presence_of_element_located((By.ID, "Screen1_TabContainer1_TabContainer1TabsContainer_Tab2")))
        dst_tab.click()

        dstform = wait.until(EC.presence_of_element_located((By.ID, "Screen1_TabContainer1_TabContainer1Ctnt_Tab2Content_FormlistSetData")))

        actions = ActionChains(d)
        actions.context_click(dstform).perform()

        ctxt_menu_set = wait.until(EC.presence_of_element_located((By.ID, "ContextMenuCtMenu_FormlistSetData_CMenuCtMenu_FormlistSetData_CMenuRowSetData")))
        ctxt_menu_set.click()

        col1 = wait.until(EC.presence_of_element_located((By.ID, "col1")))
        col2 = wait.until(EC.presence_of_element_located((By.ID, "col2")))
        col3 = wait.until(EC.presence_of_element_located((By.ID, "col3")))
        col4 = wait.until(EC.presence_of_element_located((By.ID, "col4")))

        assert col1.is_selected() == False, "Checkbox must not be checked"
        assert col2.get_attribute("value") == 'row15-2', "Value must be row15-2"
        assert Select(col3).first_selected_option.get_attribute('value') == '10', "Selected value must be 10"
        assert col4.get_attribute("value") == 'row15-4', "Value must be row15-4"

    def test_example14_open_close_container(self, config):
        """Test Example 14: Collapsible container sections"""
        d, w = config["driver"], config["timeout"]
        get_url = '{}?appid=example14'.format(config["base_url"])

        logger.info('testing example14 at url: {}'.format(get_url))
        d.get(get_url)

        wait = WebDriverWait(d, w)
        elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))

        assert len(d.find_elements(By.TAG_NAME, "body")) > 0, "Example14 failed to load"

        oc1 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement1_card-ctn_card-header-ctn_card-header-row_open-close-button")))
        oc2 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement2_card-ctn_card-header-ctn_card-header-row_open-close-button")))
        oc3 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement2_OpenCloseElement3_card-ctn_card-header-ctn_card-header-row_open-close-button")))

        t1 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement1_SQLText1")))
        t2 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement1_SQLText2")))
        t3 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement2_SQLText3")))
        t4 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement2_SQLText4")))
        t5 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement2_OpenCloseElement3_SQLText5")))
        t6 = wait.until(EC.presence_of_element_located((By.ID, "Screen1_OpenCloseElement2_OpenCloseElement3_SQLText6")))

        oc2.click()

        assert t3.is_displayed() == False, "Text3 must be hidden"
        assert t4.is_displayed() == False, "Text4 must be hidden"
        assert t5.is_displayed() == False, "Text5 must be hidden"
        assert t6.is_displayed() == False, "Text6 must be hidden"

        oc2.click()

        assert t3.is_displayed(), "Text3 must be displayed"
        assert t4.is_displayed(), "Text4 must be displayed"
        assert t5.is_displayed(), "Text5 must be displayed"
        assert t6.is_displayed(), "Text6 must be displayed"

        oc3.click()

        assert t5.is_displayed() == False, "Text5 must be hidden"
        assert t6.is_displayed() == False, "Text6 must be hidden"

        oc3.click()

        assert t5.is_displayed(), "Text5 must be displayed"
        assert t6.is_displayed(), "Text6 must be displayed"

        oc1.click()

        assert t1.is_displayed() == False, "Text1 must be hidden"
        assert t2.is_displayed() == False, "Text2 must be hidden"

        oc1.click()

        assert t1.is_displayed(), "Text1 must be displayed"
        assert t2.is_displayed(), "Text2 must be displayed"

        # Clean up driver after last test (following existing pattern)
        d.quit()
