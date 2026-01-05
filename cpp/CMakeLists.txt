#-------1---------2---------3---------4---------5---------6---------7--------#
#- Copyright WEB/codeX, clickIT 2011 - 2025                                 -#
#-------1---------2---------3---------4---------5---------6---------7--------#
#-                                                                          -#
#-------1---------2---------3---------4---------5---------6---------7--------#
#- x0 C++ Framework - CMake Build Configuration                             -#
#-------1---------2---------3---------4---------5---------6---------7--------#

cmake_minimum_required(VERSION 3.16)
project(x0-cpp VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)

# Find required packages
find_package(Qt6 COMPONENTS Core Widgets QUIET)
if(NOT Qt6_FOUND)
    find_package(Qt5 5.15 COMPONENTS Core Widgets REQUIRED)
    set(QT_LIBS Qt5::Core Qt5::Widgets)
else()
    set(QT_LIBS Qt6::Core Qt6::Widgets)
endif()

# nlohmann/json - Header-only library
# Can be installed via: apt-get install nlohmann-json3-dev
# Or fetched automatically
include(FetchContent)
FetchContent_Declare(
    json
    GIT_REPOSITORY https://github.com/nlohmann/json.git
    GIT_TAG v3.11.3
)
FetchContent_MakeAvailable(json)

# Include directories
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/include)

# Source files
set(X0_SOURCES
    src/x0BaseElement.cpp
    src/x0BaseObject.cpp
    src/x0Factory.cpp
    src/x0Screen.cpp
    src/x0Reactor.cpp
    src/x0ObjDiv.cpp
    src/x0ObjButton.cpp
    src/main.cpp
)

# Header files
set(X0_HEADERS
    include/x0BaseElement.h
    include/x0BaseObject.h
    include/x0Factory.h
    include/x0Screen.h
    include/x0Reactor.h
    include/x0ObjDiv.h
    include/x0ObjButton.h
)

# Create executable
add_executable(x0-app ${X0_SOURCES} ${X0_HEADERS})

# Link libraries
target_link_libraries(x0-app PRIVATE
    ${QT_LIBS}
    nlohmann_json::nlohmann_json
)

# Install targets
install(TARGETS x0-app DESTINATION bin)
install(FILES ${X0_HEADERS} DESTINATION include/x0)
