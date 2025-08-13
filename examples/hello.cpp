#include <iostream>
#include <vector>
#include <string>

/**
 * Simple C++ program to demonstrate the C++ Web App functionality
 * This program showcases basic input/output, variables, and control structures
 */
int main() {
    // Greeting
    std::cout << "Hello from the C++ Web App!\n";
    std::cout << "This is a test program to demonstrate functionality.\n\n";
    
    // Variables and basic operations
    int num1 = 10;
    int num2 = 5;
    
    std::cout << "Basic Math Operations:\n";
    std::cout << num1 << " + " << num2 << " = " << (num1 + num2) << "\n";
    std::cout << num1 << " - " << num2 << " = " << (num1 - num2) << "\n";
    std::cout << num1 << " * " << num2 << " = " << (num1 * num2) << "\n";
    std::cout << num1 << " / " << num2 << " = " << (num1 / num2) << "\n\n";
    
    // Vector example
    std::vector<std::string> fruits = {"Apple", "Banana", "Cherry", "Date"};
    
    std::cout << "Fruits in the vector:\n";
    for (const auto& fruit : fruits) {
        std::cout << "- " << fruit << "\n";
    }
    
    // User input example
    std::cout << "\nPlease enter your name: ";
    std::string name;
    std::getline(std::cin, name);
    
    if (!name.empty()) {
        std::cout << "Hello, " << name << "! Thanks for trying the C++ Web App.\n";
    } else {
        std::cout << "You didn't enter a name, but that's okay!\n";
    }
    
    return 0;
}
