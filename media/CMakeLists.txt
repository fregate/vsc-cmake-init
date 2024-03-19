cmake_minimum_required(VERSION 3.14)

project(
    ${projectName}
    VERSION 0.1.0
    LANGUAGES CXX
    ${projectDescription}
)

# ---- Declare executable ----
add_executable(${outputName} src/main.cpp)

target_compile_features(${outputName} PRIVATE ${cppStandart})
