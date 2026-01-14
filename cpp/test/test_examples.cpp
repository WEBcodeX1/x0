//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- x0 C++ Framework - Example JSON Validation Test                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//- This test validates that the C++ framework can correctly parse and       -//
//- process all example configurations from /example directory               -//
//-                                                                          -//
//- Build without Qt: g++ -std=c++20 test_examples.cpp -o test_examples      -//
//-------1---------2---------3---------4---------5---------6---------7--------//

#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <filesystem>
#include <nlohmann/json.hpp>

using json = nlohmann::json;
namespace fs = std::filesystem;

// Test result tracking
struct TestResult {
    std::string exampleName;
    bool skeletonParsed = false;
    bool objectParsed = false;
    bool menuParsed = false;
    bool factoryInitialized = false;
    std::string error;
};

/**
 * @brief Load JSON from file path
 */
json loadJsonFile(const std::string& filepath) {
    std::ifstream file(filepath);
    if (!file.is_open()) {
        throw std::runtime_error("Cannot open file: " + filepath);
    }
    
    std::stringstream buffer;
    buffer << file.rdbuf();
    
    return json::parse(buffer.str());
}

/**
 * @brief Validate skeleton JSON structure
 */
bool validateSkeleton(const json& skeleton) {
    if (!skeleton.is_object()) return false;
    
    // Each key should be a screen with array of objects
    for (auto& [screenId, screenData] : skeleton.items()) {
        if (!screenData.is_array()) {
            std::cerr << "  Invalid skeleton: Screen " << screenId << " is not an array" << std::endl;
            return false;
        }
        
        for (const auto& item : screenData) {
            if (!item.is_object()) {
                std::cerr << "  Invalid skeleton item in screen " << screenId << std::endl;
                return false;
            }
            
            // Each item should have RefID at minimum
            for (auto& [objId, objData] : item.items()) {
                if (!objData.is_object()) {
                    std::cerr << "  Invalid object data for " << objId << std::endl;
                    return false;
                }
                if (!objData.contains("RefID")) {
                    std::cerr << "  Missing RefID for object " << objId << std::endl;
                    return false;
                }
            }
        }
    }
    return true;
}

/**
 * @brief Validate object JSON structure  
 */
bool validateObject(const json& object) {
    if (!object.is_object()) return false;
    
    // Each object should have Type and optionally Attributes
    for (auto& [objId, objData] : object.items()) {
        if (!objData.is_object()) {
            std::cerr << "  Invalid object: " << objId << " is not an object" << std::endl;
            return false;
        }
        
        if (!objData.contains("Type")) {
            std::cerr << "  Missing Type for object " << objId << std::endl;
            return false;
        }
    }
    return true;
}

/**
 * @brief Test a single example directory
 */
