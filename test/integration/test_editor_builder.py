import os
import pytest
import logging

import globalconf

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
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
    except Exception:
        run_namespace = None

    try:
        run_kube_env = os.environ['KUBERNETES_SERVICE_HOST']
    except Exception:
        run_kube_env = None

    try:
        domain_suffix = '.' + run_namespace
    except Exception:
        domain_suffix = ''

    if run_kube_env is not None:
        domain_suffix += '.svc.cluster.local'

    vhost_test_urls = globalconf.setup()

    selenium_server_url = 'http://selenium-server-0{}:4444'.format(domain_suffix)

    wd = webdriver.Remote(
        command_executor=selenium_server_url,
        options=wd_options
    )

    cfg = {}
    cfg['timeout'] = 10
    cfg['driver'] = wd
    cfg['base_url'] = '{}/python/Index.py'.format(vhost_test_urls['x0-app'])

    return cfg


class TestEditorBuilder:

    def test_editor_builder_add_switch_and_dnd_reparent(self, config):
        d, w = config['driver'], config['timeout']
        get_url = '{}?appid=test_editor_builder'.format(config['base_url'])

        logger.info('testing editor builder at url: {}'.format(get_url))
        d.get(get_url)

        wait = WebDriverWait(d, w)

        wait.until(EC.presence_of_element_located((By.ID, 'Screen1_ObjectEditor1__canvas')))

        add_screen = wait.until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, '#Screen1_ObjectEditor1 [data-editor-action="add-screen"]')
            )
        )
        add_screen.click()

        wait.until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, '#Screen1_ObjectEditor1 [data-editor-action="switch-screen"][data-screen-id="Screen2"]')
            )
        )

        d.execute_script("""
            var editor = sysFactory.getObjectByID('ObjectEditor1');
            var root = document.querySelector('#Screen1_ObjectEditor1 [data-drop-target="1"][data-parent-id="Screen2"]');

            editor.EventListenerDrop({
                preventDefault: function(){},
                target: root,
                dataTransfer: {
                    getData: function(key) {
                        if (key === 'x0-editor-kind') return 'system-type';
                        if (key === 'x0-editor-system-type') return 'Div';
                        return '';
                    }
                }
            });

            editor.createObjectOnScreen('Div', 'DivEditorA', 'Screen2', 'Screen2', {'Style':'border p-2', 'Value':'A'});
            editor.createObjectOnScreen('Div', 'DivEditorB', 'Screen2', 'DivEditorA', {'Style':'border p-2', 'Value':'B'});

            var target = document.querySelector('#Screen1_ObjectEditor1 [data-drop-target="1"][data-parent-id="Screen2"]');
            editor.EventListenerDrop({
                preventDefault: function(){},
                target: target,
                dataTransfer: {
                    getData: function(key) {
                        if (key === 'x0-editor-kind') return 'existing-object';
                        if (key === 'x0-editor-object-id') return 'DivEditorB';
                        return '';
                    }
                }
            });
            return true;
        """)

        result = d.execute_script("""
            var screen = sysFactory.DataSkeleton.XMLRPCResultData['Screen2'];
            var parentMap = {};
            for (var i=0; i<screen.length; i++) {
                var key = Object.keys(screen[i])[0];
                parentMap[key] = screen[i][key].RefID;
            }
            return {
                hasDivEditorA: parentMap['DivEditorA'] !== undefined,
                hasDivEditorB: parentMap['DivEditorB'] !== undefined,
                parentOfDivEditorB: parentMap['DivEditorB']
            };
        """)

        assert result['hasDivEditorA'] is True, 'DivEditorA must exist in runtime skeleton metadata.'
        assert result['hasDivEditorB'] is True, 'DivEditorB must exist in runtime skeleton metadata.'
        assert result['parentOfDivEditorB'] == 'Screen2', 'DivEditorB must be reparented to Screen2 root.'

        d.quit()
