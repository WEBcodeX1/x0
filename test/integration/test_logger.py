import os
import json
import time
import pytest
import logging

import globalconf

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
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

    config = {
        'vhost_test_urls': vhost_test_urls,
        'selenium_server_url': selenium_server_url,
        'timeout': 60
    }

    return config


@pytest.fixture(scope='module')
def driver(config):

    selenium_server_url = config['selenium_server_url']

    driver = webdriver.Remote(
        command_executor=selenium_server_url,
        options=wd_options
    )

    driver.implicitly_wait(config['timeout'])

    yield driver

    driver.quit()


def test_logger_initialization(driver, config):
    """Test that sysLogger is properly initialized"""
    
    test_url = config['vhost_test_urls'][0]
    logger.info('Test URL: {}'.format(test_url))
    
    driver.get(test_url)
    
    # Wait for page to load
    time.sleep(3)
    
    # Check that sysFactory exists
    result = driver.execute_script("return typeof sysFactory !== 'undefined';")
    assert result == True, "sysFactory should be defined"
    
    # Check that Logger exists on sysFactory
    result = driver.execute_script("return typeof sysFactory.Logger !== 'undefined';")
    assert result == True, "sysFactory.Logger should be defined"
    
    # Check that Logger is an instance of sysLogger
    result = driver.execute_script("return sysFactory.Logger instanceof sysLogger;")
    assert result == True, "sysFactory.Logger should be an instance of sysLogger"
    
    logger.info('Logger initialization test passed')


def test_logger_methods_exist(driver, config):
    """Test that all logger methods exist"""
    
    test_url = config['vhost_test_urls'][0]
    driver.get(test_url)
    time.sleep(3)
    
    # Check for debug method
    result = driver.execute_script("return typeof sysFactory.Logger.debug === 'function';")
    assert result == True, "Logger should have debug method"
    
    # Check for info method
    result = driver.execute_script("return typeof sysFactory.Logger.info === 'function';")
    assert result == True, "Logger should have info method"
    
    # Check for warn method
    result = driver.execute_script("return typeof sysFactory.Logger.warn === 'function';")
    assert result == True, "Logger should have warn method"
    
    # Check for error method
    result = driver.execute_script("return typeof sysFactory.Logger.error === 'function';")
    assert result == True, "Logger should have error method"
    
    # Check for log method
    result = driver.execute_script("return typeof sysFactory.Logger.log === 'function';")
    assert result == True, "Logger should have log method"
    
    # Check for setLogLevel method
    result = driver.execute_script("return typeof sysFactory.Logger.setLogLevel === 'function';")
    assert result == True, "Logger should have setLogLevel method"
    
    # Check for getLogLevel method
    result = driver.execute_script("return typeof sysFactory.Logger.getLogLevel === 'function';")
    assert result == True, "Logger should have getLogLevel method"
    
    logger.info('Logger methods test passed')


def test_logger_level_configuration(driver, config):
    """Test that logger respects debug level from configuration"""
    
    test_url = config['vhost_test_urls'][0]
    driver.get(test_url)
    time.sleep(3)
    
    # Get the configured log level
    result = driver.execute_script("return sysFactory.Logger.getLogLevel();")
    logger.info('Current log level: {}'.format(result))
    
    # The default configuration should be 10 (DEBUG)
    assert result >= 0, "Log level should be >= 0"
    
    # Test that we can change the log level
    driver.execute_script("sysFactory.Logger.setLogLevel(5);")
    result = driver.execute_script("return sysFactory.Logger.getLogLevel();")
    assert result == 5, "Log level should be 5 after setting"
    
    logger.info('Logger level configuration test passed')


def test_logger_constants(driver, config):
    """Test that logger constants are defined"""
    
    test_url = config['vhost_test_urls'][0]
    driver.get(test_url)
    time.sleep(3)
    
    # Check log level constants
    result = driver.execute_script("return sysLogger.LOG_LEVEL_NONE;")
    assert result == 0, "LOG_LEVEL_NONE should be 0"
    
    result = driver.execute_script("return sysLogger.LOG_LEVEL_ERROR;")
    assert result == 1, "LOG_LEVEL_ERROR should be 1"
    
    result = driver.execute_script("return sysLogger.LOG_LEVEL_WARN;")
    assert result == 5, "LOG_LEVEL_WARN should be 5"
    
    result = driver.execute_script("return sysLogger.LOG_LEVEL_INFO;")
    assert result == 8, "LOG_LEVEL_INFO should be 8"
    
    result = driver.execute_script("return sysLogger.LOG_LEVEL_DEBUG;")
    assert result == 10, "LOG_LEVEL_DEBUG should be 10"
    
    logger.info('Logger constants test passed')