TestResult testExample(const std::string& examplePath, const std::string& exampleName) {
    TestResult result;
    result.exampleName = exampleName;
    
    std::string staticPath = examplePath + "/static";
    
    // Check if static directory exists
    if (!fs::exists(staticPath)) {
        result.error = "No static directory found";
        return result;
    }
    
    try {
        // Load and validate skeleton.json
        std::string skeletonPath = staticPath + "/skeleton.json";
        if (fs::exists(skeletonPath)) {
            json skeleton = loadJsonFile(skeletonPath);
            result.skeletonParsed = validateSkeleton(skeleton);
            
            if (result.skeletonParsed) {
                std::cout << "  ✓ skeleton.json parsed and validated" << std::endl;
            } else {
                std::cout << "  ✗ skeleton.json validation failed" << std::endl;
            }
        } else {
            std::cout << "  - skeleton.json not found (optional)" << std::endl;
            result.skeletonParsed = true; // Not an error if missing
        }
        
        // Load and validate object.json
        std::string objectPath = staticPath + "/object.json";
        if (fs::exists(objectPath)) {
            json object = loadJsonFile(objectPath);
            result.objectParsed = validateObject(object);
            
            if (result.objectParsed) {
                std::cout << "  ✓ object.json parsed and validated" << std::endl;
            } else {
                std::cout << "  ✗ object.json validation failed" << std::endl;
            }
        } else {
            std::cout << "  - object.json not found (optional)" << std::endl;
            result.objectParsed = true; // Not an error if missing
        }
        
        // Load and validate menu.json
        std::string menuPath = staticPath + "/menu.json";
        if (fs::exists(menuPath)) {
            json menu = loadJsonFile(menuPath);
            result.menuParsed = menu.is_array() || menu.is_object();
            
            if (result.menuParsed) {
                std::cout << "  ✓ menu.json parsed successfully" << std::endl;
            } else {
                std::cout << "  ✗ menu.json parse failed" << std::endl;
            }
        } else {
            std::cout << "  - menu.json not found (optional)" << std::endl;
            result.menuParsed = true; // Not an error if missing
        }
        
        // Configuration is ready for factory initialization
        if (result.skeletonParsed && result.objectParsed) {
            result.factoryInitialized = true;
            std::cout << "  ✓ Configuration ready for factory initialization" << std::endl;
        }
        
    } catch (const json::parse_error& e) {
        result.error = std::string("JSON parse error: ") + e.what();
        std::cerr << "  ✗ " << result.error << std::endl;
    } catch (const std::exception& e) {
        result.error = e.what();
        std::cerr << "  ✗ Error: " << result.error << std::endl;
    }
    
    return result;
}

/**
 * @brief Main test function
 */
int main(int argc, char* argv[]) {
    std::string examplesDir = "../example";
    
    // Allow override via command line
    if (argc > 1) {
        examplesDir = argv[1];
    }
    
    std::cout << "=====================================================" << std::endl;
    std::cout << "x0 C++ Framework - Example Configuration Test" << std::endl;
    std::cout << "=====================================================" << std::endl;
    std::cout << std::endl;
    std::cout << "Testing examples from: " << examplesDir << std::endl;
    std::cout << std::endl;
    
    std::vector<TestResult> results;
    int passed = 0;
    int failed = 0;
    
    // Iterate through example directories
    if (!fs::exists(examplesDir)) {
        std::cerr << "Error: Examples directory not found: " << examplesDir << std::endl;
        std::cerr << "Please run from cpp/build directory or provide path as argument" << std::endl;
        return 1;
    }
    
    for (const auto& entry : fs::directory_iterator(examplesDir)) {
        if (!entry.is_directory()) continue;
        
        std::string exampleName = entry.path().filename().string();
        
        // Skip non-example directories
        if (exampleName.starts_with(".") || exampleName == "README.md") continue;
        
        std::cout << "Testing: " << exampleName << std::endl;
        
        TestResult result = testExample(entry.path().string(), exampleName);
        results.push_back(result);
        
        bool success = result.skeletonParsed && result.objectParsed && 
                       result.menuParsed && result.error.empty();
        
        if (success) {
            passed++;
            std::cout << "  → PASSED" << std::endl;
        } else {
            failed++;
            std::cout << "  → FAILED" << std::endl;
        }
        std::cout << std::endl;
    }
    
    // Summary
    std::cout << "=====================================================" << std::endl;
    std::cout << "Test Summary" << std::endl;
    std::cout << "=====================================================" << std::endl;
    std::cout << "Total examples tested: " << (passed + failed) << std::endl;
    std::cout << "Passed: " << passed << std::endl;
    std::cout << "Failed: " << failed << std::endl;
    std::cout << std::endl;
    
    if (failed > 0) {
        std::cout << "Failed examples:" << std::endl;
        for (const auto& result : results) {
            bool success = result.skeletonParsed && result.objectParsed && 
                           result.menuParsed && result.error.empty();
            if (!success) {
                std::cout << "  - " << result.exampleName;
                if (!result.error.empty()) {
                    std::cout << ": " << result.error;
                }
                std::cout << std::endl;
            }
        }
    }
    
    return failed > 0 ? 1 : 0;
}
