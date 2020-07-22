---
layout: post
comments: true
title: Exceptions in C++
description: Learn how to create and handle exceptions in C++
canonical_url: https://iq.opengenus.org/exception-handling-cpp/
tags: c++ c++14 c++17 c++11
image: blog3.png
---


Exceptions are scary but we must know how to handle them when they try to sabotage our program flow. 
In this post I will go from A to E (pun intended ;) of handling **Exceptions in C++**.

## Contents
* [Basics](#basics)
* [try](#try)
* [throw](#throw)
* [catch](#catch)
* [Custom Exceptions](#customexceptions)
* [std::cerr](#stdcerr)

## Basics
Let's learn the basics first 
> Exceptions are runtime anomalies or unusual conditions that a program may encounter during its execution.

C++ provides us with 3 special keywords **try**,**catch** & **throw**.
Lets try visiting them one by one .

## try
The keyword try is used to preface the code you want to test i.e all the code to be tested for exceptions is put inside the try block
For example
```cpp
try {
    /* code to be checked */
}
```

## throw

An exception is thrown by using the *throw* keyword from inside the try block.
```cpp
try {
    throw exception;
}
```
A `throw` expression triggers that an exception condition (error) has occurred in a try block. You can use an object of any type as the operand of a throw expression i.e `exception` can be of any object type or variable. Typically, this object is used to communicate information about the error.

## catch 
So you threw an exception now what, you want it to be handled right ??
That's where catch *comes* to play. A catch is just a code block similar to try 
```cpp
catch(type obj) {
    /* code to handle exception */
}
```

![exception1](https://raw.githubusercontent.com/Bhupesh-V/Bhupesh-V.github.io/master/images/sample_layout.png)

To handle exceptions that may be thrown, implement one or more catch blocks immediately following a try block. Each catch block specifies the type of exception it can handle i.e if you threw more than one type of `exception` you would have to implement multiple catch blocks to handle them.
```cpp
catch(type obj1) {
    /* code to handle exception of type 1*/
}
catch(type obj2) {
    /* code to handle exception of type 2*/
}
catch(type ob3) {
    /* code to handle exception of type 3*/
}
```
If the type of object thrown by the `try` block matches the any *obj* type in any catch statement than that catch block is executed.
For handling exceptions of any type other than thrown by you 
Ellipses (...) is used in the catch block arguments.

```cpp
catch(...) {
    /* Catches any kind of exception */
}
```

So far the code structure looks like
```cpp
try {
    throw obj1;
    throw obj3;
}

catch(type obj1) {
    std::cout<<"Caught Exception of type obj1 ";
}
catch(type obj3) {
    std::cout<<"Caught Exception of type obj3 ";
}
catch(...){
    std::cout<<"Last catch block ";
}
```
Note that once a exception is thrown it is matched with the catch blocks one by one if a match is found than that block is executed else it continues on checking for a match.
If no catch block matches, the last `catch(...)` block is executed.

## Example
Below is a simple implementation of the things we learned so far.
The program does division of two numbers and if the Denominator is 0 it throws an exception.

```cpp
#include <iostream>

int main(){
    int a, b, c;
    std::cout<<"\nEnter Numerator & Denominator : ";
    std::cin >> a >> b;
    // try block to handle exception handling
    try {
        if(b == 0){
            throw "Division by Zero Error";     // throw custom exception
        }
        c = a/b;
        std::cout<<"\nDivision Result = " << c; 
    }
    catch(char* exception){ // catches exception
        std::cout << exception;
    }
    return 0;
}
```
The above program prints
```cpp 
Enter Numerator & Denominator : 2 0
Division by Zero Error
```

## Custom Exceptions
We can define our own exceptions in C++ by inheriting from the class `Exception` and overriding its `what()` function.
Here is a sample code
```cpp
#include <iostream>
#include <exception>
 
class MyException : public exception {
 public:
    const char * what () {
      return "Custom C++ Exception";
   }
};
 
int main() {
   try {
      throw MyException();
   }catch(MyException e) {
      std::cout << "MyException caught" <<endl;
      std::cout << e.what() <<endl;
   }
   return 0;
}
```
The above program would print
```cpp
MyException caught
Custom C++ Exception
```
`what()` is a predefined function in the `<exception>` header which just returns an explanatory string regarding the exception.

## std::cerr
Just like we use `std::cout` to write data to standard *output stream* and `std::cin` for input .
`std::cerr` is used to write data to standard error stream.
> The 'c' in the name refers to "character";
> cerr means "character error (stream)" 

For example
```cpp
#include <iostream>
int main(){
  std::cerr << "Error Stream !";
}
```

Hope you learned something new today !! :)