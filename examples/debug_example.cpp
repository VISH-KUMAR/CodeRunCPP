#include <iostream>
#include <vector>

// Function to calculate factorial
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// Function with a bug for demonstration
int buggySum(const std::vector<int>& numbers) {
    int sum = 0;
    // Bug: Loop starts from 1 instead of 0, missing the first element
    for (size_t i = 1; i < numbers.size(); i++) {
        sum += numbers[i];
    }
    return sum;
}

// Function to find max value
int findMax(const std::vector<int>& numbers) {
    if (numbers.empty()) return 0;
    
    int max = numbers[0];
    for (size_t i = 1; i < numbers.size(); i++) {
        if (numbers[i] > max) {
            max = numbers[i];
        }
    }
    return max;
}

int main() {
    std::cout << "C++ Debugger Example Program" << std::endl;
    std::cout << "===========================" << std::endl;
    
    // Create a vector with some values
    std::vector<int> values = {5, 2, 9, 1, 7, 3};
    
    // Print the values
    std::cout << "Values: ";
    for (const auto& val : values) {
        std::cout << val << " ";
    }
    std::cout << std::endl;
    
    // Calculate sum using the buggy function
    int buggyResult = buggySum(values);
    std::cout << "Buggy sum: " << buggyResult << std::endl;
    
    // Calculate factorial of 5
    int fact = factorial(5);
    std::cout << "Factorial of 5: " << fact << std::endl;
    
    // Find maximum value
    int max = findMax(values);
    std::cout << "Maximum value: " << max << std::endl;
    
    // Simple loop for stepping through
    std::cout << "Counting: ";
    for (int i = 0; i < 5; i++) {
        std::cout << i << " ";
    }
    std::cout << std::endl;
    
    return 0;
}
